# Email API V5 Documentation

## Overview
The V5 API endpoint provides an enhanced structure for email messages with comprehensive AI analysis, designed to match the requirements for business intelligence and automated email processing.

## Endpoint
```
GET /api/email/messages/v5
```

## Response Structure

Each email message in the response follows this structure:

```json
{
  "id": "19a495e57676efa9",
  "sender": "marketing@datappeal.io",
  "subject": "Download your free October insights and reports",
  "summary": "Newsletter sa informacijama o turizmu i marketinškim izveštajima",
  "sentiment": {
    "tone": "promotional",
    "urgency_score": 2,
    "business_potential": 2
  },
  "gmail_link": "https://mail.google.com/mail/u/0/#inbox/19a495e57676efa9",
  "action_steps": [
    {
      "type": "ARCHIVE",
      "deadline": null,
      "timeline": "nema_deadline",
      "description": "Arhiviraj email kao newsletter bez direktne poslovne prilike",
      "estimated_time": 0,
      "template_suggestion": null
    }
  ],
  "html_analysis": {
    "cleaned_text": "All Italian Data 2025, outdoor travel, plus the success story of Visit Sacramento. Explore all the new free content today.",
    "is_newsletter": true,
    "urgency_markers": [],
    "structure_detected": "newsletter"
  },
  "classification": {
    "primary_category": "marketing",
    "subcategory": "newsletter",
    "confidence_score": 0.95,
    "matched_keywords": ["newsletter", "report", "data"]
  },
  "recommendation": {
    "text": "Nema direktne poslovne prilike. Newsletter sa informacijama o turizmu i marketinškim izveštajima.",
    "reasoning": "Newsletter sadrži informacije o turizmu i marketinškim izveštajima, ali ne sadrži direktne poslovne prilike.",
    "priority_level": "low",
    "roi_estimate": "N/A"
  }
}
```

## Field Descriptions

### Core Fields
- **id**: Gmail message ID (unique identifier)
- **sender**: Email address of the sender
- **subject**: Email subject line
- **summary**: AI-generated summary of the email content
- **gmail_link**: Direct link to view the message in Gmail

### Sentiment Analysis
- **tone**: The emotional tone of the email (e.g., promotional, professional, urgent)
- **urgency_score**: Scale of 0-10 indicating how urgent the email is
- **business_potential**: Scale of 0-10 indicating potential business value

### Action Steps
Array of recommended actions, each containing:
- **type**: Action type (e.g., ARCHIVE, REPLY, FORWARD, SCHEDULE_MEETING)
- **deadline**: ISO 8601 date/time if time-sensitive
- **timeline**: Human-readable timeline description
- **description**: Detailed description of the action
- **estimated_time**: Estimated time in minutes to complete
- **template_suggestion**: Suggested response template (if applicable)

### HTML Analysis
- **cleaned_text**: Extracted plain text from HTML content
- **is_newsletter**: Boolean indicating if this is a newsletter
- **urgency_markers**: Array of detected urgency indicators
- **structure_detected**: Type of email structure (e.g., newsletter, invoice, personal)

### Classification
- **primary_category**: Main category (e.g., marketing, sales, support)
- **subcategory**: Specific subcategory
- **confidence_score**: AI confidence level (0.0 to 1.0)
- **matched_keywords**: Keywords that triggered the classification

### Recommendation
- **text**: Summary recommendation text
- **reasoning**: Explanation of the recommendation
- **priority_level**: Priority rating (low, medium, high)
- **roi_estimate**: Estimated return on investment or "N/A"

## Query Parameters

All standard email API filters are supported:

- `page` (integer): Page number for pagination
- `per_page` (integer): Items per page (max 200, default 25)
- `q` (string): Search query (searches subject, sender, content)
- `unread` (boolean): Filter by read/unread status
- `priority` (string): Filter by priority (low, normal, high)
- `channel_id` (integer): Filter by messaging channel
- `sort` (string): Sort field (created_at, message_timestamp, priority)

## Response Format

```json
{
  "success": true,
  "data": [
    { /* email message objects */ }
  ],
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 150,
    "total_pages": 6
  }
}
```

## Example Usage

### Basic Request
```bash
curl -X GET "http://localhost:8000/api/email/messages/v5"
```

### With Filters
```bash
curl -X GET "http://localhost:8000/api/email/messages/v5?unread=true&priority=high&per_page=50"
```

### Search Query
```bash
curl -X GET "http://localhost:8000/api/email/messages/v5?q=newsletter"
```

## Migration from Previous Versions

### Key Differences from Earlier Versions

1. **Simplified ID**: Uses Gmail `message_id` directly as the primary ID
2. **Flat Sender Field**: Single email string instead of object with name
3. **Enhanced Sentiment**: Now includes urgency_score and business_potential
4. **Structured Actions**: Detailed action_steps with timelines and templates
5. **HTML Analysis**: New section for HTML-specific analysis
6. **Better Classification**: More detailed categorization with confidence scores
7. **Recommendations**: AI-powered business recommendations with ROI estimates

### Backward Compatibility

The original `/api/email/messages` endpoint remains unchanged for backward compatibility. V5 is a new endpoint at `/api/email/messages/v5`.

## Implementation Details

### Controller
- `App\Http\Controllers\Api\EmailControllerV5`
- Method: `index(Request $request): JsonResponse`

### Route
```php
Route::get('email/messages/v5', [EmailControllerV5::class, 'index'])
    ->name('email.messages.v5');
```

### Data Source
- Database table: `messaging_messages`
- AI analysis stored in: `ai_analysis` JSON column
- Supports multiple AI analysis formats with automatic field mapping

## Error Handling

### 400 Bad Request
Invalid query parameters:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "priority": ["The priority field must be one of: low, normal, high"]
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Future Enhancements

Potential future improvements:
- Real-time AI analysis status
- Webhook support for new messages
- Bulk operations
- Custom action templates
- Integration with calendar systems
- Advanced filtering by sentiment/classification
