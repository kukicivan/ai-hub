# BREAKPOINTS DOCUMENTATION - Week 1 Debugging Guide

## Quick Reference Table

| BP       | Location                      | Purpose            | What to Check             |
|----------|-------------------------------|--------------------|---------------------------|
| **BP1**  | CommunicationController:21    | Request entry      | Request params correct?   |
| **BP2**  | CommunicationController:26    | Before sync call   | About to trigger sync     |
| **BP3**  | MessageSyncService:158        | Sync service entry | Active channels found?    |
| **BP4**  | MessageSyncService:164        | Channel loop       | Which channel processing? |
| **BP5**  | MessageSyncService:28         | Channel sync start | Last sync time correct?   |
| **BP6**  | MessageSyncService:35         | Before Node.js     | Params for Node.js call   |
| **BP7**  | NodeCommunicationService:23   | Node.js request    | URL and params correct?   |
| **BP8**  | NodeCommunicationService:37   | Node.js response   | Did Node.js respond?      |
| **BP9**  | NodeCommunicationService:47   | Messages received  | How many messages?        |
| **BP10** | MessageSyncService:50         | Before persistence | Messages structure OK?    |
| **BP11** | MessagePersistenceService:145 | Persistence loop   | First message structure   |
| **BP12** | MessagePersistenceService:29  | Thread created     | Thread saved correctly?   |
| **BP13** | MessagePersistenceService:48  | Message created    | Message saved correctly?  |
| **BP14** | MessagePersistenceService:174 | Persist complete   | Final persist stats       |
| **BP15** | CommunicationController:45    | After sync         | Aggregated totals         |
| **BP16** | CommunicationController:48    | Before query       | About to fetch threads    |
| **BP17** | CommunicationController:53    | Threads retrieved  | Threads from database     |
| **BP18** | CommunicationController:55    | Final response     | Response structure        |

---

## Detailed Breakpoint Descriptions

### REQUEST PHASE

#### BP1 - Request Entry Point

**File:** `app/Http/Controllers/CommunicationController.php`  
**Line:** 21 (after Log::info)

**Purpose:** Verify incoming request

**Add this code:**

```php
dump([
    'breakpoint' => 'BP1_REQUEST_ENTRY',
    'request_params' => $request->all(),
    'sync_interval' => $syncInterval,
]);
```

**Check in Telescope:**

- Are parameters being received?
- Is sync_interval the expected value (30)?

---

#### BP2 - Before Sync Trigger

**File:** `app/Http/Controllers/CommunicationController.php`  
**Line:** 26 (before syncDueChannels call)

**Purpose:** Confirm about to trigger sync

**Add this code:**

```php
dump([
    'breakpoint' => 'BP2_BEFORE_SYNC',
    'about_to_call' => 'syncDueChannels',
    'with_interval' => $syncInterval,
]);
```

**Check in Telescope:**

- Sync is being triggered

---

### SYNC SERVICE PHASE

#### BP3 - Sync Service Entry

**File:** `app/Services/MessageSyncService.php`  
**Line:** 158 (start of syncDueChannels)

**Purpose:** Verify active channels found

**Add this code:**

```php
dump([
    'breakpoint' => 'BP3_SYNC_SERVICE_ENTRY',
    'interval_minutes' => $intervalMinutes,
    'active_channels_count' => $channels->count(),
    'channels' => $channels->pluck('type', 'channel_id')->toArray(),
]);
```

**Check in Telescope:**

- How many channels are active?
- Are channel IDs correct (gmail-primary, slack-main, etc.)?

**Common Issues:**

- 0 channels = Database not seeded
- Wrong channel types = Seeder problem

---

#### BP4 - Channel Loop Iteration

**File:** `app/Services/MessageSyncService.php`  
**Line:** 164 (inside foreach loop)

**Purpose:** Track which channel is being processed

**Add this code:**

```php
dump([
    'breakpoint' => 'BP4_BEFORE_CHANNEL_SYNC',
    'channel_id' => $channel->channel_id,
    'channel_type' => $channel->type,
    'last_sync' => $channel->last_sync?->toIso8601String(),
    'needs_sync' => $this->channelNeedsSync($channel, $intervalMinutes),
]);
```

**Check in Telescope:**

- Which channel is being processed now?
- When was it last synced?
- Does it need sync (should always be true for Week 1)?

---

#### BP5 - Channel Sync Start

**File:** `app/Services/MessageSyncService.php`  
**Line:** 28 (after getLastSyncTime)

**Purpose:** Verify time window for message fetch

**Add this code:**

```php
dump([
    'breakpoint' => 'BP5_CHANNEL_SYNC_START',
    'channel_id' => $channel->id,
    'channel_type' => $channelType,
    'last_sync_time' => $lastSyncTime,
    'will_fetch_since' => $lastSyncTime ?? 'last_24_hours',
]);
```

**Check in Telescope:**

- Is last_sync_time correct ISO format?
- If null, will default to 24 hours ago
- Timezone correct?

**Common Issues:**

- Timezone mismatch = No messages returned
- Wrong date format = Node.js error

---

#### BP6 - Before Node.js Call

**File:** `app/Services/MessageSyncService.php`  
**Line:** 35 (before getMessagesSince)

**Purpose:** Confirm parameters going to Node.js

**Add this code:**

```php
dump([
    'breakpoint' => 'BP6_BEFORE_NODEJS_CALL',
    'calling' => 'NodeCommunicationService::getMessagesSince',
    'timestamp' => $lastSyncTime ?? $defaultSince,
    'channel_id' => $channel->channel_id,
]);
```

**Check in Telescope:**

- Parameters formatted correctly?
- Channel ID matches expected value?

---

### NODE.JS COMMUNICATION PHASE

#### BP7 - Node.js Request Setup

**File:** `app/Services/NodeCommunicationService.php`  
**Line:** 23 (after params setup)

**Purpose:** Verify HTTP request to Node.js

**Add this code:**

```php
dump([
    'breakpoint' => 'BP7_NODEJS_SERVICE_ENTRY',
    'url' => $url,
    'params' => $params,
    'timeout' => $this->timeout,
    'full_request_url' => $url . '?' . http_build_query($params),
]);
```

**Check in Telescope:**

- Is URL reachable (http://172.17.0.1:3001)?
- Are params properly formatted?
- Can you copy full_request_url and test in browser/Postman?

**Common Issues:**

- Connection refused = Node.js not running
- Timeout = Node.js too slow or hung
- Wrong URL = .env configuration error

---

#### BP8 - Node.js Response

**File:** `app/Services/NodeCommunicationService.php`  
**Line:** 37 (after response received)

**Purpose:** Verify Node.js responded successfully

**Add this code:**

```php
dump([
    'breakpoint' => 'BP8_NODEJS_RESPONSE',
    'status_code' => $response->status(),
    'successful' => $response->successful(),
    'raw_body' => $response->body(),
    'json_decoded' => $response->json(),
]);
```

**Check in Telescope:**

- HTTP status 200?
- JSON structure looks correct?
- Contains 'messages' or 'data' key?

**Common Issues:**

- 500 = Node.js error (check Node.js logs)
- 404 = Wrong endpoint
- Empty body = Node.js returned nothing

---

#### BP9 - Messages Parsed

**File:** `app/Services/NodeCommunicationService.php`  
**Line:** 47 (after data parsing)

**Purpose:** Verify messages extracted from response

**Add this code:**

```php
dump([
    'breakpoint' => 'BP9_MESSAGES_RECEIVED',
    'messages_count' => count($messages),
    'total' => $total,
    'first_message_id' => $messages[0]['id'] ?? 'none',
    'sample_message' => $messages[0] ?? null,
]);
```

**Check in Telescope:**

- How many messages received?
- First message has correct structure?
- Message ID present?

**Common Issues:**

- 0 messages = Time window issue or no new messages
- Missing 'id' field = Node.js response format wrong

---

### PERSISTENCE PHASE

#### BP10 - Before Bulk Persist

**File:** `app/Services/MessageSyncService.php`  
**Line:** 50 (before bulkPersistMessages)

**Purpose:** Verify messages ready for database

**Add this code:**

```php
dump([
    'breakpoint' => 'BP10_BEFORE_PERSISTENCE',
    'messages_to_persist' => count($messages),
    'channel_id' => $channel->id,
    'sample_message_structure' => isset($messages[0]) ? array_keys($messages[0]) : [],
]);
```

**Check in Telescope:**

- Messages have expected keys?
- Channel ID correct?

---

#### BP11 - Persistence Loop First Item

**File:** `app/Services/MessagePersistenceService.php`  
**Line:** 145 (inside foreach, first iteration only)

**Purpose:** Inspect first message being persisted

**Add this code:**

```php
static $first = true;
if ($first) {
    dump([
        'breakpoint' => 'BP11_PERSISTENCE_LOOP_FIRST',
        'message_id' => $messageData['id'] ?? 'missing',
        'has_sender' => isset($messageData['sender']),
        'has_recipients' => isset($messageData['recipients']),
        'has_content' => isset($messageData['content']),
        'full_message_structure' => $messageData,
    ]);
    $first = false;
}
```

**Check in Telescope:**

- All required fields present?
- Sender/recipients/content exist?

**Common Issues:**

- Missing fields = Node.js adapter issue
- Malformed UTF-8 = sanitizeMessageData should fix

---

#### BP12 - Thread Created/Updated

**File:** `app/Services/MessagePersistenceService.php`  
**Line:** 29 (after createOrUpdateThread)

**Purpose:** Verify thread saved correctly

**Add this code:**

```php
dump([
    'breakpoint' => 'BP12_THREAD_CREATED',
    'thread_id' => $thread->thread_id,
    'thread_db_id' => $thread->id,
    'subject' => $thread->subject,
    'was_created' => $thread->wasRecentlyCreated,
]);
```

**Check in Telescope:**

- Thread created or found existing?
- Thread ID matches message threadId?
- Subject extracted correctly?

---

#### BP13 - Message Saved

**File:** `app/Services/MessagePersistenceService.php`  
**Line:** 48 (after MessagingMessage::create)

**Purpose:** Verify message saved to database

**Add this code:**

```php
dump([
    'breakpoint' => 'BP13_MESSAGE_CREATED',
    'message_id' => $message->message_id,
    'message_db_id' => $message->id,
    'thread_id' => $message->thread_id,
    'sender' => $message->sender,
    'was_created' => $message->wasRecentlyCreated,
]);
```

**Check in Telescope:**

- Message has database ID?
- Linked to correct thread?
- Sender populated?

**Common Issues:**

- Duplicate key error = message_id already exists
- Foreign key error = thread not found

---

#### BP14 - Bulk Persist Complete

**File:** `app/Services/MessagePersistenceService.php`  
**Line:** 174 (after loop)

**Purpose:** Review final persistence statistics

**Add this code:**

```php
dump([
    'breakpoint' => 'BP14_BULK_PERSIST_COMPLETE',
    'stats' => $stats,
    'persisted' => $stats['persisted'],
    'skipped' => $stats['skipped'],
    'failed' => $stats['failed'],
    'sample_results' => array_slice($stats['messages'], 0, 3),
]);
```

**Check in Telescope:**

- How many persisted vs skipped?
- Any failures?
- Error messages if failed?

---

### RESPONSE PHASE

#### BP15 - Back to Controller

**File:** `app/Http/Controllers/CommunicationController.php`  
**Line:** 45 (after stats aggregation)

**Purpose:** Verify aggregated statistics

**Add this code:**

```php
dump([
    'breakpoint' => 'BP15_CONTROLLER_AFTER_SYNC',
    'total_fetched' => $messagesFetched,
    'total_persisted' => $persisted,
    'total_skipped' => $skipped,
    'total_failed' => $failed,
]);
```

**Check in Telescope:**

- Numbers add up correctly?
- Match expectations?

---

#### BP16 - Before Database Query

**File:** `app/Http/Controllers/CommunicationController.php`  
**Line:** 48 (before MessageThread::with)

**Purpose:** Confirm about to fetch threads

**Add this code:**

```php
dump([
    'breakpoint' => 'BP16_BEFORE_THREAD_QUERY',
    'limit' => $request->input('limit', 50),
    'about_to_fetch' => 'threads_with_messages',
]);
```

**Check in Telescope:**

- Query limit correct?

---

#### BP17 - Threads Retrieved

**File:** `app/Http/Controllers/CommunicationController.php`  
**Line:** 53 (after ->get())

**Purpose:** Verify threads loaded from database

**Add this code:**

```php
dump([
    'breakpoint' => 'BP17_THREADS_RETRIEVED',
    'threads_count' => $threads->count(),
    'first_thread_id' => $threads->first()?->thread_id,
    'first_thread_subject' => $threads->first()?->subject,
    'messages_in_first_thread' => $threads->first()?->messages->count(),
]);
```

**Check in Telescope:**

- Threads found in database?
- Messages eager-loaded?
- Counts match expected?

**Common Issues:**

- 0 threads = Nothing in database
- No messages in threads = Relationship problem

---

#### BP18 - Final JSON Response

**File:** `app/Http/Controllers/CommunicationController.php`  
**Line:** 55 (before return response)

**Purpose:** Inspect final API response

**Add this code:**

```php
dump([
    'breakpoint' => 'BP18_FINAL_RESPONSE',
    'response_structure' => [
        'success' => true,
        'messages_fetched' => $messagesFetched,
        'persisted' => $persisted,
        'skipped' => $skipped,
        'failed' => $failed,
        'threads_count' => $threads->count(),
    ],
]);
```

**Check in Telescope:**

- Response has all required fields?
- Threads count correct?

---

## Troubleshooting Flowchart

### Problem: No messages synced

```
Check BP3 → Are channels found?
    ↓ No → Check database seeding
    ↓ Yes
Check BP7 → Is Node.js URL correct?
    ↓ No → Fix .env NODEJS_API_URL
    ↓ Yes
Check BP8 → Did Node.js respond?
    ↓ No → Start Node.js service
    ↓ Yes
Check BP9 → Are messages in response?
    ↓ No → Check time window (BP5)
    ↓ Yes
Check BP10 → Structure correct?
    ↓ No → Fix Node.js adapter
    ↓ Yes
Check BP14 → Persist stats?
```

### Problem: Messages synced but not in database

```
Check BP10 → Messages reaching persistence?
    ↓ No → Sync service issue
    ↓ Yes
Check BP11 → Message structure valid?
    ↓ No → Fix Node.js response format
    ↓ Yes
Check BP12 → Thread created?
    ↓ No → Check unique constraint
    ↓ Yes
Check BP13 → Message created?
    ↓ No → Check database error in Telescope
    ↓ Yes
Check BP14 → Stats show persisted?
```

### Problem: Database has data but UI empty

```
Check BP16 → Query running?
    ↓ No → Controller not executing
    ↓ Yes
Check BP17 → Threads retrieved?
    ↓ No → Database empty or query wrong
    ↓ Yes
Check BP18 → Response structure OK?
    ↓ No → Resource transformation issue
    ↓ Yes
Check React → Is it calling the API?
```

---

## Telescope Filters

**View only dumps:**

```
Type: Dumps
```

**Search for breakpoints:**

```
Search: "BP"
```

**Filter by time:**

```
Last 5 minutes
```

**View related data:**

- Logs tab → See Log::info() calls
- Queries tab → Database operations
- Requests tab → HTTP calls to Node.js

---

## After Debugging

Once you've identified and fixed issues, comment out dumps:

```php
// dump(['breakpoint' => 'BP5', ...]);
```

Or remove them entirely for production.

Keep only critical Log::info() and Log::error() calls.

---

## Quick Command Reference

**View Telescope in browser:**

```
http://localhost:9001/telescope
```

**Clear Telescope data:**

```bash
php artisan telescope:clear
```

**Tail Laravel logs:**

```bash
tail -f storage/logs/laravel.log
```

**Check database directly:**

```bash
php artisan tinker
>>> MessagingChannel::count()
>>> MessageThread::count()
>>> MessagingMessage::count()
```
