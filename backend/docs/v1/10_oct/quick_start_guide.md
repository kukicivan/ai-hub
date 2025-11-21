# 🚀 QUICK START - AI Dashboard

Pusti AI Dashboard za **5 minuta**.

---

## ✅ PRE-REQUISITES

- ✅ Laravel 12 instaliran
- ✅ Database setup (MySQL/PostgreSQL)
- ✅ Messaging system aktivan (poruke u bazi)
- ✅ Internet konekcija

---

## 📋 STEP-BY-STEP

### 1️⃣ DOBAVI GROQ API KEY (2 min)

```bash
# Otvori browser:
open https://console.groq.com/keys

# Kreiraj account (besplatno)
# Click "Create API Key"
# Copy key (počinje sa "gsk_...")
```

---

### 2️⃣ DODAJ U .ENV (30s)

```bash
# Backend folder
cd backend

# Dodaj na kraj .env fajla:
echo "AI_ENABLED=true" >> .env
echo "GROQ_API_KEY=gsk_your_actual_key_here" >> .env

# Clear cache
php artisan config:clear
```

---

### 3️⃣ REGISTRUJ SERVICE PROVIDER (1 min)

**Otvori:** `bootstrap/providers.php`

**Dodaj:**
```php
return [
    // ... existing providers ...
    App\Providers\AIServiceProvider::class,  // ← ADD THIS
];
```

**Clear cache:**
```bash
php artisan optimize:clear
```

---

### 4️⃣ TEST! (1 min)

```bash
# Start Laravel server ako nije već pokrenut
php artisan serve

# Otvori browser:
open http://localhost:8000/api/communication/ai-dashboard

# Ili curl:
curl http://localhost:8000/api/communication/ai-dashboard
```

**Expected:**
- ✅ Dashboard se učitava
- ✅ Poruke se procesiraju sa AI
- ✅ Vidiš prioritetne akcije
- ✅ Poruke grupisane po datumima

---

## 🎯 ŠORTKAT URLS

```bash
# Danas
http://localhost:8000/api/communication/ai-dashboard

# Poslednja 3 dana
http://localhost:8000/api/communication/ai-dashboard?days=3

# Reprocess sve
http://localhost:8000/api/communication/ai-dashboard?reprocess=1

# JSON API
http://localhost:8000/api/communication/ai-analysis
```

---

## 🐛 TROUBLESHOOTING

### Problem: "Class AIServiceProvider not found"

**Fix:**
```bash
# Proveri da li postoji fajl:
ls app/Providers/AIServiceProvider.php

# Ako ne postoji, kreiraj ga (kopiraj iz artifacts)
# Pa clear cache:
composer dump-autoload
php artisan optimize:clear
```

---

### Problem: "No available AI models"

**Fix:**
```bash
# Proveri API key u .env
cat .env | grep GROQ

# Ako nije dobar, update:
# GROQ_API_KEY=gsk_correct_key_here

# Clear config
php artisan config:clear
```

---

### Problem: "Nema poruka"

**Fix:**
```bash
# Sync poruke prvo:
curl http://localhost:8000/api/communication/sync

# Check database:
php artisan tinker
> MessagingMessage::count()
> MessagingMessage::where('message_timestamp', '>', now()->subDays(3))->count()

# Ako ima poruka, pokušaj dashboard:
open http://localhost:8000/api/communication/ai-dashboard?days=7
```

---

### Problem: Slow loading (>30s)

**Fix:**
```bash
# Smanji broj dana:
open http://localhost:8000/api/communication/ai-dashboard?days=1

# Ili povećaj batch size u config/ai.php:
'max_emails_per_batch' => 20,  # Bilo: 50
```

---

## 📊 CHECK STATUS

```bash
# Tinker console:
php artisan tinker

# Check AI status:
> MessagingMessage::selectRaw('ai_status, count(*) as cnt')->groupBy('ai_status')->get()

# Check token usage:
> app(App\Services\AI\ModelRouterService::class)->getUsageStats()

# Check latest message AI analysis:
> MessagingMessage::where('ai_status', 'completed')->latest()->first()->ai_analysis
```

---

## ✅ SUCCESS CHECKLIST

Ako vidiš ovo, sve radi:

- ✅ Dashboard se učitava u <10s
- ✅ "PRIORITETNE AKCIJE ZA DANAS" sekcija prikazana
- ✅ Poruke grupisane po datumima
- ✅ Svaka poruka ima:
  - Priority badge (high/medium/low)
  - Score indicators (business, urgency, automation)
  - AI preporuku (ljubičasta kutija)
  - Action steps (plavi blokovi)
  - Gmail link (radi)
- ✅ Days filter radi (dropdown)
- ✅ Reprocess button prisutan

---

## 🎉 GOTOVO!

Sada možeš:

1. **Koristiti dashboard daily** za prioritizaciju emailova
2. **Testirati različite vremenske periode** (1-7 dana)
3. **Reprocessovati** ako prompt updates
4. **Monitorovati** AI usage u logs

---

## 📚 NEXT STEPS

- 📖 Pročitaj `DEPLOYMENT_INSTRUCTIONS.md` za advanced features
- 🔧 Customize prompt u `GoalBasedPromptBuilder.php`
- 🚀 Setup queue za async processing (production)
- 📊 Add Laravel Telescope za monitoring
- 💰 Optimize costs (check token usage)

---

**Need help?**
```bash
# Check logs:
tail -f storage/logs/laravel.log

# Debug:
php artisan tinker

# Clear everything:
php artisan optimize:clear
php artisan cache:clear
php artisan config:clear
```

**Happy automating! 🤖✨**
