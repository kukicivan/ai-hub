# DETALJAN IZVJEŠTAJ O ANALIZI AI-HUB PROJEKTA

**Datum:** 21. novembar 2025
**Analizirao:** Claude Code
**Verzija:** 1.0

---

## SADRŽAJ

1. [Status Git Grana](#1-status-git-grana)
2. [Pregled Projekta](#2-pregled-projekta)
3. [Kritične Greške](#3-kritične-greške-moraju-se-popraviti)
4. [Šta Je Urađeno](#4-šta-je-urađeno-funkcionalne-komponente)
5. [Šta Treba Uraditi](#5-šta-treba-uraditi-po-prioritetu)
6. [Sigurnosni Problemi](#6-sigurnosni-problemi)
7. [Arhitektura - Dijagram Povezivanja](#7-arhitektura---dijagram-povezivanja)
8. [Procjena Za Produkciju](#8-procjena-za-produkciju)
9. [Preporučeni Sljedeći Koraci](#9-preporučeni-sljedeći-koraci)
10. [Frontend Detaljna Analiza](#10-frontend-detaljna-analiza)
11. [Backend Detaljna Analiza](#11-backend-detaljna-analiza)

---

## 1. STATUS GIT GRANA

| Repozitorijum | Tražena grana | Trenutna grana | Status |
|---------------|---------------|----------------|--------|
| **Glavni repo** | `develop` | `main` | ⚠️ `develop` grana ne postoji |
| **Frontend** | `app-claude-code` | N/A (integrisano) | ✅ Sada dio glavnog repo |
| **Backend** | `app-claude-code` | N/A (integrisano) | ✅ Sada dio glavnog repo |

**Napomena:** Repozitorijum je reorganizovan - frontend i backend su sada direktno u glavnom repozitorijumu, ne kao submoduli.

---

## 2. PREGLED PROJEKTA

**Projekat:** AI Automation Productivity Hub
**Arhitektura:** Full-stack aplikacija (Laravel API + React SPA)

| Komponenta | Tehnologije | Status |
|------------|------------|--------|
| **Frontend** | React 19.1, TypeScript 5.2, Vite 5.3, Tailwind CSS, Redux Toolkit | ~70% kompletno |
| **Backend** | Laravel 12, PHP 8.3, MySQL 8, Redis, JWT Auth | ~75% kompletno |
| **AI Integracija** | Groq (20 modela), OpenAI | ✅ Funkcionalno |
| **Infrastruktura** | Docker Compose, Nginx | ✅ Konfigurisano |

### Ključne Funkcionalnosti Projekta

Prema SRS dokumentu, projekat ima za cilj:

- **Unified Communication Management** - Konsolidacija multi-channel komunikacija
- **Intelligent Time Management** - Proaktivno zakazivanje sa kontekst analizom
- **Smart Project Management** - Cross-platform integracija sa analitikom
- **AI-Powered Social Media** - Automatizovano kreiranje sadržaja
- **Intelligent Follow-Up Engine** - Automatizovani sistem preporuka

---

## 3. KRITIČNE GREŠKE (MORAJU SE POPRAVITI)

### Backend - 2 Kritične greške

#### 3.1 BaseController Namespace Greška ⛔

**Fajl:** `/backend/src/app/Http/Controllers/Api/BaseController.php:3`

```php
// POGREŠNO:
namespace app\Http\Controllers\Api;

// ISPRAVNO:
namespace App\Http\Controllers\Api;
```

**Uticaj:** SVE auth endpoint-e padaju s "Class not found" greškom

**Kako popraviti:**
```bash
# Otvoriti fajl i promijeniti liniju 3
sed -i 's/namespace app\\Http/namespace App\\Http/' backend/src/app/Http/Controllers/Api/BaseController.php
```

---

#### 3.2 Nedostaju Imports u AuthController ⛔

**Fajl:** `/backend/src/app/Http/Controllers/Api/AuthController.php`

```php
// Nedostaju ovi importi (dodati nakon linije 14):
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password as PasswordRule;
```

**Uticaj:**
- `forgotPassword()` metoda ne radi (linija 261)
- `resetPassword()` metoda ne radi (linija 316)
- `changePassword()` metoda ne radi (linija 385)

---

### Frontend - 2 Kritične greške

#### 3.3 Profil Update Nije Implementiran ⛔

**Fajl:** `/frontend/src/pages/ProfilePage.tsx:28`

```typescript
const onSubmit = (data: ProfileFormData) => {
  // TODO: Dispatch Redux action to update profile
  console.log('Profile update:', data);
};
```

**Uticaj:** Korisnici ne mogu sačuvati promjene profila

**Kako popraviti:**
1. Kreirati `updateProfile` mutation u `authApi.ts`
2. Implementirati `onSubmit` handler da pozove mutation
3. Dodati success/error notifikacije

---

#### 3.4 Password Change Nije Implementiran ⛔

**Fajl:** `/frontend/src/pages/PasswordChange.tsx:21-23`

```typescript
const onSubmit = (data: PasswordChangeFormData) => {
  // TODO: Dispatch Redux action to change password
  console.log('Password change:', data);
};
```

**Uticaj:** Promjena lozinke ne funkcionira

**Kako popraviti:**
1. Kreirati `changePassword` mutation u `authApi.ts`
2. Implementirati `onSubmit` handler
3. Dodati validaciju za current password
4. Redirect na login nakon uspješne promjene

---

## 4. ŠTA JE URAĐENO (Funkcionalne komponente)

### Backend ✅

| Funkcionalnost | Status | Detalji |
|----------------|--------|---------|
| **JWT Autentifikacija** | ✅ | Login/logout/refresh radi |
| **Database Schema** | ✅ | 11 migracija, kompleksne relacije |
| **Email Sinhronizacija** | ✅ | Gmail integracija, threading |
| **AI Model Integration** | ✅ | 20 Groq adaptera, token tracking |
| **Email Analiza** | ✅ | Sentiment, kategorizacija, sažetak |
| **Docker Setup** | ✅ | Nginx + PHP-FPM + MySQL + Redis |
| **API Resources** | ✅ | 8 response formatera |
| **Unit Testovi** | ✅ | 14 test fajlova |

### Frontend ✅

| Funkcionalnost | Status | Detalji |
|----------------|--------|---------|
| **Auth System** | ✅ | Login/logout, token refresh |
| **Route Guards** | ✅ | RequireAuth, RedirectIfAuthenticated |
| **Dashboard UI** | ✅ | Statistike, grafikoni |
| **Email Inbox** | ✅ | v1 i v2 verzije, AI badge-ovi |
| **UI Komponente** | ✅ | 60+ shadcn/ui komponenti |
| **State Management** | ✅ | Redux Toolkit + RTK Query |
| **Routing** | ✅ | React Router v7 |
| **Testing Setup** | ✅ | Jest + MSW konfigurisano |

---

## 5. ŠTA TREBA URADITI (Po prioritetu)

### Visoki Prioritet 🔴

| # | Zadatak | Lokacija | Procjena |
|---|---------|----------|----------|
| 1 | Popraviti BaseController namespace | Backend | 5 min |
| 2 | Dodati missing imports u AuthController | Backend | 5 min |
| 3 | Implementirati profil update Redux akciju | Frontend | 2h |
| 4 | Implementirati password change Redux akciju | Frontend | 2h |
| 5 | Kreirati `.env.example` fajl | Backend | 15 min |
| 6 | Omogućiti Queue Worker container | Backend | 10 min |

### Srednji Prioritet 🟡

| # | Zadatak | Lokacija | Procjena |
|---|---------|----------|----------|
| 7 | Refaktorisati Register stranicu (shadcn/ui) | Frontend | 3h |
| 8 | Omogućiti Task Scheduler container | Backend | 10 min |
| 9 | Kreirati EmailAction model | Backend | 30 min |
| 10 | Kreirati UserGoal i EmailCategory modele | Backend | 1h |
| 11 | Implementirati TODO funkcionalnost | Frontend + Backend | 4h |
| 12 | Dodati i18n podršku (srpski/engleski) | Frontend | 4h |
| 13 | Implementirati Google OAuth | Frontend + Backend | 4h |
| 14 | Konsolidirati API klijente (RTK Query) | Frontend | 3h |

### Niski Prioritet 🟢

| # | Zadatak | Lokacija | Procjena |
|---|---------|----------|----------|
| 15 | Dodati Health Check endpoint | Backend | 15 min |
| 16 | Registrovati UserProfile/UserManagement rute | Backend | 30 min |
| 17 | Poboljšati logging u ModelRouterService | Backend | 1h |
| 18 | Dodati Sentry error tracking | Frontend + Backend | 2h |
| 19 | Povećati test coverage (>80%) | Oba | 8h |
| 20 | Ukloniti nekorišteni Spatie Permission paket | Backend | 15 min |

---

## 6. SIGURNOSNI PROBLEMI

| Problem | Ozbiljnost | Lokacija | Preporuka |
|---------|------------|----------|-----------|
| Hardkodirani DB kredencijali | 🔴 Visoka | `docker-compose.yml` | Koristiti env varijable |
| Tokeni u localStorage | 🟡 Srednja | Frontend | Razmotriti httpOnly cookies |
| Nedostaje .env.example | 🟡 Srednja | Backend | Kreirati template |
| Javni email endpoints | 🟡 Srednja | Backend routes | Dodati auth middleware |

### Detalji sigurnosnih problema

#### Hardkodirani kredencijali u docker-compose.yml

```yaml
# TRENUTNO (LOŠE):
MYSQL_USER: backend_admin
MYSQL_PASSWORD: backend_pass_2025
MYSQL_ROOT_PASSWORD: root_backend_2025

# PREPORUČENO:
MYSQL_USER: ${DB_USERNAME}
MYSQL_PASSWORD: ${DB_PASSWORD}
MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
```
#### Tokeni u localStorage
```javascript
// TRENUTNO (Rizično za XSS):
localStorage.setItem("access_token", token);

// PREPORUČENO:
// Koristiti httpOnly cookies za token storage
// Implementirati CSRF zaštitu
```

---

## 7. ARHITEKTURA - DIJAGRAM POVEZIVANJA

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Login     │  │  Dashboard  │  │   Inbox     │              │
│  │   Form      │  │   Stats     │  │  v1 / v2    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│  ┌──────▼────────────────▼────────────────▼──────┐              │
│  │              Redux Toolkit + RTK Query          │              │
│  │    ┌─────────────┐      ┌─────────────────┐    │              │
│  │    │  authSlice  │      │    emailApi     │    │              │
│  │    └─────────────┘      └─────────────────┘    │              │
│  └───────────────────────────┬───────────────────┘              │
└──────────────────────────────┼──────────────────────────────────┘
                               │ HTTPS :9001
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                        BACKEND (Laravel)                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      API Routes                             │  │
│  │  /api/auth/*  │  /api/email/*  │  /api/sync/*  │  /api/*   │  │
│  └───────┬───────┴───────┬────────┴───────┬───────┴────┬──────┘  │
│          │               │                │            │          │
│  ┌───────▼───────┐ ┌─────▼─────┐ ┌────────▼────────┐   │          │
│  │ AuthController│ │EmailCtrl  │ │SyncOrchestrator │   │          │
│  │  (JWT Auth)   │ │ V5 + AI   │ │    Service      │   │          │
│  └───────────────┘ └─────┬─────┘ └────────┬────────┘   │          │
│                          │                │            │          │
│          ┌───────────────▼────────────────▼────────┐   │          │
│          │           AI SERVICES LAYER              │   │          │
│          │  ┌─────────────────────────────────────┐ │   │          │
│          │  │     EmailAnalyzerService            │ │   │          │
│          │  │  ┌─────────────┐ ┌────────────────┐ │ │   │          │
│          │  │  │ModelRouter  │ │PromptBuilder   │ │ │   │          │
│          │  │  │(20 modela)  │ │(Goal-based)    │ │ │   │          │
│          │  │  └──────┬──────┘ └────────────────┘ │ │   │          │
│          │  └─────────┼─────────────────────────────┘   │          │
│          └────────────┼─────────────────────────────────┘          │
│                       │                                            │
│                       ▼                                            │
│          ┌────────────────────────┐                               │
│          │    GROQ API (20 LLM)   │                               │
│          │  - Llama 3.1/3.3/4     │                               │
│          │  - Qwen, Kimi, etc.    │                               │
│          └────────────────────────┘                               │
│                                                                    │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐      │
│  │   MySQL 8.0    │  │     Redis      │  │   Queue Jobs   │      │
│  │  (backend_db)  │  │ (backend_redis)│  │   (disabled)   │      │
│  └────────────────┘  └────────────────┘  └────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. PROCJENA ZA PRODUKCIJU

| Kriterij | Status | Napomena |
|----------|--------|----------|
| **Funkcionalnost** | 70% | Osnovne funkcije rade |
| **Sigurnost** | 50% | Treba hardening |
| **Stabilnost** | 60% | Kritične greške moraju se popraviti |
| **Performanse** | 75% | Redis cache, ali queue ne radi |
| **Testovi** | 40% | Postoje, ali nedovoljna pokrivenost |
| **Dokumentacija** | 50% | SRS kompletan, API docs nepotpuni |

### UKUPNO: NIJE SPREMAN ZA PRODUKCIJU

Potrebno je minimalno **1-2 dana rada** da se poprave kritične greške i omoguće queue/scheduler servisi.

### Checklist za produkciju

- [ ] Popraviti BaseController namespace
- [ ] Dodati missing imports u AuthController
- [ ] Implementirati profil/password funkcionalnosti
- [ ] Kreirati .env.example
- [ ] Ukloniti hardkodirane kredencijale
- [ ] Omogućiti Queue Worker
- [ ] Omogućiti Task Scheduler
- [ ] Testirati end-to-end auth flow
- [ ] Security audit
- [ ] Load testing

---

## 9. PREPORUČENI SLJEDEĆI KORACI

### Odmah (Danas) - 30 minuta

1. **Popraviti 2 kritične backend greške** (10 min)
   ```bash
   # BaseController fix
   sed -i 's/namespace app\\Http/namespace App\\Http/' \
     backend/src/app/Http/Controllers/Api/BaseController.php
   ```

2. **Kreirati `.env.example`** (15 min)
   ```bash
   cp backend/src/.env.staging backend/src/.env.example
   # Ukloniti sensitive podatke
   ```

### Ova sedmica - 8 sati

- [ ] Implementirati profil/password Redux akcije (4h)
- [ ] Omogućiti Queue Worker (30 min)
- [ ] Testirati end-to-end auth flow (2h)
- [ ] Code review i bug fixes (1.5h)

### Sljedeća sedmica - 16 sati

- [ ] Dodati i18n podršku (4h)
- [ ] Implementirati Google OAuth (4h)
- [ ] Povećati test coverage (8h)

---

## 10. FRONTEND DETALJNA ANALIZA

### 10.1 Struktura Projekta

```
frontend/
├── src/
│   ├── components/
│   │   ├── core/              # Sidebar, layout komponente
│   │   ├── ui/                # 60+ shadcn/ui komponenti
│   │   ├── ai-dashboard/      # Dashboard komponente
│   │   ├── ai-analytics/      # Analytics views
│   │   ├── ai-services/       # AI services management
│   │   ├── ai-integrations/   # Integration management
│   │   ├── ai-help/           # Help/support
│   │   ├── inbox-v1/          # Email inbox verzija 1
│   │   └── inbox-v2/          # Email inbox verzija 2
│   ├── redux/
│   │   ├── api/               # RTK Query setup
│   │   ├── features/
│   │   │   ├── auth/          # Autentifikacija
│   │   │   └── email/         # Email API endpoints
│   │   ├── hooks.ts           # Typed Redux hooks
│   │   └── store.ts           # Redux store config
│   ├── routes/
│   │   ├── routes.tsx         # Route definicije
│   │   └── guards/            # Auth guards
│   ├── pages/                 # Page komponente
│   ├── services/              # API client servisi
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript tipovi
│   ├── utils/                 # Utility funkcije
│   └── config/                # Konfiguracija
├── public/                    # Static assets
├── docs/                      # Dokumentacija
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### 10.2 Ključne Zavisnosti

| Paket | Verzija | Namjena |
|-------|---------|---------|
| react | ^19.1.1 | UI framework |
| typescript | ^5.2.2 | Type safety |
| @reduxjs/toolkit | ^2.8.2 | State management |
| react-router-dom | ^7.6.3 | Routing |
| tailwindcss | ^3.4.4 | Styling |
| axios | ^1.13.2 | HTTP client |
| zod | ^3.25.67 | Validacija |
| recharts | ^3.0.2 | Grafikoni |

### 10.3 API Endpoints (Frontend koristi)

```typescript
// Authentication
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
POST   /api/auth/register

// Email
GET    /api/email/messages
GET    /api/email/messages/v5
GET    /api/email/messages/{id}
POST   /api/email/{messageId}/analyze
PATCH  /api/email/messages/{id}/read
PATCH  /api/email/messages/{id}/unread
```

### 10.4 Rute Aplikacije

| Ruta | Komponenta | Auth Required |
|------|------------|---------------|
| `/login` | Login | Ne |
| `/dashboard` | AIDashboardWrapper | Da |
| `/inbox-v1` | InboxV1Wrapper | Da |
| `/inbox-v2` | InboxV2Wrapper | Da |
| `/ai-services` | AIServicesWrapper | Da |
| `/ai-integrations` | AIIntegrationsWrapper | Da |
| `/ai-analytics` | AIAnalyticsWrapper | Da |
| `/ai-help` | AIHelpWrapper | Da |

### 10.5 Frontend TODO Lista

- [ ] Implementirati Redux akciju za profil update
- [ ] Implementirati Redux akciju za password change
- [ ] Refaktorisati Register stranicu
- [ ] Konsolidirati API klijente (ukloniti axios duplicat)
- [ ] Dodati i18n podršku
- [ ] Implementirati Google OAuth
- [ ] Dodati skeleton loading states
- [ ] Implementirati TODO funkcionalnost
- [ ] Popraviti mixed language UI

---

## 11. BACKEND DETALJNA ANALIZA

### 11.1 Struktura Projekta

```
backend/
├── .docker/
│   ├── nginx/                 # Nginx konfiguracija
│   ├── php/                   # PHP-FPM Dockerfile
│   ├── postgres/              # PostgreSQL config
│   └── redis/                 # Redis config
├── src/
│   ├── app/
│   │   ├── Console/Commands/  # Artisan komande
│   │   ├── Http/
│   │   │   ├── Controllers/   # 11 kontrolera
│   │   │   ├── Middleware/
│   │   │   └── Resources/     # 8 API resursa
│   │   ├── Jobs/              # 3 queue joba
│   │   ├── Models/            # 10 Eloquent modela
│   │   ├── Providers/         # 5 service providera
│   │   ├── Services/
│   │   │   ├── AI/            # 34 AI fajla
│   │   │   ├── Messaging/     # 5 servisa
│   │   │   ├── Orchestration/ # 1 servis
│   │   │   └── DTOs/          # Data transfer objekti
│   │   └── Interfaces/
│   ├── config/                # 16 config fajlova
│   ├── database/
│   │   └── migrations/        # 11 migracija
│   ├── routes/
│   │   └── api.php            # API rute
│   ├── storage/
│   └── tests/                 # 14 test fajlova
├── docker-compose.yml
├── Makefile
└── README.md
```

### 11.2 Database Modeli

| Model | Tabela | Opis |
|-------|--------|------|
| User | users | Korisnici sistema |
| UserType | user_types | Tipovi korisnika |
| MessagingChannel | messaging_channels | Email kanali (Gmail) |
| MessageThread | message_threads | Email thread-ovi |
| MessagingMessage | messaging_messages | Pojedinačne poruke |
| MessagingAttachment | messaging_attachments | Prilozi |
| MessagingHeader | messaging_headers | Email headers |
| MessagingLabel | messaging_labels | Gmail labele |
| MessagingProcessingJob | messaging_processing_jobs | Job tracking |
| MessagingSyncLog | messaging_sync_logs | Sync historija |

### 11.3 AI Modeli (Groq Adapteri)

| Model | Daily Limit | Max Tokens |
|-------|-------------|------------|
| Llama 3.1 8B Instant | 14,400 | 8,000 |
| Llama 3.3 70B Versatile | 6,000 | 32,000 |
| Llama 4 Maverick | 8,000 | 16,000 |
| Llama 4 Scout | 8,000 | 16,000 |
| Qwen 3 32B | 6,000 | 16,000 |
| Kimi K2 Instruct | 6,000 | 16,000 |
| GPT-OSS 20B | 10,000 | 8,000 |
| GPT-OSS 120B | 4,000 | 32,000 |
| + 12 drugih modela | ... | ... |

### 11.4 API Rute

```php
// Authentication
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('profile', [AuthController::class, 'profile'])->middleware('auth:api');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
});

// Email (public - development)
Route::get('email/messages', [EmailController::class, 'index']);
Route::get('email/messages/v5', [EmailControllerV5::class, 'index']);

// Sync Orchestrator
Route::prefix('sync')->group(function () {
    Route::post('mail', [SyncOrchestratorController::class, 'syncMail']);
    Route::post('ai', [SyncOrchestratorController::class, 'syncAi']);
    Route::post('ai/{id}', [SyncOrchestratorController::class, 'syncAiById']);
    Route::get('status', [SyncOrchestratorController::class, 'status']);
    Route::post('cancel', [SyncOrchestratorController::class, 'cancel']);
});

// Webhook
Route::post('email/respond', [EmailResponseController::class, 'respond']);
```

### 11.5 Docker Servisi

| Servis | Port | Status |
|--------|------|--------|
| backend_app (PHP-FPM) | - | ✅ Aktivan |
| backend_nginx | 9001, 9444 | ✅ Aktivan |
| backend_db (MySQL) | 3306 | ✅ Aktivan |
| backend_redis | 6379 | ✅ Aktivan |
| backend_migrations | - | ✅ One-time |
| backend_scheduler | - | ⚠️ Komentarisan |
| backend_queue | - | ⚠️ Komentarisan |

### 11.6 Backend TODO Lista

- [ ] Popraviti BaseController namespace
- [ ] Dodati missing imports u AuthController
- [ ] Kreirati .env.example
- [ ] Omogućiti Queue Worker container
- [ ] Omogućiti Task Scheduler container
- [ ] Kreirati EmailAction model
- [ ] Kreirati UserGoal model
- [ ] Kreirati EmailCategory model
- [ ] Dodati Health Check endpoint
- [ ] Registrovati UserProfile rute
- [ ] Ukloniti hardkodirane kredencijale
- [ ] Poboljšati logging u ModelRouterService

---

## APPENDIX A: Potrebne Environment Varijable

```bash
# Application
APP_NAME="AI Hub"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:9001

# Frontend
FRONTEND_URL=http://localhost:3000

# Database
DB_CONNECTION=mysql
DB_HOST=backend_db
DB_PORT=3306
DB_DATABASE=backend_laravel
DB_USERNAME=backend_admin
DB_PASSWORD=

# Redis
REDIS_HOST=backend_redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache & Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=database

# JWT
JWT_SECRET=
JWT_ALGORITHM=HS256
JWT_TTL=60

# AI Services
AI_ENABLED=true
GROQ_API_KEY=
OPENAI_API_KEY=

# Mail (optional)
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls

# CORS
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

---

## APPENDIX B: Komande za Pokretanje

```bash
# Backend
cd backend
docker-compose up -d
docker-compose exec backend_app php artisan migrate
docker-compose exec backend_app php artisan jwt:secret

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev

# Testiranje
# Backend
docker-compose exec backend_app php artisan test

# Frontend
npm run test
```

---

## APPENDIX C: Kontakt i Resursi

- **Dokumentacija projekta:** `/README.md`
- **SRS Dokument:** `/README.md` (potpun)
- **API Dokumentacija:** `/backend/docs/`
- **Frontend Docs:** `/frontend/docs/`

---

*Izvještaj generisan: 21. novembar 2025*
*Analizirao: Claude Code*