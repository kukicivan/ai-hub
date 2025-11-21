function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);

    let result;

    if (request.action === 'getEmailsAsThreads') {
      result = getEmailsAsThreads(
        request.query || 'is:unread',
        request.maxResults || 10,
        request.includeBody || false,
        request.startIndex || 0  // NEW: offset parameter
      );
    } else {
      throw new Error(`Invalid action: ${request.action}`);
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getEmailsAsThreads(query, maxResults, includeBody, startIndex) {
  try {
    // Gmail search with start parameter (offset)
    const threads = GmailApp.search(query, startIndex || 0, maxResults);
    const threadData = [];

    threads.forEach(thread => {
      const threadId = thread.getId();
      const subject = thread.getFirstMessageSubject();
      const labels = thread.getLabels().map(l => l.getName().toUpperCase());

      const threadInfo = {
        id: threadId,
        subject: subject,
        labels: labels,
        messageCount: thread.getMessageCount(),
        messages: []
      };

      thread.getMessages().forEach(message => {
        const date = message.getDate();
        const plainBody = message.getPlainBody() || '';

        const messageData = {
          id: message.getId(),
          threadId: threadId,
          snippet: plainBody.substring(0, 200),
          subject: message.getSubject(),
          from: message.getFrom(),
          to: message.getTo(),
          cc: message.getCc() || '',
          date: date.toISOString(),
          isUnread: message.isUnread()
        };

        // Only include full body if requested
        if (includeBody === true) {
          messageData.body = plainBody;
          messageData.htmlBody = message.getBody() || '';
        }

        threadInfo.messages.push(messageData);
      });

      threadData.push(threadInfo);
    });

    return threadData;

  } catch (error) {
    throw new Error(`Failed to get emails: ${error.toString()}`);
  }
}