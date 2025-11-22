# TEHNIČKA IMPLEMENTACIJA I API DOKUMENTACIJA
## AI Automation Productivity Hub - Developer Guide

---

## 1. API ENDPOINTS DOKUMENTACIJA

### 1.1 Authentication Endpoints

#### POST /api/auth/login
**Login korisnika i dobijanje JWT tokena**

```javascript
// Request
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "remember": true
}

// Response 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Marko Marković",
      "email": "user@example.com",
      "role": "executive",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marko"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires_in": 3600
  },
  "message": "Successfully logged in"
}

// Response 401 Unauthorized
{
  "success": false,
  "error": "Invalid credentials",
  "code": "AUTH_FAILED"
}
```

#### POST /api/auth/oauth/google
**OAuth login sa Google**

```javascript
// Request
POST /api/auth/oauth/google
{
  "id_token": "google_oauth_token_here"
}

// Response includes Gmail permissions
{
  "user": {...},
  "token": "jwt_token",
  "gmail_connected": true,
  "gmail_scopes": [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send"
  ]
}
```

### 1.2 Email Management Endpoints

#### GET /api/v1/emails
**Lista emailova sa AI analizom**

```javascript
// Request
GET /api/v1/emails?page=1&per_page=20&priority=high&analyzed=true
Authorization: Bearer {jwt_token}

// Response
{
  "data": [
    {
      "id": "msg_123",
      "thread_id": "thread_456",
      "subject": "Automation Proposal - Urgent",
      "sender": {
        "email": "john@techcorp.com",
        "name": "John Doe",
        "avatar": null,
        "company": "TechCorp"
      },
      "received_at": "2025-11-21T10:30:00Z",
      "snippet": "We're interested in implementing your AI solution...",
      "has_attachments": true,
      "is_unread": true,
      "priority": "high",
      "ai_analysis": {
        "processed": true,
        "classification": "business_opportunity",
        "sentiment": {
          "tone": "positive",
          "urgency": 8,
          "business_potential": 9
        },
        "extracted_data": {
          "budget": "€10,000-15,000",
          "timeline": "Q1 2026",
          "decision_maker": true
        },
        "recommended_actions": [
          {
            "type": "SCHEDULE_CALL",
            "priority": "high",
            "deadline": "2025-11-21T17:00:00Z",
            "description": "Schedule discovery call",
            "ai_confidence": 0.92
          }
        ],
        "summary": "High-value automation opportunity with urgent timeline"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 94,
    "unread_count": 12,
    "urgent_count": 3
  }
}
```

#### POST /api/v1/emails/{id}/analyze
**Trigger AI analizu za specifičan email**

```javascript
// Request
POST /api/v1/emails/msg_123/analyze
{
  "services": ["all"], // ili specific: ["classification", "sentiment", "actions"]
  "force": false // true za re-analizu
}

// Response - Streaming SSE
data: {"status": "processing", "service": "html_cleaning", "progress": 20}
data: {"status": "processing", "service": "classification", "progress": 40}
data: {"status": "processing", "service": "sentiment", "progress": 60}
data: {"status": "processing", "service": "recommendations", "progress": 80}
data: {"status": "completed", "progress": 100, "result": {...}}
```

### 1.3 AI Services Endpoints

#### POST /api/v1/ai/process-batch
**Batch procesiranje više emailova**

```javascript
// Request
POST /api/v1/ai/process-batch
{
  "email_ids": ["msg_1", "msg_2", "msg_3"],
  "priority": "high",
  "callback_url": "https://webhook.site/callback"
}

// Response
{
  "job_id": "job_789",
  "status": "queued",
  "estimated_completion": "2025-11-21T11:00:00Z",
  "progress_url": "/api/v1/jobs/job_789"
}
```

#### GET /api/v1/ai/insights
**AI insights i preporuke**

```javascript
// Request
GET /api/v1/ai/insights?period=week

// Response
{
  "productivity_score": 87,
  "time_saved": {
    "hours": 18.5,
    "value": "€925"
  },
  "patterns": {
    "best_response_time": "09:00-11:00",
    "email_peak_hours": ["10:00", "14:00", "16:00"],
    "avg_response_time": "37 minutes",
    "improvement": "+23% vs last week"
  },
  "recommendations": [
    {
      "type": "workflow",
      "title": "Batch email processing",
      "description": "Process emails 2x daily instead of continuously",
      "potential_time_saved": "45 min/day"
    }
  ],
  "opportunities": {
    "identified": 12,
    "value": "€45,000",
    "converted": 3,
    "conversion_rate": "25%"
  }
}
```

### 1.4 Real-time Updates (WebSocket)

#### WebSocket Connection
**Real-time updates za email i AI processing**

```javascript
// Client connection
const ws = new WebSocket('wss://api.ai-hub.com/ws');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'jwt_token_here'
  }));
  
  // Subscribe to channels
  ws.send(JSON.stringify({
    type: 'subscribe',
    channels: ['emails', 'ai_analysis', 'notifications']
  }));
};

// Receiving updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'new_email':
      // {type: 'new_email', email: {...}}
      updateInbox(data.email);
      break;
      
    case 'ai_complete':
      // {type: 'ai_complete', email_id: 'msg_123', analysis: {...}}
      updateEmailAnalysis(data);
      break;
      
    case 'urgent_alert':
      // {type: 'urgent_alert', message: '...', action: {...}}
      showUrgentNotification(data);
      break;
  }
};
```

---

## 2. DATABASE SCHEMA VIZUALIZACIJA

### 2.1 Core Tables Structure

```sql
-- Users table sa role-based access
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  role ENUM('admin', 'executive', 'manager', 'user') DEFAULT 'user',
  settings JSON,
  goals JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Messaging channels (Gmail, Slack, etc.)
CREATE TABLE messaging_channels (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  type ENUM('gmail', 'outlook', 'slack', 'teams'),
  credentials JSON ENCRYPTED,
  config JSON,
  last_sync TIMESTAMP,
  sync_status ENUM('active', 'paused', 'error'),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_type (user_id, type)
);

-- Message threads sa AI analysis
CREATE TABLE message_threads (
  id VARCHAR(255) PRIMARY KEY,
  channel_id BIGINT,
  subject TEXT,
  participants JSON,
  message_count INT DEFAULT 0,
  last_message_date TIMESTAMP,
  ai_summary TEXT,
  ai_category VARCHAR(50),
  ai_priority ENUM('urgent', 'high', 'normal', 'low'),
  ai_business_value DECIMAL(10, 2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (channel_id) REFERENCES messaging_channels(id),
  INDEX idx_priority_date (ai_priority, last_message_date DESC),
  FULLTEXT idx_subject_summary (subject, ai_summary)
);

-- Individual messages
CREATE TABLE messaging_messages (
  id VARCHAR(255) PRIMARY KEY,
  thread_id VARCHAR(255),
  channel_id BIGINT,
  message_number INT,
  sender JSON,
  recipients JSON,
  content_text MEDIUMTEXT,
  content_html MEDIUMTEXT,
  attachments JSON,
  headers JSON,
  is_unread BOOLEAN DEFAULT TRUE,
  is_starred BOOLEAN DEFAULT FALSE,
  labels JSON,
  ai_analysis JSON,
  ai_actions JSON,
  ai_processed_at TIMESTAMP,
  received_date TIMESTAMP,
  created_at TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES message_threads(id),
  FOREIGN KEY (channel_id) REFERENCES messaging_channels(id),
  INDEX idx_thread_number (thread_id, message_number),
  INDEX idx_unread (channel_id, is_unread),
  INDEX idx_received (channel_id, received_date DESC)
);

-- AI processing jobs
CREATE TABLE ai_processing_jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  message_id VARCHAR(255),
  service VARCHAR(50),
  status ENUM('pending', 'processing', 'completed', 'failed'),
  priority ENUM('urgent', 'high', 'normal', 'low'),
  attempts INT DEFAULT 0,
  result JSON,
  error_message TEXT,
  tokens_used INT,
  cost DECIMAL(10, 4),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messaging_messages(id),
  INDEX idx_status_priority (status, priority),
  INDEX idx_message_service (message_id, service)
);

-- User actions tracking
CREATE TABLE user_actions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  message_id VARCHAR(255),
  action_type VARCHAR(50),
  action_data JSON,
  ai_suggested BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (message_id) REFERENCES messaging_messages(id),
  INDEX idx_user_completed (user_id, completed),
  INDEX idx_created (created_at DESC)
);
```

### 2.2 Relationships Diagram

```
users
  │
  ├─── messaging_channels (1:N)
  │         │
  │         ├─── message_threads (1:N)
  │         │         │
  │         │         └─── messaging_messages (1:N)
  │         │                   │
  │         │                   ├─── ai_processing_jobs (1:N)
  │         │                   └─── user_actions (1:N)
  │         │
  │         └─── messaging_sync_logs (1:N)
  │
  ├─── user_goals (1:N)
  ├─── user_actions (1:N)
  └─── analytics_events (1:N)
```

---

## 3. GMAIL INTEGRATION IMPLEMENTATION

### 3.1 Google Apps Script Code

```javascript
// Google Apps Script - Gmail API Endpoint
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    
    switch(action) {
      case 'getThreads':
        return getEmailThreads(request);
      case 'getMessages':
        return getThreadMessages(request);
      case 'sendEmail':
        return sendEmail(request);
      case 'markAsRead':
        return markAsRead(request);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getEmailThreads(request) {
  const threads = GmailApp.search(request.query || 'in:inbox', 0, 50);
  const result = threads.map(thread => {
    const messages = thread.getMessages();
    const lastMessage = messages[messages.length - 1];
    
    return {
      id: thread.getId(),
      subject: thread.getFirstMessageSubject(),
      snippet: lastMessage.getPlainBody().substring(0, 200),
      messageCount: messages.length,
      isUnread: thread.isUnread(),
      isImportant: thread.isImportant(),
      labels: thread.getLabels().map(l => l.getName()),
      lastMessageDate: lastMessage.getDate().toISOString(),
      participants: extractParticipants(messages)
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    threads: result
  })).setMimeType(ContentService.MimeType.JSON);
}

function extractParticipants(messages) {
  const participants = new Set();
  messages.forEach(msg => {
    participants.add(msg.getFrom());
    msg.getTo().split(',').forEach(to => participants.add(to.trim()));
  });
  return Array.from(participants);
}
```

### 3.2 Laravel Gmail Service

```php
<?php

namespace App\Services\Messaging\Adapters;

use App\Contracts\IChannelAdapter;
use App\Models\MessagingChannel;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Collection;

class GmailAdapter implements IChannelAdapter
{
    private MessagingChannel $channel;
    private string $scriptUrl;
    
    public function __construct(MessagingChannel $channel)
    {
        $this->channel = $channel;
        $this->scriptUrl = config('services.gmail.script_url');
    }
    
    public function connect(): bool
    {
        try {
            $response = Http::post($this->scriptUrl, [
                'action' => 'validateConnection',
                'token' => decrypt($this->channel->credentials['token'])
            ]);
            
            return $response->successful();
        } catch (\Exception $e) {
            \Log::error('Gmail connection failed', [
                'channel_id' => $this->channel->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
    
    public function receiveMessages(array $options = []): Collection
    {
        $query = $options['query'] ?? 'in:inbox is:unread';
        $limit = $options['limit'] ?? 50;
        
        $response = Http::timeout(30)->post($this->scriptUrl, [
            'action' => 'getThreads',
            'query' => $query,
            'limit' => $limit,
            'token' => decrypt($this->channel->credentials['token'])
        ]);
        
        if (!$response->successful()) {
            throw new \Exception('Failed to fetch Gmail messages');
        }
        
        $threads = $response->json('threads', []);
        
        return collect($threads)->map(function ($thread) {
            return $this->transformToMessage($thread);
        });
    }
    
    private function transformToMessage(array $gmailThread): array
    {
        return [
            'id' => $gmailThread['id'],
            'thread_id' => $gmailThread['id'],
            'subject' => $gmailThread['subject'],
            'snippet' => $gmailThread['snippet'],
            'sender' => $this->extractSender($gmailThread['participants'][0] ?? ''),
            'recipients' => $this->extractRecipients($gmailThread['participants']),
            'received_date' => $gmailThread['lastMessageDate'],
            'is_unread' => $gmailThread['isUnread'],
            'labels' => $gmailThread['labels'],
            'metadata' => [
                'is_important' => $gmailThread['isImportant'],
                'message_count' => $gmailThread['messageCount']
            ]
        ];
    }
    
    private function extractSender(string $from): array
    {
        if (preg_match('/(.+)<(.+)>/', $from, $matches)) {
            return [
                'name' => trim($matches[1]),
                'email' => trim($matches[2])
            ];
        }
        
        return [
            'name' => null,
            'email' => trim($from)
        ];
    }
    
    public function sendMessage(array $message): bool
    {
        $response = Http::post($this->scriptUrl, [
            'action' => 'sendEmail',
            'to' => $message['to'],
            'subject' => $message['subject'],
            'body' => $message['body'],
            'html' => $message['html'] ?? false,
            'attachments' => $message['attachments'] ?? [],
            'token' => decrypt($this->channel->credentials['token'])
        ]);
        
        return $response->successful();
    }
}
```

---

## 4. REACT FRONTEND ARCHITECTURE

### 4.1 Component Structure

```typescript
// src/components/Dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { WelcomeWidget } from './WelcomeWidget';
import { PriorityInbox } from './PriorityInbox';
import { AIActions } from './AIActions';
import { ProductivityScore } from './ProductivityScore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { fetchEmails, markAsRead } from '@/store/emailSlice';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { emails, loading } = useSelector(state => state.emails);
  const { insights } = useSelector(state => state.ai);
  
  // Real-time updates
  const { messages } = useWebSocket(['emails', 'ai_analysis']);
  
  useEffect(() => {
    dispatch(fetchEmails({ priority: 'high', unread: true }));
  }, [dispatch]);
  
  useEffect(() => {
    // Handle real-time updates
    messages.forEach(msg => {
      if (msg.type === 'new_email') {
        dispatch(addEmail(msg.email));
      } else if (msg.type === 'ai_complete') {
        dispatch(updateEmailAnalysis(msg));
      }
    });
  }, [messages, dispatch]);
  
  const handleEmailAction = async (emailId: string, action: string) => {
    switch(action) {
      case 'reply':
        navigate(`/compose?replyTo=${emailId}`);
        break;
      case 'archive':
        await dispatch(archiveEmail(emailId));
        break;
      case 'markRead':
        await dispatch(markAsRead(emailId));
        break;
    }
  };
  
  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column - Stats & Actions */}
        <div className="space-y-6">
          <WelcomeWidget user={user} />
          <ProductivityScore score={insights?.productivity_score} />
          <AIActions actions={insights?.recommended_actions} />
        </div>
        
        {/* Center Column - Email List */}
        <div className="lg:col-span-2 space-y-4">
          <PriorityInbox 
            emails={emails}
            loading={loading}
            onAction={handleEmailAction}
          />
        </div>
      </div>
    </motion.div>
  );
};
```

### 4.2 State Management (Redux Toolkit)

```typescript
// src/store/emailSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { emailAPI } from '@/api/emails';

interface Email {
  id: string;
  subject: string;
  sender: {
    name: string;
    email: string;
  };
  snippet: string;
  received_at: string;
  is_unread: boolean;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  ai_analysis?: {
    classification: string;
    sentiment: object;
    actions: Array<object>;
  };
}

interface EmailState {
  emails: Email[];
  selectedEmail: Email | null;
  loading: boolean;
  error: string | null;
  filters: {
    priority: string | null;
    unread: boolean;
    category: string | null;
  };
}

// Async thunks
export const fetchEmails = createAsyncThunk(
  'emails/fetch',
  async (filters: Partial<EmailState['filters']>) => {
    const response = await emailAPI.getEmails(filters);
    return response.data;
  }
);

export const analyzeEmail = createAsyncThunk(
  'emails/analyze',
  async (emailId: string) => {
    const response = await emailAPI.analyzeEmail(emailId);
    return { emailId, analysis: response.data };
  }
);

const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    emails: [],
    selectedEmail: null,
    loading: false,
    error: null,
    filters: {
      priority: null,
      unread: true,
      category: null
    }
  } as EmailState,
  reducers: {
    selectEmail: (state, action) => {
      state.selectedEmail = state.emails.find(e => e.id === action.payload) || null;
    },
    updateEmailAnalysis: (state, action) => {
      const email = state.emails.find(e => e.id === action.payload.emailId);
      if (email) {
        email.ai_analysis = action.payload.analysis;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.emails = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch emails';
      });
  }
});

export const { selectEmail, updateEmailAnalysis, setFilters } = emailSlice.actions;
export default emailSlice.reducer;
```

---

## 5. AI SERVICES IMPLEMENTATION

### 5.1 Master AI Orchestrator

```python
# ai_services/orchestrator.py
from typing import List, Dict, Any
import asyncio
from dataclasses import dataclass
from .services import (
    HTMLCleaningService,
    ClassificationService,
    SentimentAnalysisService,
    RecommendationService,
    ActionExtractionService,
    EscalationService,
    CompletionTrackingService,
    SummarizationService
)

@dataclass
class EmailAnalysisResult:
    email_id: str
    cleaned_content: str
    classification: Dict[str, Any]
    sentiment: Dict[str, Any]
    recommendations: List[Dict[str, Any]]
    actions: List[Dict[str, Any]]
    escalation: Dict[str, Any]
    summary: str
    confidence_score: float
    processing_time: float
    tokens_used: int
    cost: float

class AIOrchestrator:
    def __init__(self):
        self.services = {
            'html_cleaning': HTMLCleaningService(),
            'classification': ClassificationService(),
            'sentiment': SentimentAnalysisService(),
            'recommendation': RecommendationService(),
            'action_extraction': ActionExtractionService(),
            'escalation': EscalationService(),
            'completion_tracking': CompletionTrackingService(),
            'summarization': SummarizationService()
        }
        
    async def analyze_email(
        self, 
        email: Dict[str, Any],
        user_goals: List[str] = None,
        services_to_run: List[str] = None
    ) -> EmailAnalysisResult:
        """
        Main orchestration method for email analysis
        """
        start_time = asyncio.get_event_loop().time()
        
        # Default to all services if not specified
        if services_to_run is None:
            services_to_run = list(self.services.keys())
        
        # Step 1: Clean HTML (always first)
        cleaned_content = await self.services['html_cleaning'].process(
            email['content_html']
        )
        
        # Step 2: Run classification and sentiment in parallel
        classification_task = asyncio.create_task(
            self.services['classification'].process(
                cleaned_content, email['subject'], email['sender']
            )
        )
        
        sentiment_task = asyncio.create_task(
            self.services['sentiment'].process(
                cleaned_content, email['subject']
            )
        )
        
        classification = await classification_task
        sentiment = await sentiment_task
        
        # Step 3: Generate recommendations based on classification and sentiment
        recommendations = await self.services['recommendation'].process(
            cleaned_content,
            classification,
            sentiment,
            user_goals
        )
        
        # Step 4: Extract actions
        actions = await self.services['action_extraction'].process(
            cleaned_content,
            classification,
            recommendations
        )
        
        # Step 5: Check escalation needs
        escalation = await self.services['escalation'].process(
            classification,
            sentiment,
            actions
        )
        
        # Step 6: Generate summary
        summary = await self.services['summarization'].process(
            cleaned_content,
            classification,
            sentiment,
            actions
        )
        
        # Calculate metrics
        processing_time = asyncio.get_event_loop().time() - start_time
        tokens_used = sum([s.tokens_used for s in self.services.values()])
        cost = self.calculate_cost(tokens_used)
        confidence_score = self.calculate_confidence(
            classification, sentiment, recommendations
        )
        
        return EmailAnalysisResult(
            email_id=email['id'],
            cleaned_content=cleaned_content,
            classification=classification,
            sentiment=sentiment,
            recommendations=recommendations,
            actions=actions,
            escalation=escalation,
            summary=summary,
            confidence_score=confidence_score,
            processing_time=processing_time,
            tokens_used=tokens_used,
            cost=cost
        )
    
    def calculate_confidence(
        self,
        classification: Dict,
        sentiment: Dict,
        recommendations: List
    ) -> float:
        """Calculate overall confidence score"""
        scores = []
        
        if 'confidence' in classification:
            scores.append(classification['confidence'])
        if 'confidence' in sentiment:
            scores.append(sentiment['confidence'])
        
        for rec in recommendations:
            if 'confidence' in rec:
                scores.append(rec['confidence'])
        
        return sum(scores) / len(scores) if scores else 0.5
    
    def calculate_cost(self, tokens: int) -> float:
        """Calculate cost based on token usage"""
        # GPT-4 pricing: $0.03 per 1K tokens
        return (tokens / 1000) * 0.03
```

### 5.2 Individual AI Service Example

```python
# ai_services/services/classification_service.py
import openai
from typing import Dict, Any, Tuple
import json

class ClassificationService:
    def __init__(self):
        self.model = "gpt-4-turbo-preview"
        self.tokens_used = 0
        
        self.categories = {
            'business_opportunity': {
                'keywords': ['proposal', 'quote', 'partnership', 'collaboration'],
                'weight': 1.5
            },
            'customer_inquiry': {
                'keywords': ['question', 'help', 'support', 'issue'],
                'weight': 1.2
            },
            'meeting_request': {
                'keywords': ['meeting', 'call', 'schedule', 'calendar'],
                'weight': 1.0
            },
            'administrative': {
                'keywords': ['invoice', 'receipt', 'confirmation', 'notification'],
                'weight': 0.8
            },
            'newsletter': {
                'keywords': ['unsubscribe', 'newsletter', 'update', 'announcement'],
                'weight': 0.5
            }
        }
    
    async def process(
        self,
        content: str,
        subject: str,
        sender: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Classify email into categories with confidence scores
        """
        # Build prompt
        prompt = self.build_prompt(content, subject, sender)
        
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model=self.model,
            messages=[
                {"role": "system", "content": self.get_system_prompt()},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200
        )
        
        # Parse response
        result = json.loads(response.choices[0].message.content)
        self.tokens_used = response.usage.total_tokens
        
        # Post-process with keyword matching for validation
        result = self.validate_classification(result, content, subject)
        
        return result
    
    def get_system_prompt(self) -> str:
        return """You are an email classification expert. Classify emails into categories
        and provide confidence scores. Return JSON format:
        {
            "primary_category": "category_name",
            "secondary_category": "category_name" or null,
            "confidence": 0.0-1.0,
            "business_value": "high|medium|low",
            "requires_response": boolean,
            "reasoning": "brief explanation"
        }
        
        Categories: business_opportunity, customer_inquiry, meeting_request, 
        administrative, newsletter, personal, spam"""
    
    def build_prompt(self, content: str, subject: str, sender: Dict) -> str:
        return f"""Classify this email:
        
        Subject: {subject}
        From: {sender.get('name', 'Unknown')} <{sender.get('email', '')}>
        Company: {self.extract_company(sender.get('email', ''))}
        
        Content (first 500 chars):
        {content[:500]}
        
        Consider:
        1. Sender importance (domain, previous interactions)
        2. Subject urgency markers
        3. Content business value
        4. Action requirements"""
    
    def extract_company(self, email: str) -> str:
        """Extract company from email domain"""
        if '@' in email:
            domain = email.split('@')[1]
            company = domain.split('.')[0]
            return company.capitalize()
        return 'Unknown'
    
    def validate_classification(
        self,
        ai_result: Dict,
        content: str,
        subject: str
    ) -> Dict:
        """Validate AI classification with keyword matching"""
        content_lower = (content + ' ' + subject).lower()
        
        # Check for newsletter indicators
        if any(indicator in content_lower for indicator in 
               ['unsubscribe', 'newsletter', 'no longer wish']):
            if ai_result['primary_category'] != 'newsletter':
                ai_result['secondary_category'] = ai_result['primary_category']
                ai_result['primary_category'] = 'newsletter'
                ai_result['confidence'] *= 0.8
        
        return ai_result
```

---

## 6. DEPLOYMENT & INFRASTRUCTURE

### 6.1 Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Laravel Backend
  app:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ai-hub-backend
    restart: unless-stopped
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
      - AI_SERVICE_URL=http://ai-processor:8000
    volumes:
      - ./backend:/var/www
    networks:
      - ai-hub-network
    depends_on:
      - mysql
      - redis
  
  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ai-hub-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
      - REACT_APP_WS_URL=ws://localhost:6001
    networks:
      - ai-hub-network
  
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: ai-hub-mysql
    restart: unless-stopped
    environment:
      - MYSQL_DATABASE=ai_hub
      - MYSQL_ROOT_PASSWORD=secret
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    networks:
      - ai-hub-network
  
  # Redis Cache
  redis:
    image: redis:alpine
    container_name: ai-hub-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - ai-hub-network
  
  # AI Processing Service
  ai-processor:
    build:
      context: ./ai-services
      dockerfile: Dockerfile
    container_name: ai-hub-ai
    restart: unless-stopped
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
      - DATABASE_URL=mysql://root:secret@mysql:3306/ai_hub
    ports:
      - "8001:8000"
    networks:
      - ai-hub-network
    depends_on:
      - mysql
  
  # WebSocket Server
  websocket:
    build:
      context: ./websocket
      dockerfile: Dockerfile
    container_name: ai-hub-websocket
    restart: unless-stopped
    ports:
      - "6001:6001"
    environment:
      - REDIS_HOST=redis
    networks:
      - ai-hub-network
    depends_on:
      - redis
  
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: ai-hub-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    networks:
      - ai-hub-network
    depends_on:
      - app
      - frontend

networks:
  ai-hub-network:
    driver: bridge

volumes:
  mysql-data:
  redis-data:
```

### 6.2 Production Deployment Script

```bash
#!/bin/bash
# deploy.sh - Production deployment script

set -e

echo "🚀 Starting AI Hub Deployment..."

# Environment check
if [ "$1" != "production" ] && [ "$1" != "staging" ]; then
    echo "Usage: ./deploy.sh [production|staging]"
    exit 1
fi

ENVIRONMENT=$1
echo "Deploying to: $ENVIRONMENT"

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Backend deployment
echo "🔧 Deploying Backend..."
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan queue:restart

# Frontend build
echo "🎨 Building Frontend..."
cd ../frontend
npm ci
npm run build

# AI Services
echo "🤖 Updating AI Services..."
cd ../ai-services
pip install -r requirements.txt --no-cache-dir
python -m pytest tests/

# Docker rebuild
echo "🐳 Rebuilding Docker containers..."
cd ..
docker-compose -f docker-compose.$ENVIRONMENT.yml down
docker-compose -f docker-compose.$ENVIRONMENT.yml build --no-cache
docker-compose -f docker-compose.$ENVIRONMENT.yml up -d

# Health checks
echo "🏥 Running health checks..."
sleep 10
curl -f http://localhost/api/health || exit 1
curl -f http://localhost:3000 || exit 1
curl -f http://localhost:8001/health || exit 1

# Database backup
echo "💾 Creating database backup..."
docker exec ai-hub-mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD ai_hub > backup_$(date +%Y%m%d_%H%M%S).sql

# Clear caches
echo "🧹 Clearing caches..."
docker exec ai-hub-backend php artisan cache:clear
docker exec ai-hub-redis redis-cli FLUSHALL

# Monitoring alert
echo "📊 Sending deployment notification..."
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"✅ AI Hub deployed to $ENVIRONMENT successfully!\"}"

echo "✅ Deployment completed successfully!"
```

---

## 7. MONITORING & ANALYTICS

### 7.1 Performance Monitoring

```javascript
// monitoring/performance.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiCalls: [],
      renderTimes: [],
      emailProcessingTimes: [],
      aiResponseTimes: []
    };
  }
  
  trackAPICall(endpoint, duration, status) {
    this.metrics.apiCalls.push({
      endpoint,
      duration,
      status,
      timestamp: new Date()
    });
    
    // Send to analytics if slow
    if (duration > 2000) {
      this.reportSlowAPI(endpoint, duration);
    }
  }
  
  trackEmailProcessing(emailId, startTime, endTime, services) {
    const duration = endTime - startTime;
    this.metrics.emailProcessingTimes.push({
      emailId,
      duration,
      services,
      timestamp: new Date()
    });
    
    // Alert if processing takes too long
    if (duration > 5000) {
      console.warn(`Slow email processing: ${emailId} took ${duration}ms`);
      this.sendAlert('SLOW_PROCESSING', { emailId, duration });
    }
  }
  
  getAverageMetrics() {
    return {
      avgAPIResponse: this.average(this.metrics.apiCalls.map(c => c.duration)),
      avgEmailProcessing: this.average(this.metrics.emailProcessingTimes.map(e => e.duration)),
      avgAIResponse: this.average(this.metrics.aiResponseTimes),
      totalAPICalls: this.metrics.apiCalls.length,
      errorRate: this.calculateErrorRate()
    };
  }
  
  average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length || 0;
  }
  
  calculateErrorRate() {
    const errors = this.metrics.apiCalls.filter(c => c.status >= 400).length;
    return (errors / this.metrics.apiCalls.length * 100).toFixed(2);
  }
}
```

---

Ova tehnička dokumentacija pruža kompletnu sliku implementacije aplikacije, uključujući API endpoints, database shemu, integracije, AI servise i deployment proceduru!