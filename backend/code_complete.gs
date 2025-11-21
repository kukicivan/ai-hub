/**
 * COMPLETE GMAIL APPSCRIPT - ALL API FIELDS MAPPED
 * Maps to IMessage interface with full Gmail API data
 */

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);

    const apiKey = 'KDd4mUiWT1mXSsTrOFF6mjcjhxiNgA7236apVgYcdayGycZhB91BOQfY51LjbazZifHrJ3Ln0zw1S7eMGKHAqj8rkEJTKAs4ZruKUoQkqC5E4sOsFhztvdob14019lbI';
    if(request.apiKey !== apiKey) {
        return ContentService
              .createTextOutput(JSON.stringify({
                success: false,
                error: 'Unauthorized',
                stack: 'API Key mismatch'
              }))
              .setMimeType(ContentService.MimeType.JSON);
    }
    
    let result;
    
    switch(request.action) {
      case 'getEmailsAsThreads':
        result = getEmailsAsThreads(
          request.query || 'is:unread',
          request.maxResults || 10,
          request.includeBody || false,
          request.includeHeaders || false,
          request.includeAttachments || false,
          request.startIndex || 0
        );
        break;
        
      case 'getSingleThread':
        result = getSingleThread(
          request.threadId,
          request.includeBody || false,
          request.includeHeaders || false,
          request.includeAttachments || false
        );
        break;
        
      case 'getHistoryChanges':
        result = getHistoryChanges(
          request.historyId,
          request.includeBody || false,
          request.includeHeaders || false,
          request.includeAttachments || false
        );
        break;

      case 'markAsRead':
        result = markThreadAsRead(request.threadId);
        break;

      case 'markAsUnread':
        result = markThreadAsUnread(request.threadId);
        break;

      // Receive a reply payload from external service and send via Gmail
      case 'postReply':
        result = postReply(request.payload || request.reply || request);
        break;

      default:
        throw new Error(`Invalid action: ${request.action}`);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: result
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET EMAILS AS THREADS - COMPLETE VERSION
 */
function getEmailsAsThreads(query, maxResults, includeBody, includeHeaders, includeAttachments, startIndex) {
  try {
    const threads = GmailApp.search(query, startIndex || 0, maxResults);
    const threadData = [];

    threads.forEach(thread => {
      const threadInfo = extractThreadData(thread, includeBody, includeHeaders, includeAttachments);
      threadData.push(threadInfo);
    });

    // Get current historyId for future incremental syncs
    const historyId = getCurrentHistoryId();

    return {
      threads: threadData,
      historyId: historyId,
      totalReturned: threadData.length,
      query: query,
      startIndex: startIndex || 0
    };

  } catch (error) {
    throw new Error(`Failed to get emails: ${error.toString()}`);
  }
}

/**
 * GET HISTORY CHANGES - Incremental sync using Gmail History API
 */
function getHistoryChanges(startHistoryId, includeBody, includeHeaders, includeAttachments) {
  try {
    const userEmail = Session.getActiveUser().getEmail();

    // Get history changes from Gmail API
    const history = Gmail.Users.History.list(userEmail, {
      startHistoryId: startHistoryId,
      historyTypes: ['messageAdded', 'labelAdded', 'labelRemoved']
    });

    if (!history.history || history.history.length === 0) {
      return {
        threads: [],
        historyId: history.historyId || startHistoryId,
        totalReturned: 0,
        hasChanges: false
      };
    }

    // Collect unique thread IDs from history
    const threadIds = new Set();

    history.history.forEach(historyItem => {
      if (historyItem.messagesAdded) {
        historyItem.messagesAdded.forEach(item => {
          threadIds.add(item.message.threadId);
        });
      }
      if (historyItem.labelsAdded) {
        historyItem.labelsAdded.forEach(item => {
          threadIds.add(item.message.threadId);
        });
      }
      if (historyItem.labelsRemoved) {
        historyItem.labelsRemoved.forEach(item => {
          threadIds.add(item.message.threadId);
        });
      }
    });

    // Fetch full thread data for changed threads
    const threadData = [];
    threadIds.forEach(threadId => {
      try {
        const thread = GmailApp.getThreadById(threadId);
        if (thread) {
          const threadInfo = extractThreadData(thread, includeBody, includeHeaders, includeAttachments);
          threadData.push(threadInfo);
        }
      } catch (e) {
        // Thread might be deleted, skip it
        Logger.log(`Skipping thread ${threadId}: ${e.toString()}`);
      }
    });

    return {
      threads: threadData,
      historyId: history.historyId,
      totalReturned: threadData.length,
      hasChanges: true
    };

  } catch (error) {
    throw new Error(`Failed to get history changes: ${error.toString()}`);
  }
}

/**
 * GET CURRENT HISTORY ID
 */
function getCurrentHistoryId() {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const profile = Gmail.Users.getProfile(userEmail);
    return profile.historyId;
  } catch (error) {
    Logger.log(`Failed to get historyId: ${error.toString()}`);
    return null;
  }
}

/**
 * GET SINGLE THREAD BY ID
 */
function getSingleThread(threadId, includeBody, includeHeaders, includeAttachments) {
  try {
    const thread = GmailApp.getThreadById(threadId);
    if (!thread) {
      throw new Error(`Thread not found: ${threadId}`);
    }
    
    return extractThreadData(thread, includeBody, includeHeaders, includeAttachments);
    
  } catch (error) {
    throw new Error(`Failed to get thread: ${error.toString()}`);
  }
}

/**
 * EXTRACT COMPLETE THREAD DATA
 */
function extractThreadData(thread, includeBody, includeHeaders, includeAttachments) {
  const threadId = thread.getId();
  const subject = thread.getFirstMessageSubject();
  const labels = thread.getLabels().map(l => ({
    id: l.getName().replace(/\s+/g, '_').toUpperCase(),
    name: l.getName(),
    type: isSystemLabel(l.getName()) ? 'system' : 'user'
  }));
  
  const threadInfo = {
    // Thread-level data
    thread: {
      id: threadId,
      subject: subject,
      messageCount: thread.getMessageCount(),
      isUnread: thread.isUnread(),
      hasStarredMessages: thread.hasStarredMessages(),
      isImportant: thread.isImportant(),
      isInInbox: thread.isInInbox(),
      isInChats: thread.isInChats(),
      isInSpam: thread.isInSpam(),
      isInTrash: thread.isInTrash(),
      isInPriorityInbox: thread.isInPriorityInbox(),
      lastMessageDate: thread.getLastMessageDate().toISOString(),
      permalink: thread.getPermalink(),
      labels: labels
    },
    
    // Messages in thread
    messages: []
  };

  const messages = thread.getMessages();
  messages.forEach((message, index) => {
    const messageData = extractMessageData(
      message, 
      threadId, 
      index + 1,
      includeBody, 
      includeHeaders, 
      includeAttachments
    );
    threadInfo.messages.push(messageData);
  });

  return threadInfo;
}

/**
 * EXTRACT COMPLETE MESSAGE DATA
 */
function extractMessageData(message, threadId, messageNumber, includeBody, includeHeaders, includeAttachments) {
  const date = message.getDate();
  const from = parseEmailAddress(message.getFrom());
  const to = parseEmailAddresses(message.getTo());
  const cc = parseEmailAddresses(message.getCc());
  const bcc = parseEmailAddresses(message.getBcc());
  const replyTo = parseEmailAddresses(message.getReplyTo());
  
  const plainBody = message.getPlainBody() || '';
  const snippet = plainBody.substring(0, 200);
  
  const messageData = {
    // Core identifiers
    id: message.getId(),
    threadId: threadId,
    messageNumber: messageNumber,
    
    // Timestamps
    timestamp: date.toISOString(),
    receivedDate: date.toISOString(),
    
    // Channel info
    channel: {
      type: 'gmail',
      id: Session.getActiveUser().getEmail(),
      name: Session.getActiveUser().getEmail()
    },
    
    // Participants
    sender: from,
    recipients: {
      to: to,
      cc: cc,
      bcc: bcc,
      replyTo: replyTo.length > 0 ? replyTo : undefined
    },
    
    // Content
    content: {
      text: plainBody,
      snippet: snippet
    },
    
    // Metadata
    metadata: {
      subject: message.getSubject(),
      isDraft: message.isDraft(),
      isUnread: message.isUnread(),
      isStarred: message.isStarred(),
      isInTrash: message.isInTrash(),
      isInInbox: message.isInInbox(),
      isInChats: message.isInChats(),
      isInPriorityInbox: message.isInPriorityInbox(),
      isSpam: false  // Check thread level
    }
  };
  
  // Add HTML body if requested
  if (includeBody === true) {
    messageData.content.html = message.getBody();
    messageData.content.rawContent = message.getRawContent();
  }
  
  // Add headers if requested
  if (includeHeaders === true) {
    messageData.metadata.headers = extractHeaders(message);
    
    // Parse priority from headers
    const priority = parsePriority(messageData.metadata.headers);
    if (priority) {
      messageData.metadata.priority = priority;
    }
  }
  
  // Add attachments if requested
  if (includeAttachments === true) {
    messageData.content.attachments = extractAttachments(message);
  } else {
    // Just count them
    messageData.content.attachmentCount = message.getAttachments().length;
  }
  
  // Add reactions (stars)
  if (message.isStarred()) {
    messageData.content.reactions = [{
      type: 'star',
      timestamp: date.toISOString()
    }];
  }
  
  return messageData;
}

/**
 * EXTRACT ALL IMPORTANT HEADERS
 */
function extractHeaders(message) {
  const importantHeaders = [
    'Message-ID',
    'In-Reply-To',
    'References',
    'List-Unsubscribe',
    'Return-Path',
    'Delivered-To',
    'Received-SPF',
    'Authentication-Results',
    'DKIM-Signature',
    'X-Mailer',
    'X-Priority',
    'Importance',
    'X-Spam-Score',
    'X-Spam-Status'
  ];
  
  const headers = {
    custom: {}
  };
  
  importantHeaders.forEach(headerName => {
    const value = message.getHeader(headerName);
    if (value) {
      const key = headerName.toLowerCase().replace(/-/g, '');
      
      // Map to known fields
      if (headerName === 'Message-ID') {
        headers.messageId = value;
      } else if (headerName === 'In-Reply-To') {
        headers.inReplyTo = value;
      } else if (headerName === 'List-Unsubscribe') {
        headers.listUnsubscribe = value;
      } else if (headerName === 'Return-Path') {
        headers.returnPath = value;
      } else if (headerName === 'Delivered-To') {
        headers.deliveredTo = value;
      } else if (headerName === 'Received-SPF') {
        headers.receivedSpf = value;
      } else if (headerName === 'Authentication-Results') {
        headers.authentication = value;
      } else {
        headers.custom[headerName] = value;
      }
    }
  });
  
  // Parse References into array
  if (headers.custom['References']) {
    headers.references = headers.custom['References'].split(/\s+/).filter(r => r.length > 0);
  }
  
  return headers;
}

/**
 * EXTRACT ATTACHMENTS WITH METADATA
 */
function extractAttachments(message) {
  const attachments = message.getAttachments();
  
  return attachments.map((attachment, index) => ({
    id: `${message.getId()}_${index}`,
    name: attachment.getName(),
    mimeType: attachment.getContentType(),
    size: attachment.getSize(),
    isInline: attachment.isGoogleType(),
    hash: attachment.getHash(),
    // Note: blob data not included by default (too large)
    // Can be fetched separately if needed
  }));
}

/**
 * PARSE EMAIL ADDRESS STRING
 * Handles formats like "John Doe <john@example.com>" or just "john@example.com"
 */
function parseEmailAddress(emailString) {
  if (!emailString) return null;
  
  const match = emailString.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return {
      name: match[1].trim().replace(/^["']|["']$/g, ''),
      email: match[2].trim(),
      raw: emailString
    };
  }
  
  return {
    email: emailString.trim(),
    raw: emailString
  };
}

/**
 * PARSE MULTIPLE EMAIL ADDRESSES (comma/semicolon separated)
 */
function parseEmailAddresses(emailString) {
  if (!emailString) return [];
  
  const addresses = emailString.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
  return addresses.map(addr => parseEmailAddress(addr));
}

/**
 * PARSE PRIORITY FROM HEADERS
 */
function parsePriority(headers) {
  if (!headers || !headers.custom) return null;
  
  // Check X-Priority header (1-5, where 1 is highest)
  if (headers.custom['X-Priority']) {
    const priority = parseInt(headers.custom['X-Priority']);
    if (priority <= 2) return 'high';
    if (priority >= 4) return 'low';
    return 'normal';
  }
  
  // Check Importance header
  if (headers.custom['Importance']) {
    const importance = headers.custom['Importance'].toLowerCase();
    if (importance === 'high') return 'high';
    if (importance === 'low') return 'low';
  }
  
  return 'normal';
}

/**
 * CHECK IF LABEL IS SYSTEM LABEL
 */
function isSystemLabel(labelName) {
  const systemLabels = [
    'INBOX', 'SENT', 'DRAFT', 'SPAM', 'TRASH', 
    'IMPORTANT', 'STARRED', 'UNREAD', 'CHAT',
    'CATEGORY_PERSONAL', 'CATEGORY_SOCIAL', 
    'CATEGORY_PROMOTIONS', 'CATEGORY_UPDATES', 
    'CATEGORY_FORUMS'
  ];
  
  return systemLabels.includes(labelName.toUpperCase());
}

/**
 * MARK THREAD AS READ
 */
function markThreadAsRead(threadId) {
  try {
    const thread = GmailApp.getThreadById(threadId);
    if (!thread) {
      throw new Error(`Thread not found: ${threadId}`);
    }
    
    thread.markRead();
    
    return {
      threadId: threadId,
      action: 'marked_read',
      success: true
    };
    
  } catch (error) {
    throw new Error(`Failed to mark as read: ${error.toString()}`);
  }
}

/**
 * MARK THREAD AS UNREAD
 */
function markThreadAsUnread(threadId) {
  try {
    const thread = GmailApp.getThreadById(threadId);
    if (!thread) {
      throw new Error(`Thread not found: ${threadId}`);
    }
    
    thread.markUnread();
    
    return {
      threadId: threadId,
      action: 'marked_unread',
      success: true
    };
    
  } catch (error) {
    throw new Error(`Failed to mark as unread: ${error.toString()}`);
  }
}

/**
 * ADDITIONAL HELPER FUNCTIONS FOR FUTURE USE
 */

// Get attachment blob (for download)
function getAttachmentBlob(messageId, attachmentIndex) {
  const message = GmailApp.getMessageById(messageId);
  const attachments = message.getAttachments();
  
  if (attachmentIndex < attachments.length) {
    return attachments[attachmentIndex].copyBlob();
  }
  
  throw new Error('Attachment not found');
}

// Search with complex queries
function searchEmails(query, options = {}) {
  const {
    maxResults = 10,
    startIndex = 0,
    includeBody = false,
    includeHeaders = false,
    includeAttachments = false
  } = options;
  
  return getEmailsAsThreads(
    query, 
    maxResults, 
    includeBody, 
    includeHeaders, 
    includeAttachments, 
    startIndex
  );
}

// Get unread count
function getUnreadCount() {
  return GmailApp.getInboxUnreadCount();
}

// Get account info
function getAccountInfo() {
  return {
    email: Session.getActiveUser().getEmail(),
    timezone: Session.getScriptTimeZone(),
    locale: Session.getActiveUserLocale()
  };
}


/**
 * POST REPLY (minimal): send a reply object via Gmail
 * Expected payload: { to: 'recipient@example.com', subject: '...', body: '...' }
 */
function postReply(payload) {
  try {
    if (!payload || !payload.to || !payload.body) {
      throw new Error('Invalid payload: to and body are required');
    }

    var to = payload.to;
    var subject = payload.subject || '';
    var body = payload.body;

    // Send the email. Note: sending from a different address requires alias setup.
    GmailApp.sendEmail(to, subject, body);

    return {
      success: true,
      action: 'postReply',
      to: to,
      subject: subject
    };
  } catch (error) {
    Logger.log('postReply error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}