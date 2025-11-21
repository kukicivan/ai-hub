# AI DASHBOARD - DEPLOYMENT INSTRUCTIONS

## 📋 PREGLED

Ovaj dokument sadrži sve što je potrebno za deployment novog AI Dashboard-a koji analizira emailove i pruža actionable preporuke.

---

## 📁 FAJLOVI KOJI SE DODAJU

### 1. Controller Method
**Lokacija:** `app/Http/Controllers/CommunicationController.php`

Dodati metode:
- `aiDashboard()` - Prikazuje HTML view sa AI analizom
- `aiAnalysis()` - JSON API endpoint za AI analizu
- `extractPriorityActions()` - Helper za prioritetne akcije
- `groupMessagesByDate()` - Helper za grupisanje po datumima
- `calculateDeadline()` - Helper za deadline računanje

**Akcija:** Dodati metode u postojeći CommunicationController ili kreirati novi AI controller.

---

### 2. Blade View
**Lokacija:** `resources/views/communication/ai-dashboard.blade.php`

**Kreirati folder struktur:**
```bash
mkdir -p resources/views/communication
```

**Features:**
- Prioritetne akcije (urgent, important, scheduled, recommendations)
- Grupisanje poruka po datumima
- Color-coded priority badges
- Score indicators (business potential, urgency, automation relevance)
- Action steps display
- Gmail direct links
- Auto-refresh svakih 5 minuta

---

### 3. Routes
**Lokacija:** `routes/api.php`

Dodati rute:
```php
// HTML View
Route::get('/communication/ai-dashboard', [CommunicationController::class, 'aiDashboard'])
    ->name('communication.ai-dashboard');

// JSON API
Route::get('/communication/ai-analysis', [CommunicationController::class, 'aiAnalysis'])
    ->name('communication.ai-analysis');

// Optional short URL
Route::get('/dashboard', [CommunicationController::class, 'aiDashboard'])
    ->name('dashboard');
```

---

### 4. AI Services
**Već postoje (iz prethodnih fajlova):**
- `app/Services/AI/EmailAnalyzerService.php`
- `app/Services/AI/GoalBasedPromptBuilder.php`
- `app/Services/AI/ModelRouterService.php`
- `app/Services/AI/TokenEstimator.php`
- `app/Services/AI/DataAnonymizer.php`

**Svi adapteri:**
- `app/Services/AI/Adapters/Groq/*`
- `app/Services/AI/Adapters/OpenAIAdapter.php`

---

### 5. Service Provider
**Lokacija:** `app/Providers/AIServiceProvider.php`

**Registracija:**
Dodati u `bootstrap/providers.php`:
```php
return [
    // ... existing providers ...
    App\Providers\AIServiceProvider::class,
];
```

---

### 6. Configuration
**Lokacija:** `config/ai.php`

Novi config fajl sa svim AI settings.

---

## 🔧 ENVIRONMENT VARIABLES

Dodati u `.env`:

```env
# AI Feature Toggle
AI_ENABLED=true
AI_ROUTING_STRATEGY=predictive

# OpenAI (optional)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Groq (FREE tier - preporučeno)
GROQ_API_KEY=your_groq_key_here

# AI Settings
AI_CACHE_ENABLED=true
AI_COST_TRACKING_ENABLED=true
AI_ANONYMIZATION_ENABLED=true
AI_LOG_LEVEL=info

# Goals
GOALS_AUTO_UPDATE=false
```

---

## 📦 DEPENDENCIES

Sve dependency-je već postoje u Laravel 12 projektu:
- ✅ Illuminate HTTP Client (za API calls)
- ✅ Laravel Cache (za token tracking)
- ✅ Carbon (za date manipulation)
- ✅ Blade templating engine

**Nema potrebe za `composer install`** - sve je već tu!

---

## 🚀 DEPLOYMENT KORACI

### Korak 1: Kopiraj Fajlove
```bash
# 1. Controller method - dodaj u postojeći CommunicationController.php
# 2. Kreiraj view folder i fajl
mkdir -p resources/views/communication
# Kopiraj ai-dashboard.blade.php

# 3. Update routes/api.php
# Dodaj nove rute

# 4. Kreiraj Service Provider
# Kopiraj AIServiceProvider.php

# 5. Kreiraj config fajl
# Kopiraj config/ai.php
```

### Korak 2: Registruj Service Provider
```bash
# Dodaj u bootstrap/providers.php
php artisan optimize:clear
```

### Korak 3: Setup Environment
```bash
# Dodaj .env varijable
# Dobavi Groq API key: https://console.groq.com/keys

# Clear cache
php artisan config:clear
php artisan cache:clear
```

### Korak 4: Test
```bash
# Test sa 1 danom (danas)
curl http://localhost:8000/api/communication/ai-dashboard

# Test sa 3 dana
curl http://localhost:8000/api/communication/ai-dashboard?days=3

# Test reprocess
curl http://localhost:8000/api/communication/ai-dashboard?days=1&reprocess=1
```

---

## 🎯 KAKO RADI

### Data Flow
```
1. User pristupa: /api/communication/ai-dashboard?days=3
   ↓
2. CommunicationController::aiDashboard()
   ↓
3. Get messages from last 3 days
   ↓
4. Filter messages that need AI processing
   ↓
5. Call EmailAnalyzerService::analyzeEmails()
   ↓
6. ModelRouterService selektuje najbolji dostupan model
   ↓
7. GoalBasedPromptBuilder kreira prompt sa user goals
   ↓
8. AI API call (Groq ili OpenAI)
   ↓
9. Parse JSON response
   ↓
10. Update messaging_messages.ai_analysis
   ↓
11. Group messages by date & priority
   ↓
12. Render ai-dashboard.blade.php view
```

### AI Processing Logic
- **Pending messages:** `ai_status = 'pending'` → Process with AI
- **Failed messages:** `ai_status = 'failed'` → Retry with AI
- **Completed messages:** `ai_status = 'completed'` → Skip (unless `?reprocess=1`)

### Token Management
```
1. Estimate tokens before API call
2. Check available tokens in cache
3. Select model with enough tokens
4. Track usage per model per day
5. Fallback to next model if exhausted
```

---

## 📊 FEATURES

### Prioritetne Akcije
- 🔴 **HITNO** - urgency_score >= 8, priority = high
- 🟡 **VAŽNO** - urgency_score >= 5, priority = high/medium
- 📅 **ZAKAZANO** - Action steps sa keywords: "zakazati", "meeting", "poziv"
- 💡 **PREPORUKE** - business_potential >= 7 ili automation_relevance >= 7

### Message Cards
- Color-coded border (red/yellow/gray) prema priority_level
- Score badges: Business Potential, Urgency, Automation Relevance
- AI recommendation sa robot ikonom
- Action steps sa checkmark-ovima
- Direct Gmail link za svaku poruku
- Attachment count indicator
- Category i timeline badges

### Filtering
- **Days selector:** 1, 2, 3, 5, 7 dana
- **Reprocess button:** Force re-analyze svih poruka
- **Auto-refresh:** Svaka 5 minuta

---

## 🧪 TESTING

### Test Scenarios

#### 1. Test sa novim porukama (pending status)
```bash
# Prvo sync-uj poruke
curl http://localhost:8000/api/communication/sync

# Zatim otvori dashboard
open http://localhost:8000/api/communication/ai-dashboard
```

**Expected:** 
- Sve nove poruke se analiziraju
- `ai_status` se update-uje na 'completed'
- Poruke se prikazuju sa AI analizom

#### 2. Test sa već obrađenim porukama
```bash
# Drugi put otvori dashboard
open http://localhost:8000/api/communication/ai-dashboard
```

**Expected:**
- Skip-uju se poruke sa `ai_status = 'completed'`
- Instant load (nema AI processing-a)
- Prikazuju se cached rezultati

#### 3. Test reprocess funkcionalnosti
```bash
open http://localhost:8000/api/communication/ai-dashboard?reprocess=1
```

**Expected:**
- SVE poruke se ponovo analiziraju
- Novi AI insights (možda bolji prompt)
- Updated `ai_analysis` u bazi

#### 4. Test sa razliäitim vremenskim periodima
```bash
# Danas
open http://localhost:8000/api/communication/ai-dashboard?days=1

# Poslednja 3 dana
open http://localhost:8000/api/communication/ai-dashboard?days=3

# Poslednja nedelja
open http://localhost:8000/api/communication/ai-dashboard?days=7
```

#### 5. Test JSON API endpointa
```bash
curl http://localhost:8000/api/communication/ai-analysis?days=1 | jq
```

**Expected JSON:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "message_id": "abc123",
      "subject": "Business proposal",
      "ai_analysis": {
        "subject": "Business proposal - automation opportunity",
        "summary": "...",
        "recommendation": "...",
        "action_steps": [...],
        "priority_level": "high",
        "business_potential": 8,
        "urgency_score": 7,
        "automation_relevance": 9,
        "timeline": "ova_nedelja",
        "category": "automation_opportunity",
        "gmail_link": "https://mail.google.com/..."
      }
    }
  ],
  "meta": {
    "total_messages": 15,
    "days_back": 1
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Problem: "No available AI models with sufficient tokens"

**Uzrok:** Svi free tier modeli su exhausted za danas.

**Rešenje:**
```bash
# Option 1: Clear cache (reset token counters)
php artisan cache:clear

# Option 2: Dodaj OpenAI API key (paid, unlimited tokens)
echo "OPENAI_API_KEY=sk-..." >> .env
php artisan config:clear

# Option 3: Čekaj do sutra (free tier limits reset)
```

---

### Problem: "Invalid JSON response from AI"

**Uzrok:** AI model nije vratio validan JSON.

**Rešenje:**
```bash
# Check logs
tail -f storage/logs/laravel.log

# Retry sa reprocess
open http://localhost:8000/api/communication/ai-dashboard?reprocess=1
```

**Debug:**
- Proveri `EmailAnalyzerService.php` - JSON stripping logic
- Model možda dodaje markdown ```json blokove
- Proveri `GoalBasedPromptBuilder.php` - prompt mora tražiti SAMO JSON

---

### Problem: Poruke se ne prikazuju

**Uzrok:** Nema poruka sa `ai_status = 'completed'`

**Rešenje:**
```bash
# Check database
php artisan tinker
> MessagingMessage::where('ai_status', 'completed')->count()
> MessagingMessage::where('ai_status', 'pending')->count()

# Ako su sve pending, force process:
open http://localhost:8000/api/communication/ai-dashboard?reprocess=1
```

---

### Problem: Slow loading (više od 30s)

**Uzrok:** Previše poruka za procesiranje odjednom.

**Rešenje:**
```bash
# Smanji batch size u config/ai.php
'email_analysis' => [
    'max_emails_per_batch' => 20, // Bilo: 50
]

# Ili procesuj po danima
open http://localhost:8000/api/communication/ai-dashboard?days=1
# Pa sutra još jedan dan, itd.
```

---

### Problem: AI vraća loše preporuke

**Uzrok:** Prompt nije dovoljno specifičan.

**Rešenje:** Update `GoalBasedPromptBuilder.php`

**Dodaj više konteksta:**
```php
DODATNI KONTEKST:
- Industrija: IT/Digital Transformation
- Prosečna vrednost projekta: $2000-5000
- Ciljni klijenti: SME, startups, agencies
- Glavne usluge: Workflow automation, AI integration, API development
```

---

## 📈 MONITORING

### Key Metrics to Track

```bash
# 1. AI Processing Success Rate
SELECT 
  ai_status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM messaging_messages), 2) as percentage
FROM messaging_messages
WHERE message_timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY ai_status;
```

```bash
# 2. Average Scores
SELECT 
  AVG(JSON_EXTRACT(ai_analysis, '$.business_potential')) as avg_business,
  AVG(JSON_EXTRACT(ai_analysis, '$.urgency_score')) as avg_urgency,
  AVG(JSON_EXTRACT(ai_analysis, '$.automation_relevance')) as avg_automation
FROM messaging_messages
WHERE ai_status = 'completed';
```

```bash
# 3. Priority Distribution
SELECT 
  JSON_EXTRACT(ai_analysis, '$.priority_level') as priority,
  COUNT(*) as count
FROM messaging_messages
WHERE ai_status = 'completed'
GROUP BY priority;
```

```bash
# 4. Category Distribution
SELECT 
  JSON_EXTRACT(ai_analysis, '$.category') as category,
  COUNT(*) as count
FROM messaging_messages
WHERE ai_status = 'completed'
GROUP BY category
ORDER BY count DESC;
```

### Laravel Telescope (Recommended)

```bash
# Install Telescope (optional, for debugging)
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Access: http://localhost:8000/telescope
```

**What to monitor:**
- HTTP requests to AI API
- Response times
- Failed jobs
- Database queries
- Cache hits/misses

---

## 🔒 SECURITY

### Data Privacy

**Already implemented:**
- ✅ Email anonymization (DataAnonymizer service)
- ✅ Personal data stripping before AI processing
- ✅ No storing of raw email content in AI logs

**Additional recommendations:**
```php
// config/ai.php - enforce anonymization
'anonymization' => [
    'enabled' => true, // ALWAYS true for production
]
```

### API Rate Limiting

```php
// routes/api.php - dodaj rate limiting
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/communication/ai-dashboard', ...);
    Route::get('/communication/ai-analysis', ...);
});
```

### Authentication (Production)

```php
// Dodaj JWT middleware
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/communication/ai-dashboard', ...);
});
```

---

## 💰 COST ESTIMATION

### Free Tier (Groq)
```
Daily limit: ~14,400 tokens (llama-3.1-8b-instant)
Average email: ~500 tokens (prompt + completion)
Daily capacity: ~28 emails

Ako imaš više emailova, rotira između više Groq modela:
- llama-3.1-8b-instant: 14,400 tokens/day
- llama-3.3-70b-versatile: 14,400 tokens/day
- gemma2-9b-it: 7,200 tokens/day
TOTAL FREE: ~36,000 tokens/day = ~72 emails/day
```

### Paid Tier (OpenAI)
```
Model: gpt-4o-mini
Cost: $0.150 per 1M input tokens, $0.600 per 1M output tokens

Average email:
- Input: ~1,000 tokens = $0.00015
- Output: ~500 tokens = $0.0003
Total: $0.00045 per email

100 emails/day = $0.045/day = $1.35/month
1,000 emails/day = $0.45/day = $13.50/month
```

### Optimization Tips

1. **Cache AI results** - Ne procesuj istu poruku 2x
2. **Batch processing** - Group emails za single API call (ako API podržava)
3. **Smart filtering** - Skip low-priority emails (newsletters, notifications)
4. **Token optimization** - Smanji prompt size, koristi snippet umesto full content

```php
// EmailAnalyzerService.php - optimizacija
$emailsForAnalysis = $messagesToProcess->map(function($msg) {
    return [
        'id' => $msg->message_id,
        'sender' => $msg->sender['email'] ?? 'unknown',
        'subject' => $msg->metadata['subject'] ?? '',
        'content' => [
            // Use snippet instead of full text (80% token reduction)
            'text' => $msg->content_snippet ?? substr($msg->content_text, 0, 500),
        ],
    ];
})->toArray();
```

---

## 🚀 PRODUCTION OPTIMIZATIONS

### 1. Queue AI Processing

**Problem:** Dashboard load blokira dok se AI procesira.

**Rešenje:** Async processing sa queue jobs.

```php
// CommunicationController.php
if ($messagesToProcess->count() > 0) {
    // Dispatch queue job umesto sync processing
    foreach ($messagesToProcess as $message) {
        ProcessMessageWithAI::dispatch($message->id)
            ->onQueue('ai-processing');
    }
    
    return view('communication.ai-dashboard-processing', [
        'processing_count' => $messagesToProcess->count(),
        'refresh_in' => 30, // seconds
    ]);
}
```

**Start queue worker:**
```bash
php artisan queue:work --queue=ai-processing --tries=3
```

---

### 2. Redis Caching

```php
// CommunicationController.php - cache results
$cacheKey = "ai_dashboard_user_{$userId}_days_{$daysBack}";

$data = Cache::remember($cacheKey, 3600, function() use ($daysBack) {
    // ... AI processing logic ...
    return $processedData;
});
```

---

### 3. Pagination

```php
// Umesto load all messages
$messages = MessagingMessage::with(['thread', 'attachments'])
    ->where('message_timestamp', '>=', $startDate)
    ->where('ai_status', 'completed')
    ->orderBy('message_timestamp', 'desc')
    ->paginate(50); // Show 50 per page
```

---

### 4. Background Scheduler

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Auto-process new messages every hour
    $schedule->call(function () {
        $messages = MessagingMessage::where('ai_status', 'pending')
            ->where('created_at', '>', now()->subHour())
            ->get();
        
        foreach ($messages as $message) {
            ProcessMessageWithAI::dispatch($message->id);
        }
    })->hourly();
}
```

---

## 📞 SUPPORT & KONTAKT

### Za pitanja o AI integraciji:
- Check logs: `storage/logs/laravel.log`
- Debug sa Tinker: `php artisan tinker`
- Test API direktno: `curl http://localhost:8000/api/communication/ai-analysis`

### Korisne komande:
```bash
# Clear sve cache
php artisan optimize:clear

# Restart queue
php artisan queue:restart

# Check AI usage stats
php artisan tinker
> app(App\Services\AI\ModelRouterService::class)->getUsageStats()

# Check database AI status
php artisan tinker
> MessagingMessage::selectRaw('ai_status, count(*) as cnt')->groupBy('ai_status')->get()
```

---

## ✅ FINAL CHECKLIST

Pre production deployment:

- [ ] Svi fajlovi kopirani na pravo mesto
- [ ] AIServiceProvider registrovan u `bootstrap/providers.php`
- [ ] `.env` varijable dodane (GROQ_API_KEY obavezno)
- [ ] `php artisan config:clear` izvršeno
- [ ] `php artisan optimize:clear` izvršeno
- [ ] Test sa 1 porukom prošao uspešno
- [ ] Test sa 10+ poruka prošao uspešno
- [ ] AI analysis vraća validne JSON rezultate
- [ ] Dashboard se učitava u <5s
- [ ] Gmail linkovi rade ispravno
- [ ] Priority actions se prikazuju korektno
- [ ] Reprocess button radi
- [ ] Days filter radi
- [ ] Mobile responsive (optional)
- [ ] Queue worker pokrenut (production)
- [ ] Scheduler konfigurisan (production)
- [ ] Monitoring setup (Telescope ili alternative)
- [ ] Backup strategy u mjestu

---

**KRAJ DEPLOYMENT INSTRUCTIONS**

Za bilo kakva pitanja ili probleme, proveri najpre:
1. `storage/logs/laravel.log`
2. Database: `SELECT * FROM messaging_messages WHERE ai_status = 'failed'`
3. AI usage: `app(ModelRouterService::class)->getUsageStats()`