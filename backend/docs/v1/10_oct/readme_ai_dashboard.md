# 🤖 AI EMAIL DASHBOARD - README

**Inteligentna analiza emailova sa actionable preporukama fokusiranim na automatizaciju i business razvoj.**

---

## 📖 ŠTA JE OVO?

AI Dashboard je Laravel blade view koji:
- 🔍 **Analizira** sve emailove kroz prizmu tvojih poslovnih ciljeva
- 🎯 **Prioritizuje** akcije (hitno, važno, zakazano)
- 💡 **Daje preporuke** specifične za automatizaciju i pronalaženje partnera
- 📊 **Ocenjuje** svaki email (business potential, urgency, automation relevance)
- ✅ **Predlaže konkretne korake** koje možeš odmah izvršiti
- 🔗 **Direct Gmail linkovi** za brz pristup originalnim porukama

---

## 🎬 SCREENSHOT PREVIEW

```
┌─────────────────────────────────────────────────────────────┐
│ 🧠 AI EMAIL DASHBOARD                         📅 10.10.2025 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🔴 HITNO (do 12h):                                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ✉️ Budget approval - Marko Petrović                     ││
│  │ 💬 Odgovori odmah sa detaljima projekta                 ││
│  │ 👤 Marko • ⏰ do 12:00                                   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  🟡 VAŽNO (do kraja dana):                                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ✉️ Ponuda za automatizaciju - ABC Company               ││
│  │ 💬 Zakaži demo call za sledeću nedelju                  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  📅 DANAS (10.10.2025)                         15 poruka    │
│  ┌───────┬───────┬───────┐                                  │
│  │ HIGH  │ MED   │ LOW   │  ← Message cards                 │
│  │ 🔴8📊9│ 🟡6📊7│ ⚪3📊4│                                  │
│  └───────┴───────┴───────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 QUICK START (5 minuta)

```bash
# 1. Dobavi Groq API key (besplatno)
open https://console.groq.com/keys

# 2. Dodaj u .env
echo "AI_ENABLED=true" >> .env
echo "GROQ_API_KEY=gsk_your_key" >> .env

# 3. Clear cache
php artisan config:clear

# 4. Otvori dashboard
open http://localhost:8000/api/communication/ai-dashboard
```

**Detaljnije:** Vidi `QUICK_START.md`

---

## 📦 ŠTA DOBIJAŠ

### Files Included

```
app/
├── Http/
│   └── Controllers/
│       └── CommunicationController.php    [UPDATED - 2 new methods]
├── Providers/
│   └── AIServiceProvider.php              [NEW]
└── Services/
    └── AI/
        ├── EmailAnalyzerService.php       [EXISTS]
        ├── GoalBasedPromptBuilder.php     [UPDATED - better prompt]
        ├── ModelRouterService.php         [EXISTS]
        ├── TokenEstimator.php             [EXISTS]
        └── DataAnonymizer.php             [EXISTS]

resources/
└── views/
    └── communication/
        └── ai-dashboard.blade.php         [NEW]

config/
└── ai.php                                  [NEW]

routes/
└── api.php                                 [UPDATED - 3 new routes]

.env.ai-dashboard                           [TEMPLATE]

Documentation/
├── README_AI_DASHBOARD.md                  [THIS FILE]
├── QUICK_START.md                          [5-min setup guide]
└── DEPLOYMENT_INSTRUCTIONS.md              [Full guide]
```

---

## 🎯 FEATURES

### 1. Prioritetne Akcije
- **🔴 HITNO** - Za danas (urgency >= 8)
- **🟡 VAŽNO** - Do kraja dana (urgency >= 5)
- **📅 ZAKAZANO** - Meetings, pozivi, eventi
- **💡 PREPORUKE** - Business opportunities (potential >= 7)

### 2. Inteligentno Scoranje
Svaki email dobija 3 ocene (1-10 skala):
- **Business Potential** - Koliko može doneti prihod/partnere
- **Urgency Score** - Koliko je hitno odgovoriti
- **Automation Relevance** - Relevantnost za automatizaciju

### 3. AI Preporuke
- **Summary** - Kratak opis u 1-2 rečenice
- **Recommendation** - Konkretna akcija koju treba preduzeti
- **Action Steps** - 1-3 specifična koraka sa vremenskim okvirima

### 4. Grupisanje po Datumima
- Poruke grupisane po danima
- Color-coded cards (red/yellow/gray)
- 2-3 boksa po redu (responsive grid)

### 5. Filtering & Options
- **Days selector** - 1, 2, 3, 5, 7 dana
- **Reprocess button** - Force re-analiza
- **Auto-refresh** - Svaka 5 minuta

### 6. Direct Gmail Links
- Svaka poruka ima link ka originalnom email-u
- Format: `https://mail.google.com/mail/u/0/#inbox/{message_id}`

---

## 🧠 HOW IT WORKS

```
┌─────────────────┐
│ User opens      │
│ /ai-dashboard   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Get messages from last N days       │
│ WHERE message_timestamp >= X        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Filter messages that need AI:       │
│ - ai_status = 'pending'             │
│ - ai_status = 'failed'              │
│ - ai_analysis IS NULL               │
│ - OR ?reprocess=1                   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ EmailAnalyzerService                │
│ → ModelRouterService (select model) │
│ → GoalBasedPromptBuilder (prompt)   │
│ → DataAnonymizer (sanitize)         │
│ → AI API Call (Groq/OpenAI)         │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Parse JSON response:                │
│ {                                   │
│   "subject": "...",                 │
│   "summary": "...",                 │
│   "recommendation": "...",          │
│   "action_steps": [...],            │
│   "business_potential": 8,          │
│   "urgency_score": 7,               │
│   ...                               │
│ }                                   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Update database:                    │
│ UPDATE messaging_messages SET       │
│   ai_analysis = {...},              │
│   ai_status = 'completed',          │
│   ai_processed_at = NOW()           │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Group messages:                     │
│ - Extract priority actions          │
│ - Group by date                     │
│ - Sort by priority/urgency          │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Render ai-dashboard.blade.php       │
│ with all data                       │
└─────────────────────────────────────┘
```

---

## 🎨 UI COMPONENTS

### Priority Badge
```html
<span class="priority-badge priority-high">HIGH</span>
<span class="priority-badge priority-medium">MEDIUM</span>
<span class="priority-badge priority-low">LOW</span>
```

### Score Badge
```html
<span class="score-badge score-high">8</span>  <!-- Green -->
<span class="score-badge score-medium">5</span> <!-- Yellow -->
<span class="score-badge score-low">2</span>    <!-- Gray -->
```

### Message Card
```html
<div class="message-card high">
  <!-- Header -->
  <div class="flex items-start justify-between">
    <h3>Email Subject</h3>
    <a href="gmail_link">🔗</a>
  </div>
  
  <!-- Scores -->
  <div class="flex gap-3">
    <span class="score-badge">8</span> Business
    <span class="score-badge">9</span> Urgency
    <span class="score-badge">7</span> Auto
  </div>
  
  <!-- Summary -->
  <p>AI-generated summary...</p>
  
  <!-- Recommendation -->
  <div class="bg-purple-50">
    🤖 AI PREPORUKA: ...
  </div>
  
  <!-- Action Steps -->
  <div class="action-step">
    ✓ Step 1: Do this...
  </div>
</div>
```

---

## ⚙️ CONFIGURATION

### config/ai.php

```php
return [
    'enabled' => true,
    
    'routing_strategy' => 'predictive', // token-based routing
    
    'groq' => [
        'api_key' => env('GROQ_API_KEY'),
        'models' => [
            'llama-3.1-8b-instant' => [
                'daily_token_limit' => 14400,
            ],
            // ... više modela
        ],
    ],
    
    'email_analysis' => [
        'max_emails_per_batch' => 50,
        'anonymize_personal_data' => true,
    ],
];
```

### .env Variables

```env
# Required
AI_ENABLED=true
GROQ_API_KEY=gsk_...

# Optional
OPENAI_API_KEY=sk-...
AI_ROUTING_STRATEGY=predictive
AI_CACHE_ENABLED=true
AI_ANONYMIZATION_ENABLED=true
```

---

## 📊 API ENDPOINTS

### 1. HTML View
```bash
GET /api/communication/ai-dashboard
GET /api/communication/ai-dashboard?days=3
GET /api/communication/ai-dashboard?days=7&reprocess=1
```

**Response:** HTML page (Blade view)

---

### 2. JSON API
```bash
GET /api/communication/ai-analysis
GET /api/communication/ai-analysis?days=3
```

**Response:**
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
        "summary": "Potential client interested in workflow automation...",
        "recommendation": "Schedule demo call within 48h to discuss...",
        "action_steps": [
          "Respond today with availability for next week",
          "Prepare case studies of similar projects",
          "Send calendar invite for 30-min discovery call"
        ],
        "priority_level": "high",
        "business_potential": 8,
        "urgency_score": 7,
        "automation_relevance": 9,
        "timeline": "ova_nedelja",
        "category": "automation_opportunity",
        "gmail_link": "https://mail.google.com/..."
      },
      "timestamp": "2025-10-11T10:30:00Z"
    }
  ],
  "meta": {
    "total_messages": 15,
    "days_back": 3
  }
}
```

---

## 🧪 TESTING

### Basic Test
```bash
# 1. Ensure you have messages in database
php artisan tinker
> MessagingMessage::count()

# 2. Open dashboard
open http://localhost:8000/api/communication/ai-dashboard

# 3. Check logs
tail -f storage/logs/laravel.log
```

### Test with Different Parameters
```bash
# Today only
curl http://localhost:8000/api/communication/ai-dashboard?days=1

# Last 3 days
curl http://localhost:8000/api/communication/ai-dashboard?days=3

# Force reprocess
curl http://localhost:8000/api/communication/ai-dashboard?reprocess=1

# JSON output
curl http://localhost:8000/api/communication/ai-analysis?days=1 | jq
```

### Verify AI Processing
```bash
php artisan tinker

# Check AI status distribution
> MessagingMessage::selectRaw('ai_status, count(*) as cnt')
    ->groupBy('ai_status')->get()

# View latest AI analysis
> MessagingMessage::where('ai_status', 'completed')
    ->latest()->first()->ai_analysis

# Check token usage
> app(App\Services\AI\ModelRouterService::class)->getUsageStats()
```

---

## 💰 COST & LIMITS

### Free Tier (Groq)
```
llama-3.1-8b-instant:  14,400 tokens/day  (~30 emails)
llama-3.3-70b:         14,400 tokens/day  (~30 emails)
gemma2-9b-it:           7,200 tokens/day  (~15 emails)
─────────────────────────────────────────────────────
TOTAL FREE:           ~36,000 tokens/day  (~75 emails)
```

**Cost:** $0.00 🎉

### Paid Tier (OpenAI)
```
gpt-4o-mini:
- Input:  $0.150 per 1M tokens
- Output: $0.600 per 1M tokens
- Average email: ~$0.00045

100 emails/day  = $1.35/month
1000 emails/day = $13.50/month
```

---

## 🔧 CUSTOMIZATION

### 1. Update User Goals

**Edit:** `app/Services/AI/GoalBasedPromptBuilder.php`

```php
KORISNIČKE CILJEVI I KONTEKST:
- GLAVNI FOKUS: [Your main business goal]
- KLJUČNI CILJ: [What you're optimizing for]
- STRATEGIJA: [Your approach]
```

### 2. Adjust Scoring Thresholds

**Edit:** `app/Http/Controllers/CommunicationController.php`

```php
// extractPriorityActions() method
if (($analysis['priority_level'] ?? '') === 'high' && 
    ($analysis['urgency_score'] ?? 0) >= 8) {  // Change threshold
    $urgent[] = ...
}
```

### 3. Change Color Scheme

**Edit:** `resources/views/communication/ai-dashboard.blade.php`

```html
<style>
    .priority-high {
        @apply bg-red-100 text-red-800;  /* Change colors */
    }
</style>
```

### 4. Add Custom Categories

**Edit:** `app/Services/AI/GoalBasedPromptBuilder.php`

```php
"category": "automation_opportunity/potential_partner/learning/administrative/[your_new_category]"
```

---

## 🚀 PRODUCTION DEPLOYMENT

### 1. Environment
```bash
# .env
APP_ENV=production
APP_DEBUG=false
AI_ENABLED=true
GROQ_API_KEY=gsk_...
```

### 2. Queue Worker (Recommended)
```bash
# Instead of sync processing, use queue
php artisan queue:work --queue=ai-processing --tries=3 --daemon

# Supervisor config (keep queue running)
[program:ai-queue-worker]
command=php /path/to/artisan queue:work --queue=ai-processing
```

### 3. Scheduler (Auto-process)
```php
// app/Console/Kernel.php
$schedule->call(function () {
    // Auto-process new messages every hour
    $messages = MessagingMessage::where('ai_status', 'pending')
        ->where('created_at', '>', now()->subHour())
        ->get();
    
    foreach ($messages as $message) {
        ProcessMessageWithAI::dispatch($message->id);
    }
})->hourly();
```

### 4. Caching (Redis)
```bash
# .env
AI_CACHE_ENABLED=true
AI_CACHE_DRIVER=redis
CACHE_DRIVER=redis
```

### 5. Monitoring
```bash
# Install Laravel Telescope (optional)
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Access: http://your-domain.com/telescope
```

---

## 🐛 COMMON ISSUES

### "No available AI models"
**Solution:** API key invalid ili exhausted free tier
```bash
php artisan cache:clear
# Check .env: GROQ_API_KEY=gsk_...
```

### "Invalid JSON response"
**Solution:** AI model nije vratio validan JSON
```bash
# Check logs
tail -f storage/logs/laravel.log
# Retry sa reprocess
```

### "Class not found"
**Solution:** Autoloader nije osvježen
```bash
composer dump-autoload
php artisan optimize:clear
```

### Slow loading
**Solution:** Previše poruka za procesiranje
```bash
# Reduce days:
?days=1

# Or reduce batch size in config/ai.php:
'max_emails_per_batch' => 20,
```

---

## 📚 DOCUMENTATION

- **Quick Start:** `QUICK_START.md` - 5-minute setup
- **Full Guide:** `DEPLOYMENT_INSTRUCTIONS.md` - Complete reference
- **Env Template:** `.env.ai-dashboard` - All variables explained

---

## 🤝 SUPPORT

### Debug Commands
```bash
# Clear everything
php artisan optimize:clear

# Check database
php artisan tinker
> MessagingMessage::where('ai_status', 'completed')->count()

# Check API usage
> app(App\Services\AI\ModelRouterService::class)->getUsageStats()

# View logs
tail -f storage/logs/laravel.log
```

### Useful Links
- Groq API Keys: https://console.groq.com/keys
- Groq Docs: https://console.groq.com/docs
- Laravel Docs: https://laravel.com/docs

---

## ✨ FEATURES ROADMAP

### v1.0 (Current)
- ✅ Basic AI analysis
- ✅ Priority actions
- ✅ Score indicators
- ✅ Gmail links
- ✅ Date grouping

### v1.1 (Planned)
- [ ] Queue async processing
- [ ] Real-time websocket updates
- [ ] Action completion tracking
- [ ] Calendar integration
- [ ] Email response drafts

### v2.0 (Future)
- [ ] Multi-language support
- [ ] Custom goal templates
- [ ] Team collaboration
- [ ] Analytics dashboard
- [ ] Mobile app

---

## 📝 LICENSE

Internal project - All rights reserved.

---

## 🎉 CREDITS

Built with:
- Laravel 12
- Tailwind CSS
- Font Awesome
- Groq AI API
- OpenAI API (optional)

---

**Ready to automate? Let's go! 🚀**

```bash
open http://localhost:8000/api/communication/ai-dashboard
```