# UNIFIED MESSAGING SYSTEM - KOMPLETNA SUMARIZACIJA PROJEKTA

**Datum:** 5. Oktobar 2025  
**Status:** Gmail Sync - PRODUCTION READY ✅  
**Sledeća faza:** AI Integration

---

## 📋 PREGLED PROJEKTA

### Cilj Sistema
AI-powered sistem za automatsku analizu email komunikacija sa:
- Dnevnim izvještajima sa inteligentnim preporukama
- Personalizovanim akcijama prema poslovnim/privatnim ciljevima
- Automatskim eskalacijama kritičnih zadataka
- Integracijom sa više komunikacijskih kanala

### Tehnološki Stack
- **Backend:** Laravel 12 (API Gateway)
- **Messaging Core:** PHP Adapters (Gmail, Slack, Teams...)
- **Frontend:** React Dashboard
- **Database:** MySQL/PostgreSQL
- **Queue:** Laravel Queue (database driver)
- **Scheduler:** Laravel Scheduler (cron jobs)
- **AI:** OpenAI GPT-4 (planirana integracija)

---

## ✅ ŠTA JE KOMPLETNO IMPLEMENTIRANO

### 1. DATABASE ARHITEKTURA

**Kreirane Tabele:**

#### `messaging_channels`
- Čuva konfiguraciju kanala (Gmail, Slack, etc.)
- Polja: `channel_type`, `channel_id`, `configuration`, `is_active`
- **NEW:** `history_id`, `last_history_sync_at` (za Gmail History API)
- Status: ✅ **Production Ready**

#### `message_threads`
- Grupisanje poruka u thread-ove (konverzacije)
- Polja: `thread_id`, `subject`, `participants`, `message_count`
- Gmail flags: `is_unread`, `is_starred`, `is_important`, `is_in_inbox`, etc.
- Thread metadata: `permalink`, `labels`
- AI polja: `ai_analysis`, `ai_status`, `ai_processed_at`
- Status: ✅ **Production Ready**

#### `messaging_messages`
- Pojedinačne poruke sa kompletnim podacima
- **Core fields:**
  - `message_id` (unique), `thread_id`, `message_number`
  - `message_timestamp`, `received_date`
  - `sender` (JSON), `recipients` (JSON - to, cc, bcc, replyTo)
  
- **Content fields:**
  - `content_text`, `content_html`, `content_snippet`
  - `attachment_count` ✅ **FIXED TODAY**
  - `reactions` (JSON)
  
- **Gmail flags:**
  - `is_draft`, `is_unread`, `is_starred`, `is_in_trash`, `is_in_inbox`
  - `is_spam`, `priority` (high/normal/low)
  
- **AI fields:**
  - `ai_analysis` (JSON), `ai_status`, `ai_processed_at`
  
- **Status:** ✅ **Production Ready**

#### `messaging_attachments`
- Attachment metadata i storage tracking
- Polja: `attachment_id`, `name`, `mime_type`, `size`, `extension`
- Gmail specific: `is_inline`, `hash`, `url`
- Security: `scanned`, `is_safe`, `scan_results`
- Status: ✅ **Production Ready**

#### `messaging_headers`
- Email headers za threading i security
- Standard: `message_id_header`, `in_reply_to`, `references`
- Security: `received_spf`, `authentication_results`, `dkim_signature`
- Utility: `list_unsubscribe`, `return_path`
- Status: ✅ **Production Ready**

#### `messaging_labels`
- Gmail labels (system i user-defined)
- Many-to-many sa messages i threads
- Polja: `label_id`, `name`, `type` (system/user), `color`
- Status: ✅ **Production Ready**

#### `messaging_sync_logs`
- Tracking svih sync operacija
- Polja: `started_at`, `completed_at`, `messages_fetched`, `messages_processed`
- Status tracking: `running`, `completed`, `failed`
- Status: ✅ **Production Ready**

#### `messaging_processing_jobs`
- Queue za AI obrade (planirana upotreba)
- Polja: `job_type`, `payload`, `status`, `attempts`
- Status: ✅ **Ready for AI Integration**

---

### 2. LARAVEL MODELI

**Svi Eloquent modeli kreirani sa:**
- ✅ Proper relationships (HasMany, BelongsTo, ManyToMany)
- ✅ JSON casting za complex fields
- ✅ Helper metode
- ✅ Soft deletes gde je potrebno

**Modeli:**
1. `MessagingChannel` - Channel management
2. `MessageThread` - Thread operations
3. `MessagingMessage` - Message handling
4. `MessagingAttachment` - Attachment operations
5. `MessagingHeader` - Header parsing
6. `MessagingLabel` - Label management
7. `MessagingSyncLog` - Sync tracking
8. `MessagingProcessingJob` - AI queue (not used yet)

**Lokacija:** `app/Models/`

---

### 3. SERVICE LAYER (Modularni pristup)

#### **GmailAdapter** (`app/Services/Messaging/Adapters/GmailAdapter.php`)
**Funkcionalnost:**
- ✅ Povezivanje sa Gmail API kroz Google Apps Script
- ✅ **Complete Gmail API field mapping** (SVA polja mapirana)
- ✅ Thread-based fetching (optimizacija)
- ✅ Incremental sync sa `after:` query
- ✅ History API podrška (za buduće optimizacije)
- ✅ Attachment metadata extraction
- ✅ Header parsing
- ✅ Label mapping (system i user labels)
- ✅ Participant extraction (sender, to, cc, bcc)
- ✅ JSON cleanup (invalid UTF-8 handling)

**Key Methods:**
```php
receiveMessages(?Carbon $since = null, int $limit = 100000)
receiveMessagesViaHistory(string $historyId)
convertThreadsToMessages(array $threads)
parseAttachments(), parseHeaders(), parseLabels()
getHealthStatus()
```

**Status:** ✅ **Production Ready**

---

#### **MessagePersistenceService** (`app/Services/MessagePersistenceService.php`)
**Funkcionalnost:**
- ✅ Bulk persist messages sa transaction safety
- ✅ Thread creation/update logic
- ✅ Participant extraction i deduplication
- ✅ Attachment persistence ✅ **FIXED TODAY**
- ✅ Header persistence
- ✅ Label sync (message i thread labels)
- ✅ Thread statistics update
- ✅ UTF-8 sanitization (malformed data handling)
- ✅ Duplicate prevention (message_id check)

**Key Methods:**
```php
bulkPersistMessages(array $messages, MessagingChannel $channel)
persistMessage(array $messageData, MessagingChannel $channel)
createOrUpdateThread(array $messageData, MessagingChannel $channel)
extractParticipants(array $messageData)
persistAttachments(MessagingMessage $message, array $attachments)
persistHeaders(MessagingMessage $message, array $headersData)
persistLabels(MessagingMessage $message, MessageThread $thread, array $labelsData)
updateThreadStatistics(MessageThread $thread)
sanitizeMessageData(array $data)
```

**Status:** ✅ **Production Ready**

---

#### **MessageSyncService** (`app/Services/MessageSyncService.php`)
**Funkcionalnost:**
- ✅ Glavni orkestrater sync operacija
- ✅ Sync po channel-u ili svi aktivni channels
- ✅ **Dual sync strategy:**
  - **History API sync** (ako je history_id validan < 7 dana)
  - **Timestamp sync** (fallback sa `after:` query)
- ✅ Last sync time tracking
- ✅ Sync log management (start, complete, fail)
- ✅ Error handling sa rollback

**Key Methods:**
```php
syncChannelMessages(int $channelId)
syncAllChannels()
syncViaHistory() // Gmail History API
syncViaTimestamp() // after: query
getLastSyncTime(MessagingChannel $channel)
```

**Sync Logic:**
```
1. Check if history_id valid (< 7 days)
   ├─ YES → syncViaHistory()
   └─ NO  → syncViaTimestamp()

2. Capture sync START timestamp (BEFORE fetch)
3. Fetch messages from Gmail
4. Persist to database
5. Update channel.last_sync_at = START timestamp (not completion time!)
6. Log sync results
```

**Status:** ✅ **Production Ready**

---

#### **MessageService** (`app/Services/Messaging/MessageService.php`)
**Funkcionalnost:**
- ✅ Registry za messaging adaptere
- ✅ Dynamic adapter loading from config
- ✅ Adapter health monitoring
- ✅ Multi-adapter orchestration (za buduće Slack, Teams, etc.)

**Key Methods:**
```php
registerAdapter(MessageAdapterInterface $adapter)
getAdapter(string $channelId)
getAllMessages(?Carbon $since, int $limit)
getMessagesFromChannel(string $channelId, ?Carbon $since, int $limit)
getAdapterStatuses()
testConnection(string $channelId)
```

**Status:** ✅ **Production Ready**

---

### 4. HTTP LAYER

#### **CommunicationController** (`app/Http/Controllers/CommunicationController.php`)
**Endpoints:**

```php
GET  /api/communication
// Sync + return threads sa eager loading
// Response: { success, sync, threads }

POST /api/communication/sync
// Manual sync trigger (all ili specific channel)
// Response: { success, result }

GET  /api/communication/threads/{id}
// Get single thread sa messages i attachments
// Response: { success, thread }

GET  /api/communication/stats
// System statistics
// Response: { success, stats }
```

**Features:**
- ✅ Eager loading: `->with('messages.attachments')` ✅ **ADDED TODAY**
- ✅ Error handling sa proper HTTP status codes
- ✅ Logging svih operacija

**Status:** ✅ **Production Ready**

---

#### **API Resources**

**ThreadResource** (`app/Http/Resources/ThreadResource.php`)
- ✅ Thread data formatting
- ✅ Participant info (count, emails)
- ✅ Message count, unread count, attachment count
- ✅ Status flags (unread, starred, important, inbox, trash, spam)
- ✅ Labels display
- ✅ AI analysis (when completed)
- ✅ Nested messages sa attachments

**MessageResource** (`app/Http/Resources/MessageResource.php`)
- ✅ Message data formatting
- ✅ Sender i recipients info
- ✅ Content (text, html, snippet)
- ✅ **Attachment count i details** ✅ **ADDED TODAY**
- ✅ Status flags
- ✅ Labels
- ✅ AI analysis (when completed)

**AttachmentResource** (`app/Http/Resources/AttachmentResource.php`) ✅ **NEW TODAY**
- ✅ Attachment metadata (id, name, mime_type, size)
- ✅ **Size formatting** (KB, MB, GB)
- ✅ **File icon helper** (image, pdf, document, video, etc.)
- ✅ Security flags (scanned, is_safe)
- ✅ URL i storage_path

**Lokacija:** `app/Http/Resources/`

---

### 5. CONFIGURATION

**Config file:** `config/messaging.php`
```php
return [
    'adapters' => [
        'gmail-primary' => [
            'enabled' => true,
            'app_script_url' => env('GMAIL_APP_SCRIPT_URL'),
            'api_key' => env('GMAIL_API_KEY'),
            'timeout' => 30,
        ],
    ],
    
    'sync' => [
        'batch_size' => 50,
        'default_lookback_days' => 1,
    ],
    
    'ai' => [
        'enabled' => false, // TODO: Enable za AI fazu
        'model' => 'gpt-4-turbo',
    ],
];
```

**.env variables:**
```env
GMAIL_APP_SCRIPT_URL=https://script.google.com/...
GMAIL_API_KEY=optional_api_key
```

---

### 6. CONSOLE COMMANDS

**SyncMessagesCommand** (`php artisan messages:sync`)
```php
php artisan messages:sync              # Sync all channels
php artisan messages:sync --channel=1  # Sync specific channel
```

**MessagingStatsCommand** (`php artisan messages:stats`)
```php
php artisan messages:stats  # Display system statistics
```

**Lokacija:** `app/Console/Commands/`

---

## 🔄 CURRENT DATA FLOW

```
1. Manual Trigger ili Scheduled Job
   ↓
2. CommunicationController::index() ili sync()
   ↓
3. MessageSyncService::syncAllChannels()
   ↓
4. MessageService::getAdapter('gmail-primary')
   ↓
5. GmailAdapter::receiveMessages($since)
   ↓
6. Gmail Apps Script API Call
   ↓
7. Convert threads → IMessage format
   ↓
8. MessagePersistenceService::bulkPersistMessages()
   ↓
9. Database (threads, messages, attachments, headers, labels)
   ↓
10. Return ThreadResource collection
   ↓
11. React Dashboard Display ✅
```

---

## 🐛 BUGS FIXED TODAY

### ❌ Problem: `attachment_count` uvek 0 u bazi
**Uzrok:** 
```php
// GmailAdapter slao:
'attachments' => [...],
'attachmentCount' => 1,  // ← Gmail API format

// MessagePersistenceService gledao:
'attachment_count' => $messageData['content']['attachmentCount'] ?? count(...)
                      // ↑ Prvo gledao nepostojeće polje
```

**Rešenje:** ✅
```php
// Ispravljeno na:
'attachment_count' => count($messageData['content']['attachments'] ?? [])
```

**Testiran:** ✅ Poruke sa attachment-ima sada imaju `attachment_count = 1, 2, 3...`

---

### ❌ Problem: Attachments ne prikazuju se u output-u
**Uzrok:** Nedostaje eager loading

**Rešenje:** ✅
```php
// CommunicationController - dodato:
$threads = MessageThread::with([
    'messages' => function ($query) {
        $query->with('attachments')  // ← NOVO
              ->orderBy('message_timestamp', 'desc');
    }
])
```

**Rezultat:** ✅ API sada vraća `attachments` array u svakoj poruci

---

## 📊 API OUTPUT EXAMPLE

```json
{
  "success": true,
  "sync": {
    "total": 1,
    "successful": 1,
    "failed": 0,
    "results": {
      "gmail-primary": {
        "success": true,
        "messages_fetched": 19,
        "messages_processed": 19,
        "sync_method": "timestamp",
        "duration": 12.55
      }
    }
  },
  "threads": [
    {
      "id": 123,
      "thread_id": "199ae841c36789d6",
      "subject": "Invoice - October 2025",
      "snippet": "Please find attached...",
      "participants": [
        {
          "email": "sender@example.com",
          "name": "John Doe",
          "role": "sender"
        }
      ],
      "message_count": 1,
      "attachment_count": 1,
      "is_unread": true,
      "is_starred": false,
      "last_message_at": "2025-10-05T20:41:34Z",
      "messages": [
        {
          "id": 456,
          "message_id": "199ae841c36789d6",
          "subject": "Invoice - October 2025",
          "sender": {
            "email": "sender@example.com",
            "name": "John Doe"
          },
          "content": {
            "text": "Please find attached the invoice...",
            "html": "<p>Please find attached...</p>",
            "snippet": "Please find attached..."
          },
          "attachment_count": 1,
          "attachments": [
            {
              "id": 789,
              "attachment_id": "199ae841c36789d6_0",
              "name": "invoice-october-2025.pdf",
              "mime_type": "application/pdf",
              "size": 294114,
              "size_formatted": "287.22 KB",
              "extension": "pdf",
              "is_inline": false,
              "icon": "pdf",
              "is_safe": true
            }
          ],
          "is_unread": true,
          "priority": "normal",
          "timestamp": "2025-10-05T20:41:34Z"
        }
      ]
    }
  ]
}
```

---

## 🐳 DOCKER SETUP

### docker-compose.yml Structure
```yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    volumes: ["./backend:/var/www/html:delegated"]
    
  backend_scheduler:
    build: ./backend
    command: php artisan schedule:work
    volumes: ["./backend:/var/www/html:delegated"]
    
  backend_queue:
    build: ./backend
    command: php artisan queue:work --sleep=3 --tries=3
    volumes: ["./backend:/var/www/html:delegated"]
    
  mysql:
    image: mysql:8.0
    
  redis:
    image: redis:alpine
```

### PHP Opcache
```ini
# php.ini
opcache.enable=0
opcache.enable_cli=0
```

### Current Restart Strategy
```bash
docker restart $(docker ps -q)
```

**Planirano:** 5-minutni sync sa auto-refresh queue worker-a

---

## 📁 STRUKTURA PROJEKTA

```
backend/
├── app/
│   ├── Models/
│   │   ├── MessagingChannel.php           ✅
│   │   ├── MessageThread.php              ✅
│   │   ├── MessagingMessage.php           ✅
│   │   ├── MessagingAttachment.php        ✅
│   │   ├── MessagingHeader.php            ✅
│   │   ├── MessagingLabel.php             ✅
│   │   ├── MessagingSyncLog.php           ✅
│   │   └── MessagingProcessingJob.php     ✅
│   │
│   ├── Services/
│   │   ├── Messaging/
│   │   │   ├── Adapters/
│   │   │   │   └── GmailAdapter.php       ✅ PRODUCTION READY
│   │   │   └── MessageService.php         ✅
│   │   ├── MessagePersistenceService.php  ✅ PRODUCTION READY
│   │   └── MessageSyncService.php         ✅ PRODUCTION READY
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── CommunicationController.php ✅
│   │   └── Resources/
│   │       ├── ThreadResource.php          ✅
│   │       ├── MessageResource.php         ✅
│   │       └── AttachmentResource.php      ✅ NEW
│   │
│   ├── Console/Commands/
│   │   ├── SyncMessagesCommand.php        ✅
│   │   └── MessagingStatsCommand.php      ✅
│   │
│   └── Interfaces/
│       └── MessageAdapterInterface.php    ✅
│
├── config/
│   └── messaging.php                      ✅
│
├── database/migrations/
│   └── create_messaging_tables.php        ✅
│
└── routes/
    └── api.php (updated)                  ✅
```

---

## 🎯 ŠTA JE TESTIRANO

### ✅ Manual Testing
- Gmail sync sa različitim query-ima
- Thread grupisanje
- Attachment persistence
- Incremental sync (samo nove poruke)
- Error handling (invalid JSON, malformed UTF-8)
- Duplicate prevention

### ✅ Real-world Data
- 19 poruka sa 2 attachment-a
- Thread-ovi sa multiple messages
- Različiti label-i (INBOX, SENT, IMPORTANT)
- Različiti tipovi attachment-a (PDF, images)

### ⏳ NOT TESTED YET
- Unit tests (planirano)
- Integration tests (planirano)
- Load testing (planirano)
- AI integration (sledeća faza)

---

## 🚀 PERFORMANCE METRICS

### Current Sync Performance
```
17 threads, 19 messages, 2 attachments
Total duration: 12.55 seconds
Average: ~0.66s per message
Includes: Gmail API call + DB persist + thread grouping
```

### Database Query Optimization
- ✅ Eager loading (`with('messages.attachments')`)
- ✅ Index-i na svim foreign keys
- ✅ Full-text search index na `content_text`
- ✅ Composite index-i za common queries

### Planned Optimizations
- ⏳ Batch insert (umesto pojedinačnih INSERT-a)
- ⏳ Cache frequently accessed threads
- ⏳ Queue długih sync operacija
- ⏳ Pagination sa cursor-based approach

---

## 🔐 SECURITY & PRIVACY

### Implemented
- ✅ HTTPS komunikacija sa Gmail API
- ✅ API key optional (za rate limiting)
- ✅ UTF-8 sanitization (malformed data prevention)
- ✅ Transaction safety (DB rollback na greške)
- ✅ Duplicate prevention (unique constraints)

### Planned
- ⏳ JWT authentication za API endpoints
- ⏳ Rate limiting per user
- ⏳ Attachment virus scanning
- ⏳ GDPR compliance (data retention policies)
- ⏳ Encryption at rest

---

## 📝 POZNATI OGRANIČENJA

### 1. Gmail API Rate Limits
- **Limit:** 250 quota units per user per second
- **Naš usage:** ~5 units po poruci
- **Max throughput:** ~50 poruka/sekund
- **Mitigation:** Batch processing + retry logic

### 2. Apps Script Timeout
- **Limit:** 30 sekundi po request-u
- **Naš approach:** Pagination sa 10 threads po request-u
- **Mitigation:** Multiple requests sa 100ms delay

### 3. Docker Volume Caching
- **Issue:** PHP fajlovi se keširaju agresivno
- **Current fix:** `docker restart $(docker ps -q)`
- **Planned fix:** 5-minutni sync sa auto-refresh

### 4. Database Size Growth
- **Issue:** Inbox sa 10,000+ poruka = large DB
- **Mitigation:** Retention policy (delete old messages)
- **Planned:** Archive stare poruke u S3

---

## 🎓 KLJUČNE ARHITEKTURNE ODLUKE

### 1. **Laravel kao API Gateway**
- ✅ Centralna tačka za sve komunikacije
- ✅ Autentifikacija, autorizacija, rate limiting
- ✅ Queue management
- ✅ Scheduler orchestration

### 2. **Adapter Pattern za Channels**
- ✅ `MessageAdapterInterface` definiše contract
- ✅ Lako dodavanje novih kanala (Slack, Teams, Discord)
- ✅ Testability (mock adapters)

### 3. **IMessage Unified Format**
- ✅ Sve poruke se mapiraju u standardizovanu strukturu
- ✅ AI ne mora znati razliku između Gmail/Slack/Teams
- ✅ Consistent API output

### 4. **Database-First Approach**
- ✅ Sve se čuva u bazi (ne memory-only)
- ✅ Omogućava AI analizu nad istorijskim podacima
- ✅ Audit trail za sve operacije

### 5. **Thread-Centric Model**
- ✅ Poruke se grupišu u konverzacije
- ✅ Lakše za AI da razume kontekst
- ✅ Bolje za prikaz u UI-ju

### 6. **Incremental Sync Strategy**
- ✅ Samo nove poruke (ne full sync svaki put)
- ✅ `last_sync_at` timestamp tracking
- ✅ Fallback na History API (Gmail specific)

---

## 🔮 SLEDEĆA FAZA: AI INTEGRATION

### Planirani AI Servisi (iz feasibility study)

#### **1. HTML Structural Analysis Service**
- Optimizacija HTML sadržaja mejlova
- Ekstraktovanje naslova, podnaslova, ključnih elemenata
- Označavanje važnosti (H1-H6, bold, strong)
- Token optimizacija (60-80% smanjenje)

#### **2. Classification Service**
- Kategorizacija email sadržaja
- Google-like struktura labela
- Kontekstualna analiza (uključujući prethodne poruke)
- Podrška za poslovne i privatne kategorije

#### **3. Sentiment Analysis Service**
- Analiza emocionalnog tona komunikacije
- Detekcija urgentnosti
- Prepoznavanje frustracije ili zadovoljstva
- Confidence scoring

#### **4. Recommendation Service**
- Generisanje personalizovanih preporuka
- Korišćenje korisničkih ciljeva (Goal Management System)
- Kombinovanje rezultata prethodnih servisa
- Poslovno i kulturno prilagođene preporuke

#### **5. Action Service**
- Kreiranje konkretnih akcija:
  - Postpone (odloži za sutra)
  - Reschedule (zakaži za određeni datum)
  - Add to calendar
  - Zakaži video poziv
  - Dodaj u TODO
- Vizuelna diferencijacija akcija po tipu

#### **6. Escalation Service**
- Upravljanje kritičnim akcijama
- Poređenje sa korisničkim ciljevima
- Detekcija propuštenih važnih akcija
- Automatsko slanje email podsetnika

#### **7. Action Completion Tracker**
- Automatska detekcija završetka akcija (AI analiza mejlova)
- Ručno potvrđivanje (end-of-day checklist)
- Vizuelne oznake (✅ završeno, 🟡 u toku, 🔴 eskalirano)

#### **8. Summarization Service**
- Finalni izvještaj
- Jedna uvodna rečenica po komunikaciji
- Prioritizovane akcije
- Dnevni pregled (10-50 komunikacija)

---

### AI Integration Architecture

```
Messaging Messages (Database)
    ↓
AI Processing Queue (messaging_processing_jobs table)
    ↓
AI Service Orchestrator
    ├─→ HTML Analysis (GPT-3.5-turbo)
    ├─→ Classification (GPT-4-turbo)
    ├─→ Sentiment (Claude-3.5-Sonnet)
    ├─→ Recommendations (GPT-4-turbo + Goal System)
    ├─→ Actions (Structured output)
    ├─→ Escalation (Rule-based + AI)
    └─→ Summarization (GPT-4-turbo)
    ↓
Update messaging_messages.ai_analysis
Update messaging_messages.ai_status = 'completed'
    ↓
React Dashboard (display AI insights)
```

---

### Goal Management System

**Struktura:**
```php
// goals.json (per user)
{
  "user_id": 1,
  "business_goals": [
    "Respond to client emails within 2 hours",
    "Close all open invoices by end of month",
    "Schedule weekly team meetings"
  ],
  "personal_goals": [
    "Read industry news daily",
    "Network with 5 new contacts per week"
  ],
  "priorities": {
    "high": ["client emails", "invoices"],
    "medium": ["team meetings", "networking"],
    "low": ["industry news"]
  },
  "updated_at": "2025-10-05T20:00:00Z"
}
```

**Servisi:**
- `GoalReaderService` - Učitavanje ciljeva iz fajla/baze
- `GoalSenderService` - Slanje trenutnih ciljeva korisniku na mejl
- `GoalUpdaterService` - Ažuriranje ciljeva na osnovu korisničkih odgovora

---

### Multi-Model Validation Strategy

**Tier 1 - Production Models:**
- GPT-4-turbo (glavni model)
- Claude-3.5-Sonnet (alternativa za sentiment)
- Gemini-1.5-Pro (backup za klasifikaciju)

**Tier 2 - Validation Models:**
- GPT-3.5-turbo (validation)
- Claude-3-Haiku (strukturalne analize)

**Tier 3 - Open Source Control:**
- Llama-3.1-70B (nezavisna validacija)
- Mixtral-8x7B (klasifikacija backup)

**Validation Matrix:**
| Service | Primary | Validation | Control |
|---------|---------|------------|---------|
| HTML | GPT-4 | Claude-3-Haiku | Llama-3.1 |
| Classification | GPT-4 | GPT-3.5 | Mixtral |
| Sentiment | Claude-3.5 | PaLM-2 | Llama-3.1 |
| Recommendations | GPT-4 | Claude-3.5 | Qwen-2 |

**Confidence Threshold:**
- **Green zone:** >90% agreement (proceed)
- **Yellow zone:** 80-90% agreement (warning)
- **Red zone:** <80% agreement (escalate to human)

---

### AI Cost Estimation (per 1000 messages/month)

```
HTML Analysis:     ~500 tokens  × $0.00006 = $0.03
Classification:    ~800 tokens  × $0.00006 = $0.048
Sentiment:         ~600 tokens  × $0.00006 = $