# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## AI Automation Productivity Hub

**Dokument Verzija:** 1.0
**Datum:** Novembar 2025
**Standard:** IEEE 830-1998
**Status:** Production Ready (Gmail Sync), AI Integration u toku

---

## ISTORIJA REVIZIJA

| Verzija | Datum | Autor | Opis Izmjena |
|---------|-------|-------|--------------|
| 1.0 | Novembar 2025 | AI Automation Team | Inicijalna verzija dokumenta |

---

## SADRŽAJ

1. [Uvod](#1-uvod)
   - 1.1 [Svrha](#11-svrha)
   - 1.2 [Opseg](#12-opseg)
   - 1.3 [Definicije, Akronimi i Skraćenice](#13-definicije-akronimi-i-skraćenice)
   - 1.4 [Reference](#14-reference)
   - 1.5 [Pregled Dokumenta](#15-pregled-dokumenta)
2. [Opšti Opis](#2-opšti-opis)
   - 2.1 [Perspektiva Proizvoda](#21-perspektiva-proizvoda)
   - 2.2 [Funkcije Proizvoda](#22-funkcije-proizvoda)
   - 2.3 [Karakteristike Korisnika](#23-karakteristike-korisnika)
   - 2.4 [Ograničenja](#24-ograničenja)
   - 2.5 [Pretpostavke i Zavisnosti](#25-pretpostavke-i-zavisnosti)
3. [Specifični Zahtjevi](#3-specifični-zahtjevi)
   - 3.1 [Zahtjevi Eksternih Interfejsa](#31-zahtjevi-eksternih-interfejsa)
   - 3.2 [Funkcionalni Zahtjevi](#32-funkcionalni-zahtjevi)
   - 3.3 [Nefunkcionalni Zahtjevi](#33-nefunkcionalni-zahtjevi)
4. [Zahtjevi Korisničkog Interfejsa](#4-zahtjevi-korisničkog-interfejsa)
5. [Zahtjevi Baze Podataka](#5-zahtjevi-baze-podataka)
6. [AI Servisi - Specifikacije](#6-ai-servisi---specifikacije)
7. [Sigurnosni Zahtjevi](#7-sigurnosni-zahtjevi)
8. [Appendix](#8-appendix)

---

## 1. UVOD

### 1.1 Svrha

Ovaj dokument specificira softverske zahtjeve za **AI Automation Productivity Hub** - inteligentnu platformu za automatizaciju poslovnih procesa. Dokument je namijenjen:

- **Razvojnom timu** - kao vodič za implementaciju
- **QA timu** - kao osnova za testiranje
- **Menadžmentu projekta** - za praćenje napretka
- **Klijentima** - za razumijevanje funkcionalnosti sistema

### 1.2 Opseg

**AI Automation Productivity Hub** je web-bazirana aplikacija koja transformiše način na koji profesionalci upravljaju svojom email komunikacijom, vremenom i projektima korištenjem naprednih AI tehnologija.

**Glavne mogućnosti sistema:**
- Automatska analiza email komunikacije sa 8 specijalizovanih AI servisa
- Personalizovani dnevni izvještaji sa konkretnim akcijama i preporukama
- Inteligentna klasifikacija poruka prema prioritetu i poslovnoj vrijednosti
- Proaktivni sistem eskalacije za kritične zadatke
- Multi-kanal podrška: Email, Viber, WhatsApp, Telegram, društvene mreže
- Goal Management System za personalizovane preporuke

**Predviđeni benefiti:**
- Ušteda 15-20 sati nedeljno na organizaciji i planiranju
- Sprečavanje propuštanja važnih poslovnih prilika
- ROI od 200-600%

### 1.3 Definicije, Akronimi i Skraćenice

| Termin | Definicija |
|--------|------------|
| **AI** | Artificial Intelligence - Umjetna inteligencija |
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token - standard za autentifikaciju |
| **OAuth** | Open Authorization - protokol za autorizaciju |
| **SRS** | Software Requirements Specification |
| **CRUD** | Create, Read, Update, Delete operacije |
| **NLP** | Natural Language Processing - obrada prirodnog jezika |
| **SLA** | Service Level Agreement |
| **ROI** | Return on Investment |
| **UI/UX** | User Interface / User Experience |
| **WCAG** | Web Content Accessibility Guidelines |
| **REST** | Representational State Transfer |
| **Thread** | Konverzacijski niz email poruka |
| **Digest** | Sumarni izvještaj |
| **Escalation** | Eskalacija - automatsko podizanje prioriteta |

### 1.4 Reference

| Dokument | Opis |
|----------|------|
| IEEE 830-1998 | Standard za SRS dokumente |
| PROJECT_DOCUMENTATION.md | Kompletna projektna dokumentacija |
| API_ROUTES.md | Dokumentacija API endpoint-a |
| ARCHITECTURE_DIAGRAM.txt | Dijagram arhitekture sistema |

### 1.5 Pregled Dokumenta

- **Sekcija 2** opisuje opšte karakteristike sistema, korisnike i ograničenja
- **Sekcija 3** definiše specifične funkcionalne i nefunkcionalne zahtjeve
- **Sekcija 4** specificira zahtjeve korisničkog interfejsa
- **Sekcija 5** opisuje zahtjeve baze podataka
- **Sekcija 6** detaljno opisuje 8 AI servisa
- **Sekcija 7** definiše sigurnosne zahtjeve
- **Sekcija 8** sadrži dodatne informacije i dijagrame

---

## 2. OPŠTI OPIS

### 2.1 Perspektiva Proizvoda

AI Automation Productivity Hub je samostalna web aplikacija koja se integriše sa postojećim komunikacijskim platformama (Gmail, Outlook, Slack, itd.). Sistem koristi mikroservisnu arhitekturu sa sljedećim slojevima:

```
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                             │
│  React 18/19 + TypeScript + Redux Toolkit + Shadcn/ui           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY                                │
│  Laravel 12 (PHP 8.3) + JWT Authentication + RESTful API        │
└─────────────────────────────────────────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│   MESSAGING LAYER   │ │    AI LAYER     │ │    DATA LAYER       │
│  Gmail, Slack,      │ │  8 AI Servisa   │ │  MySQL 8.0          │
│  Teams Adapteri     │ │  OpenAI, Claude │ │  Redis Cache        │
└─────────────────────┘ └─────────────────┘ └─────────────────────┘
```

**Sistemske zavisnosti:**
- Gmail API (Google Apps Script + OAuth)
- OpenAI API (GPT-4-turbo, GPT-3.5-turbo)
- Anthropic API (Claude-3.5-Sonnet, Claude-3-Haiku)
- Google Gemini API
- Groq API (Llama, Mixtral)

### 2.2 Funkcije Proizvoda

#### 2.2.1 Communication Hub (All-in-One)
- Integracija sa Gmail serverima preko OAuth
- Klasifikacija emailova po relevantnosti i urgentnosti
- Ekstrakcija ključnih informacija korištenjem NLP
- Formatiranje insights-a u konzistentne izvještaje
- Sigurna isporuka samo autorizovanim korisnicima

#### 2.2.2 Intelligent Time Management
- Analiza korisničkog konteksta za scheduling
- Proaktivne preporuke za raspored
- Adaptacija na korisničke obrasce ponašanja
- Integracija sa postojećim kalendarima
- Optimizacija alokacije vremena na osnovu prioriteta

#### 2.2.3 Smart Project Management
- Integracija sa project management platformama
- Historijske analitike zadataka
- Inteligentni progress izvještaji
- Predviđanje rokova završetka projekata
- Identifikacija rizika i bottleneck-a

#### 2.2.4 AI-Powered Analytics
- Kreiranje sadržaja na osnovu business intelligence
- Održavanje brand konzistentnosti
- Analiza engagement metrika
- Adaptacija strategije na osnovu performansi

#### 2.2.5 Follow-Up Recommendations Engine
- Analiza komunikacijskih obrazaca
- Personalizovane follow-up preporuke
- Prioritizacija prema poslovnom uticaju
- Praćenje završetka i efektivnosti
- Učenje iz korisničkog feedback-a

### 2.3 Karakteristike Korisnika

#### 2.3.1 Primarni Korisnici

| Tip Korisnika | Opis | Prioritet |
|---------------|------|-----------|
| **CEO/Executives** | Strateški dashboard, KPI-evi, team oversight | Visok |
| **Project Managers** | Project tracking, resource management | Visok |
| **Sales Professionals** | Praćenje lead-ova i follow-up-a | Visok |
| **Consultants/Freelancers** | Multi-client management | Srednji |
| **HR Directors** | Sensitive employee communications | Srednji |

#### 2.3.2 Korisničke Persone

**Persona 1: Marko - CEO Male IT Firme**
- Starost: 38 godina
- Firma: 12 zaposlenih
- Email volume: 80-100 dnevno
- Bolna tačka: Propušta poslovne prilike zbog email overload-a
- Cilj: Povećati revenue 30% kroz bolju organizaciju

**Persona 2: Ana - Marketing Manager**
- Starost: 32 godine
- Tim: 5 ljudi
- Email volume: 150+ dnevno
- Bolna tačka: Koordinacija kampanja kroz email
- Cilj: Bolja team kolaboracija

**Persona 3: Stefan - Freelance Konsultant**
- Starost: 29 godina
- Klijenti: 8-10 concurrent
- Email volume: 60-80 dnevno
- Bolna tačka: Juggling više projekata
- Cilj: Ne propustiti deadline, održati klijente srećnim

#### 2.3.3 Korisničke Uloge u Sistemu

| Uloga | Pristup | Mogućnosti |
|-------|---------|------------|
| **Executive** | Full | Strateški dashboard, KPI-evi, team oversight |
| **Project Manager** | Extended | Project tracking, resource management |
| **Team Member** | Standard | Task execution, collaboration |
| **Admin** | System | Konfiguracija, user management |

### 2.4 Ograničenja

#### 2.4.1 Regulatorna Ograničenja
- GDPR compliance obavezan za EU korisnike
- Podaci moraju biti enkriptovani u transit i at rest
- Pravo na brisanje podataka na zahtjev korisnika

#### 2.4.2 Hardverska Ograničenja
- Minimalni server requirements: 4 CPU, 8GB RAM
- Preporučeno: 8 CPU, 16GB RAM za produkciju
- Storage: Minimum 100GB SSD

#### 2.4.3 Softverska Ograničenja
- PHP 8.3+
- Node.js 18+
- MySQL 8.0+
- Redis 7+

#### 2.4.4 Ograničenja Eksternih Servisa
- Gmail API rate limits: 250 quota units per user per second
- OpenAI API rate limits: Zavisi od tier-a
- Token limits po requestu: 128K (GPT-4-turbo)

### 2.5 Pretpostavke i Zavisnosti

#### 2.5.1 Pretpostavke
- Korisnici imaju stabilnu internet konekciju
- Korisnici posjeduju Gmail nalog ili kompatibilan email provajder
- Korisnici razumiju osnove email komunikacije
- Browser podržava JavaScript i moderne web standarde

#### 2.5.2 Zavisnosti
- Dostupnost Google OAuth servisa
- Dostupnost AI provider API-ja (OpenAI, Anthropic, Groq)
- Stabilnost MySQL i Redis servisa
- DNS i SSL certifikati

---

## 3. SPECIFIČNI ZAHTJEVI

### 3.1 Zahtjevi Eksternih Interfejsa

#### 3.1.1 Korisnički Interfejsi

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| UI-001 | Sistem mora podržavati responsive dizajn za desktop, tablet i mobile uređaje | Kritičan |
| UI-002 | Sistem mora podržavati Dark i Light mode sa automatskim prepoznavanjem sistemskih postavki | Visok |
| UI-003 | Svi interaktivni elementi moraju biti minimum 44x44px za touch uređaje | Visok |
| UI-004 | Kontrast ratio mora biti minimum 4.5:1 (WCAG 2.1 AA) | Visok |
| UI-005 | Sistem mora podržavati keyboard navigaciju kroz cijelu aplikaciju | Srednji |
| UI-006 | Sve animacije moraju biti 60fps | Srednji |
| UI-007 | Stranica se mora učitati za manje od 2 sekunde | Kritičan |

#### 3.1.2 Hardverski Interfejsi

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| HW-001 | Sistem mora raditi na standardnim web serverima (Linux, nginx/Apache) | Kritičan |
| HW-002 | Sistem mora podržavati horizontalno skaliranje | Visok |
| HW-003 | Sistem mora podržavati Docker containerization | Visok |

#### 3.1.3 Softverski Interfejsi

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| SW-001 | Integracija sa Gmail API preko Google Apps Script + OAuth 2.0 | Kritičan |
| SW-002 | Integracija sa OpenAI API (GPT-4-turbo, GPT-3.5-turbo) | Kritičan |
| SW-003 | Integracija sa Anthropic API (Claude-3.5-Sonnet, Claude-3-Haiku) | Visok |
| SW-004 | Integracija sa Groq API (Llama-3.1-70B, Mixtral-8x7B) | Srednji |
| SW-005 | Integracija sa Google Calendar API | Srednji |
| SW-006 | Integracija sa Slack API | Nizak |
| SW-007 | Integracija sa Microsoft Teams API | Nizak |

#### 3.1.4 Komunikacijski Interfejsi

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| COM-001 | Sva komunikacija mora koristiti HTTPS (TLS 1.3) | Kritičan |
| COM-002 | API mora podržavati RESTful konvencije | Kritičan |
| COM-003 | API mora vratiti JSON format odgovora | Kritičan |
| COM-004 | WebSocket podrška za real-time updates | Visok |
| COM-005 | CORS podrška za definisane domene | Kritičan |

### 3.2 Funkcionalni Zahtjevi

#### 3.2.1 Autentifikacija i Autorizacija

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| REQ-AUTH-001 | Sistem mora podržavati registraciju korisnika sa email verifikacijom | Kreiranje naloga sa potvrdom email adrese | Kritičan |
| REQ-AUTH-002 | Sistem mora podržavati login sa JWT token autentifikacijom | Sigurno prijavljivanje sa token-based auth | Kritičan |
| REQ-AUTH-003 | Sistem mora podržavati OAuth 2.0 login (Google, Microsoft) | Social login opcije | Visok |
| REQ-AUTH-004 | Sistem mora implementirati refresh token mehanizam | Automatsko obnavljanje sesije | Kritičan |
| REQ-AUTH-005 | Sistem mora podržavati logout sa invalidacijom tokena | Sigurno odjavljivanje | Kritičan |
| REQ-AUTH-006 | Sistem mora podržavati password reset funkcionalnost | Zaboravljena lozinka flow | Visok |
| REQ-AUTH-007 | Sistem mora podržavati two-factor authentication | Dodatni sloj sigurnosti | Srednji |

**API Endpoints:**
```
POST /api/auth/register      - Registracija novog korisnika
POST /api/auth/login         - Login i dobijanje JWT tokena
POST /api/auth/logout        - Logout i invalidacija tokena
POST /api/auth/refresh       - Refresh JWT tokena
GET  /api/auth/me            - Trenutni autentifikovani korisnik
POST /api/auth/forgot-password - Zahtjev za reset lozinke
POST /api/auth/reset-password  - Reset lozinke sa tokenom
```

#### 3.2.2 Email Sync i Management

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| REQ-EMAIL-001 | Sistem mora sinkronizovati emailove sa Gmail serverom | OAuth bazirana sinkronizacija | Kritičan |
| REQ-EMAIL-002 | Sistem mora čuvati emailove u lokalnoj bazi | Perzistencija podataka | Kritičan |
| REQ-EMAIL-003 | Sistem mora podržavati pregled liste emailova sa paginacijom | Efikasno listanje | Kritičan |
| REQ-EMAIL-004 | Sistem mora podržavati pregled pojedinačnog emaila sa svim detaljima | Detaljan prikaz | Kritičan |
| REQ-EMAIL-005 | Sistem mora podržavati označavanje emaila kao pročitan/nepročitan | Status management | Visok |
| REQ-EMAIL-006 | Sistem mora podržavati bulk operacije (mark as read, delete) | Grupne akcije | Visok |
| REQ-EMAIL-007 | Sistem mora podržavati pretragu emailova | Search funkcionalnost | Visok |
| REQ-EMAIL-008 | Sistem mora podržavati filtriranje po prioritetu, statusu, kategoriji | Napredni filteri | Visok |
| REQ-EMAIL-009 | Sistem mora podržavati threading (grupiranje emailova u konverzacije) | Thread prikaz | Visok |

**API Endpoints:**
```
GET  /api/v1/emails              - Lista emailova sa paginacijom
GET  /api/v1/emails/messages     - Lista email poruka
GET  /api/v1/emails/messages/v5  - Lista sa AI analizom
GET  /api/v1/emails/{id}         - Detalji pojedinačnog emaila
PATCH /api/v1/emails/{id}/read   - Označavanje kao pročitan
PATCH /api/v1/emails/{id}/unread - Označavanje kao nepročitan
POST /api/v1/emails/bulk-read    - Bulk označavanje kao pročitan
POST /api/v1/emails/bulk-delete  - Bulk brisanje
```

#### 3.2.3 AI Analiza

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| REQ-AI-001 | Sistem mora analizirati HTML strukturu emaila i ekstraktovati clean text | HTML Structural Analysis | Kritičan |
| REQ-AI-002 | Sistem mora klasifikovati emailove u kategorije | Classification Service | Kritičan |
| REQ-AI-003 | Sistem mora analizirati sentiment i urgentnost | Sentiment Analysis | Kritičan |
| REQ-AI-004 | Sistem mora generisati personalizovane preporuke | Recommendation Engine | Kritičan |
| REQ-AI-005 | Sistem mora ekstraktovati konkretne akcije iz emailova | Action Extraction | Visok |
| REQ-AI-006 | Sistem mora upravljati eskalacijom urgentnih zadataka | Escalation Logic | Visok |
| REQ-AI-007 | Sistem mora pratiti završetak akcija | Completion Tracking | Visok |
| REQ-AI-008 | Sistem mora generisati dnevne i sedmične izvještaje | Summarization Service | Visok |
| REQ-AI-009 | Sistem mora podržavati multi-model validaciju | Validacija sa više AI modela | Srednji |

**API Endpoints:**
```
POST /api/v1/emails/{id}/analyze     - AI analiza pojedinačnog emaila
POST /api/v1/sync/ai                 - Trigger AI analize za sve
POST /api/v1/sync/ai/{id}            - AI analiza za specifičan email
GET  /api/v1/communication/ai-dashboard - AI dashboard podaci
GET  /api/v1/communication/ai-message/{id} - AI analiza poruke
GET  /api/v1/ai/usage                - AI usage statistike
```

#### 3.2.4 Todo/Action Management

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| REQ-TODO-001 | Sistem mora podržavati kreiranje todo stavki | CRUD operacije | Kritičan |
| REQ-TODO-002 | Sistem mora podržavati kreiranje todo-a iz emaila | Email-to-todo konverzija | Visok |
| REQ-TODO-003 | Sistem mora podržavati toggle completion statusa | Označavanje završenih | Kritičan |
| REQ-TODO-004 | Sistem mora podržavati prioritizaciju todo-a | Priority levels | Visok |
| REQ-TODO-005 | Sistem mora podržavati deadline management | Due dates | Visok |

**API Endpoints:**
```
GET    /api/v1/todos           - Lista todo-a
POST   /api/v1/todos           - Kreiranje todo-a
GET    /api/v1/todos/{id}      - Pojedinačni todo
PUT    /api/v1/todos/{id}      - Ažuriranje todo-a
DELETE /api/v1/todos/{id}      - Brisanje todo-a
PATCH  /api/v1/todos/{id}/toggle - Toggle completion
POST   /api/v1/todos/from-email  - Kreiranje iz emaila
```

#### 3.2.5 Sync Orchestration

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| REQ-SYNC-001 | Sistem mora podržavati manuelni trigger sinkronizacije | On-demand sync | Kritičan |
| REQ-SYNC-002 | Sistem mora podržavati scheduled sinkronizaciju | Automatski sync | Visok |
| REQ-SYNC-003 | Sistem mora prikazivati status sinkronizacije | Progress tracking | Visok |
| REQ-SYNC-004 | Sistem mora podržavati cancellation sinkronizacije | Abort operacija | Srednji |

**API Endpoints:**
```
POST /api/v1/sync/mail   - Trigger mail sinkronizacije
POST /api/v1/sync/ai     - Trigger AI analize
GET  /api/v1/sync/status - Trenutni status synca
POST /api/v1/sync/cancel - Cancel sync operacije
```

#### 3.2.6 User Profile Management

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| REQ-USER-001 | Sistem mora podržavati pregled i ažuriranje profila | Profile management | Kritičan |
| REQ-USER-002 | Sistem mora podržavati upload/delete avatara | Avatar management | Srednji |
| REQ-USER-003 | Sistem mora podržavati change password | Promjena lozinke | Kritičan |
| REQ-USER-004 | Sistem mora podržavati AI preference settings | AI konfiguracija | Visok |
| REQ-USER-005 | Sistem mora podržavati goal management | Definisanje korisničkih ciljeva | Visok |

**API Endpoints:**
```
GET    /api/v1/users/me         - Profil sa ulogama/dozvolama
PUT    /api/v1/users/me         - Ažuriranje profila
POST   /api/v1/users/me/avatar  - Upload avatara
DELETE /api/v1/users/me/avatar  - Brisanje avatara
POST   /api/auth/change-password - Promjena lozinke
```

### 3.3 Nefunkcionalni Zahtjevi

#### 3.3.1 Performance

| ID | Zahtjev | Metrika | Prioritet |
|----|---------|---------|-----------|
| NFR-PERF-001 | Response time za standardne operacije | < 3 sekunde | Kritičan |
| NFR-PERF-002 | Page load time | < 2 sekunde | Kritičan |
| NFR-PERF-003 | Concurrent users | Do 1000 po instanci | Visok |
| NFR-PERF-004 | Email processing throughput | Do 10,000 emailova po satu | Visok |
| NFR-PERF-005 | AI processing time po emailu | < 5 sekundi | Visok |
| NFR-PERF-006 | Database query response | < 100ms za jednostavne upite | Visok |
| NFR-PERF-007 | API rate limit | 60 requests/min (standard), 5 req/min (auth) | Kritičan |

#### 3.3.2 Reliability

| ID | Zahtjev | Metrika | Prioritet |
|----|---------|---------|-----------|
| NFR-REL-001 | System uptime | 99.9% | Kritičan |
| NFR-REL-002 | Automatic backup | Dnevni backup | Kritičan |
| NFR-REL-003 | Disaster recovery | RTO < 4 sata, RPO < 1 sat | Visok |
| NFR-REL-004 | Graceful error handling | Sve greške moraju biti logged | Kritičan |
| NFR-REL-005 | Data integrity | Zero data loss toleranca | Kritičan |

#### 3.3.3 Scalability

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| NFR-SCALE-001 | Horizontal scaling | Podrška za load balancing | Visok |
| NFR-SCALE-002 | Database scaling | Read replicas podrška | Srednji |
| NFR-SCALE-003 | Storage scaling | S3-compatible storage podrška | Srednji |
| NFR-SCALE-004 | Multi-tenant architecture | Planirano za enterprise | Nizak |

#### 3.3.4 Usability

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| NFR-USE-001 | Intuitivan interfejs bez potrebe za obukom | Jednostavno korištenje | Kritičan |
| NFR-USE-002 | Multi-language support | Minimum EN, srpski/bosanski | Srednji |
| NFR-USE-003 | WCAG 2.1 AA compliance | Accessibility | Visok |
| NFR-USE-004 | Consistent design | Design system implementacija | Visok |
| NFR-USE-005 | Error messages | User-friendly poruke o greškama | Visok |

#### 3.3.5 Maintainability

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| NFR-MAIN-001 | Code documentation | PHPDoc, JSDoc za sve funkcije | Visok |
| NFR-MAIN-002 | Test coverage | Minimum 80% za kritične module | Visok |
| NFR-MAIN-003 | Logging | Strukturirano logovanje svih operacija | Kritičan |
| NFR-MAIN-004 | Monitoring | Health check endpoints | Kritičan |
| NFR-MAIN-005 | CI/CD pipeline | Automatizovan deployment | Visok |

---

## 4. ZAHTJEVI KORISNIČKOG INTERFEJSA

### 4.1 Design System

#### 4.1.1 Boje

**Primary Palette:**
| Ime | Hex | Upotreba |
|-----|-----|----------|
| Primary Blue | #3B82F6 | Glavni akcent, linkovi |
| Primary Dark | #1E40AF | Hover states |
| Primary Light | #60A5FA | Highlights |
| Success Green | #10B981 | Success states |
| Warning Yellow | #F59E0B | Warning states |
| Error Red | #EF4444 | Error states |

**Light Mode:**
| Ime | Hex | Upotreba |
|-----|-----|----------|
| Background | #FFFFFF | Pozadina |
| Surface | #F9FAFB | Kartice |
| Text Primary | #111827 | Glavni tekst |
| Text Secondary | #6B7280 | Sekundarni tekst |

**Dark Mode:**
| Ime | Hex | Upotreba |
|-----|-----|----------|
| Background | #0A0B0D | Pozadina |
| Surface | #1A1B1F | Kartice |
| Text Primary | #E5E7EB | Glavni tekst |
| Text Secondary | #9CA3AF | Sekundarni tekst |
| Borders | #27272A | Granice |

#### 4.1.2 Tipografija

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Inter | 600-800 | 32px/40px |
| H2 | Inter | 600-800 | 24px/32px |
| H3 | Inter | 600-800 | 20px/28px |
| Body | Inter | 400-500 | 16px/24px |
| Small | Inter | 400-500 | 14px/20px |
| Code | JetBrains Mono | 400 | 14px/20px |

#### 4.1.3 Spacing System

| Ime | Vrijednost | Upotreba |
|-----|------------|----------|
| xs | 4px | Minimum padding |
| sm | 8px | Tight spacing |
| md | 16px | Standard spacing |
| lg | 24px | Section spacing |
| xl | 32px | Large sections |
| 2xl | 48px | Page margins |
| 3xl | 64px | Hero sections |

#### 4.1.4 Border Radius

| Tip | Vrijednost | Upotreba |
|-----|------------|----------|
| Small | 4px | Buttons, inputs |
| Medium | 8px | Cards, modals |
| Large | 12px | Containers |
| Round | 9999px | Avatars, pills |

### 4.2 Ekrani i Komponente

#### 4.2.1 Login Screen

**Elementi:**
- Centrirana forma na sredini ekrana
- Gradijent pozadina (plava → ljubičasta)
- Logo aplikacije sa animiranim AI pulsom
- Email input field
- Password input field (sa toggle visibility)
- "Remember me" checkbox
- Login button (primary)
- OAuth buttons: "Sign in with Google", "Sign in with Microsoft"
- "Forgot Password" link

**Validacija:**
- Real-time validacija (crveni border za greške)
- Loading spinner prilikom prijavljivanja
- Error toast za neuspjelu prijavu
- Smooth tranzicija prema dashboard-u nakon uspješne prijave

#### 4.2.2 Dashboard

**Layout (Desktop):**
```
┌────────────────────────────────────────────────────────────────┐
│ Navigation Bar                                                  │
├────────────────────────────────────────────────────────────────┤
│ Welcome Section / Header                                        │
├──────────────┬─────────────────────────────────────────────────┤
│   Sidebar    │   Main Content Area                              │
│   (Stats)    │   - Priority Inbox                               │
│              │   - Today's Actions                              │
│              │   - AI Insights                                  │
└──────────────┴─────────────────────────────────────────────────┘
```

**Komponente:**
1. **Welcome Widget**
   - Personalizirani pozdrav sa imenom korisnika
   - Trenutno vrijeme i datum
   - AI sumarizacija dana
   - Productivity progress bar

2. **Priority Inbox**
   - Email kartice sa preview-om
   - Priority indikatori (crvena/žuta/zelena)
   - AI summary (max 60 karaktera)
   - Quick actions (Reply, Archive, Snooze)

3. **Today's Actions Panel**
   - Check-box lista akcija
   - Time estimate za svaku akciju
   - Drag & drop reorganizacija
   - Progress bar

4. **AI Insights Card**
   - Bullet points sa insights
   - Sparkline grafikoni za trendove
   - KPI promjene

#### 4.2.3 Email Detail View

**Layout:**
- Modal ili side panel prikaz
- Header sa back button i close
- Email metadata (from, to, date)
- AI Analysis sekcija (collapsible)
- Email content
- Action buttons (Reply, Forward, Archive)

**AI Analysis sekcija prikazuje:**
- Tip komunikacije
- Prioritet (1-10)
- Sentiment
- Potencijalna vrijednost
- Preporučene akcije (1-3)

#### 4.2.4 Settings Screen

**Sekcije:**
1. **Profile Settings**
   - Avatar upload
   - Ime i prezime
   - Email (read-only)
   - Timezone

2. **AI Preferences**
   - Response Style (Formal/Balanced/Casual)
   - AI Aggressiveness slider
   - Notification preferences
   - Email categories to prioritize

3. **Goal Management**
   - Lista aktivnih ciljeva
   - Checkbox za prioritizaciju
   - Dodavanje novih ciljeva

4. **Connected Services**
   - Status connected servisa
   - Connect/Disconnect buttons

### 4.3 Responsive Breakpoints

| Ime | Range | Layout |
|-----|-------|--------|
| Mobile | 320px - 768px | Single column, hamburger menu |
| Tablet | 768px - 1024px | 2 column grid |
| Desktop | 1024px - 1920px | 3 column sa sidebar |
| Wide | 1920px+ | Max width container (1440px) |

### 4.4 Animacije i Tranzicije

**Micro-interactions:**
- Button hover: Scale 1.05x, shadow increase, 200ms ease-out
- Card hover: Translate Y -2px, shadow increase
- Success: Checkmark draw animation, subtle confetti

**Page Transitions:**
- Fade out: 150ms
- Fade in: 150ms
- Slide from right on forward navigation
- Slide from left on back navigation

**Modal Open:**
- Background blur and darken
- Modal scale from 0.95 to 1
- Duration: 300ms spring animation

### 4.5 Notifikacije

**Types:**
| Tip | Boja | Duration |
|-----|------|----------|
| Success | Zelena | 3 sekunde |
| Info | Plava | 5 sekundi |
| Warning | Žuta | 5 sekundi |
| Error | Crvena | Manual dismiss |

**Push Notifications Format:**
```
🔴 URGENT: New €50,000 opportunity detected
CEO of TechCorp wants to discuss automation
[View] [Snooze]
```

---

## 5. ZAHTJEVI BAZE PODATAKA

### 5.1 Database Schema

#### 5.1.1 Core Tables

**users**
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| name | VARCHAR(255) | Ime korisnika |
| email | VARCHAR(255) | Email (unique) |
| password | VARCHAR(255) | Hashed password |
| email_verified_at | TIMESTAMP | Datum verifikacije |
| avatar_path | VARCHAR(255) | Putanja do avatara |
| created_at | TIMESTAMP | Datum kreiranja |
| updated_at | TIMESTAMP | Datum ažuriranja |

**messaging_channels**
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| user_id | BIGINT UNSIGNED | Foreign key → users |
| channel_type | ENUM | Tip kanala (gmail, slack, etc.) |
| channel_name | VARCHAR(255) | Ime kanala |
| credentials | JSON | Enkriptovani credentials |
| is_active | BOOLEAN | Status kanala |
| last_sync_at | TIMESTAMP | Posljednja sinkronizacija |

**message_threads**
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| channel_id | BIGINT UNSIGNED | Foreign key → channels |
| external_id | VARCHAR(255) | Gmail thread ID |
| subject | VARCHAR(255) | Subject thread-a |
| message_count | INT | Broj poruka u thread-u |
| last_message_at | TIMESTAMP | Zadnja poruka |
| ai_summary | TEXT | AI generisan summary |
| ai_priority | ENUM | AI određen prioritet |

**messaging_messages**
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| thread_id | BIGINT UNSIGNED | Foreign key → threads |
| message_id | VARCHAR(255) | Gmail message ID (unique) |
| message_number | INT | Redni broj u thread-u |
| sender | JSON | Sender podaci |
| recipients | JSON | To, CC, BCC |
| content_text | LONGTEXT | Plain text sadržaj |
| content_html | LONGTEXT | HTML sadržaj |
| content_snippet | VARCHAR(500) | Preview |
| message_timestamp | TIMESTAMP | Originalno vrijeme |
| received_date | TIMESTAMP | Vrijeme prijema |
| is_draft | BOOLEAN | Draft status |
| is_unread | BOOLEAN | Unread status |
| is_starred | BOOLEAN | Starred status |
| is_in_trash | BOOLEAN | Trash status |
| is_in_inbox | BOOLEAN | Inbox status |
| is_spam | BOOLEAN | Spam status |
| priority | ENUM | low/normal/high |
| ai_analysis | JSON | AI analiza rezultat |
| ai_status | ENUM | pending/processing/completed/failed |
| ai_processed_at | TIMESTAMP | Vrijeme AI obrade |

**messaging_attachments**
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| message_id | BIGINT UNSIGNED | Foreign key → messages |
| filename | VARCHAR(255) | Ime fajla |
| mime_type | VARCHAR(100) | MIME tip |
| size | INT | Veličina u bajtovima |
| storage_path | VARCHAR(500) | Putanja do storage |
| attachment_id | VARCHAR(255) | Gmail attachment ID |

**messaging_labels**
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| message_id | BIGINT UNSIGNED | Foreign key → messages |
| label_id | VARCHAR(100) | Gmail label ID |
| label_name | VARCHAR(255) | Ime labele |
| label_type | ENUM | system/user |

**messaging_headers**
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| message_id | BIGINT UNSIGNED | Foreign key → messages |
| header_name | VARCHAR(255) | Header ime |
| header_value | TEXT | Header vrijednost |

**messaging_sync_logs**
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| channel_id | BIGINT UNSIGNED | Foreign key → channels |
| sync_type | ENUM | manual/scheduled |
| status | ENUM | started/completed/failed |
| messages_synced | INT | Broj sinkronizovanih |
| started_at | TIMESTAMP | Početak synca |
| completed_at | TIMESTAMP | Kraj synca |
| error_message | TEXT | Greška ako postoji |

**user_goals** (planirano)
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| user_id | BIGINT UNSIGNED | Foreign key → users |
| goal_type | ENUM | revenue/networking/productivity |
| goal_description | TEXT | Opis cilja |
| is_active | BOOLEAN | Aktivnost cilja |
| priority | INT | Prioritet (1-10) |

**ai_actions** (planirano)
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| message_id | BIGINT UNSIGNED | Foreign key → messages |
| action_type | ENUM | respond/schedule/research/todo |
| description | TEXT | Opis akcije |
| deadline | TIMESTAMP | Rok |
| status | ENUM | pending/in_progress/completed/overdue |
| completed_at | TIMESTAMP | Vrijeme završetka |

**todos**
| Kolona | Tip | Opis |
|--------|-----|------|
| id | BIGINT UNSIGNED | Primary key |
| user_id | BIGINT UNSIGNED | Foreign key → users |
| message_id | BIGINT UNSIGNED | Optional FK → messages |
| title | VARCHAR(255) | Naslov |
| description | TEXT | Opis |
| due_date | DATE | Rok |
| priority | ENUM | low/medium/high |
| is_completed | BOOLEAN | Status |
| completed_at | TIMESTAMP | Vrijeme završetka |

### 5.2 Indeksi

**Performance indeksi:**
```sql
-- messaging_messages
INDEX idx_thread_id (thread_id)
INDEX idx_message_timestamp (message_timestamp)
INDEX idx_is_unread (is_unread)
INDEX idx_ai_status (ai_status)
UNIQUE INDEX idx_message_id (message_id)

-- message_threads
INDEX idx_channel_id (channel_id)
INDEX idx_last_message_at (last_message_at)
UNIQUE INDEX idx_external_id (external_id)

-- messaging_labels
INDEX idx_message_id (message_id)
INDEX idx_label_id (label_id)
```

### 5.3 Data Retention

| Tip Podataka | Retention Period | Akcija |
|--------------|------------------|--------|
| Email content | 1 godina | Archive to S3 |
| AI analysis | 1 godina | Archive to S3 |
| Sync logs | 90 dana | Delete |
| User activity logs | 1 godina | Archive |
| Deleted emails | 30 dana | Permanent delete |

---

## 6. AI SERVISI - SPECIFIKACIJE

### 6.1 Master Orchestrator

**Uloga:** Centralni koordinator koji upravlja sa 8 specijalizovanih AI servisa.

**Flow:**
```
Email Input → Master Orchestrator
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
Servis 1-3      Servis 4-6      Servis 7-8
(Parallel)      (Sequential)    (Sequential)
    │               │               │
    └───────────────┼───────────────┘
                    ▼
           Aggregated Result
```

### 6.2 Servis 1: HTML Structural Analysis

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Optimizacija i strukturiranje HTML sadržaja |
| **Input** | Raw HTML email content |
| **Output** | Cleaned text, structure analysis, urgency markers |
| **Performance** | 50-100ms po emailu |
| **Token Reduction** | 60-80% |

**Output Format:**
```json
{
  "cleaned_text": "Optimizovan tekst bez HTML šuma",
  "structure": {
    "headings": ["H1: Main Title", "H2: Subtitle"],
    "key_phrases": ["BOLD: Important phrase"],
    "links": [{"text": "CTA", "url": "...", "importance": "high"}]
  },
  "urgency_markers": ["URGENT", "DEADLINE: Friday"],
  "is_newsletter": false
}
```

**Newsletter Detection Criteria:**
- Unsubscribe link prisutan
- Bulk email headers detektovani
- Image count > 5
- Generic greeting ("Hi there", "Dear subscriber")

### 6.3 Servis 2: Classification Service

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Kategorizacija emaila prema sadržaju |
| **Input** | Cleaned text, metadata |
| **Output** | Primary category, subcategory, confidence |
| **Performance** | 200-300ms po emailu |
| **Accuracy** | 92%+ |

**Kategorije:**
| Kategorija | Opis | Primjeri |
|------------|------|----------|
| automation_opportunity | B2B, consulting, partnership | "Interested in automation services" |
| business_inquiry | Direktni zahtjevi, projekti | "Need a quote for project X" |
| networking | Konferencije, events | "Join our conference" |
| educational | Learning, webinari | "New course available" |
| financial | Računi, plaćanja | "Invoice #123" |
| administrative | Notifikacije | "Your password was changed" |
| marketing | Newsletters, promotions | "Special offer" |
| personal | Lične poruke | General correspondence |

**Classification Logic:**
- Subject line analysis: 30% weight
- Sender domain analysis: 20% weight
- Body keywords: 40% weight
- Contextual analysis: 10% weight

### 6.4 Servis 3: Sentiment Analysis

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Analiza tona, urgentnosti, poslovnog potencijala |
| **Input** | Cleaned text, classification |
| **Output** | Urgency score, tone, business potential |
| **Performance** | 150-250ms po emailu |

**Urgency Scale (1-10):**
| Score | Indikatori |
|-------|------------|
| 9-10 | "URGENT", "ASAP", "today", "deadline tomorrow" |
| 7-8 | "this week", "by Friday", "time-sensitive" |
| 5-6 | "when you can", "at your convenience" |
| 3-4 | "eventually", "in the future" |
| 1-2 | Bez vremenskih indikatora |

**Tone Categories:**
- Professional
- Casual
- Aggressive
- Frustrated
- Enthusiastic
- Neutral

**Business Potential Scoring:**
| Faktor | Points |
|--------|--------|
| Budget mentioned | +2 |
| Timeline mentioned | +2 |
| Specific use case | +2 |
| Decision maker | +2 |
| Referral | +1 |

### 6.5 Servis 4: Recommendation Engine

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Personalizovane, actionable preporuke |
| **Input** | All previous analysis + user goals |
| **Output** | Recommendations, priority level, ROI context |
| **Performance** | 300-500ms po emailu |

**Recommendation Logic:**
```
IF category == "automation_opportunity" AND urgency >= 7:
    → HIGH priority
    → "PRIORITET - Direktna business prilika"

ELSE IF category == "business_inquiry" AND business_potential >= 6:
    → HIGH priority
    → "Potencijalni projekat - zakazati discovery call"

ELSE IF category == "networking" AND urgency <= 5:
    → MEDIUM priority
    → "Networking prilika - odgovoriti kada stignem"

ELSE IF is_newsletter OR category == "marketing":
    → LOW priority
    → "Newsletter/promo - može se ignorisati"
```

### 6.6 Servis 5: Action Extraction

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Kreiranje konkretnih, izvršivih akcija |
| **Input** | Email content, analysis |
| **Output** | Action items sa deadlines |
| **Performance** | 200-400ms po emailu |
| **Max Actions** | 3 po emailu |

**Action Types:**
| Tip | Opis |
|-----|------|
| RESPOND | Email odgovor sa suggested template |
| SCHEDULE | Zakazivanje call/meeting |
| RESEARCH | Istraživanje prije odgovora |
| ADD_TO_TODO | Task za praćenje |
| FOLLOW_UP | Reminder za kasnije |
| ARCHIVE | Nema akcije potrebna |

**Timeline Definitions:**
| Oznaka | Značenje |
|--------|----------|
| hitno | Danas do 15h |
| ova_nedelja | Do petka |
| ovaj_mesec | Sledeća 2-3 nedjelje |
| dugorocno | Nije hitno |
| nema_deadline | Informational |

### 6.7 Servis 6: Escalation Logic

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Upravljanje urgentnim zadacima |
| **Input** | Analysis results, action status |
| **Output** | Escalation triggers, notification channel |

**Immediate Escalation Triggers:**
- Urgency score >= 9 AND business_potential >= 8
- Deadline u subject-u ("URGENT", "ASAP")
- Existing client sa complaint
- Payment related issues

**Delayed Escalation:**
| Prioritet | Delay |
|-----------|-------|
| HIGH | 24h bez odgovora |
| MEDIUM | 3 dana bez odgovora |
| Scheduled call | 24h prije neconfirmovan |

**Escalation Channels:**
- Push notification (immediate)
- SMS (critical business)
- Email reminder (digest)
- Dashboard alert (badge)

### 6.8 Servis 7: Completion Tracking

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Praćenje izvršenja akcija |
| **Input** | Actions, email threads |
| **Output** | Completion status updates |

**Tracking Methods:**
1. **Automatic Detection:**
   - Thread continuation check (sent reply)
   - Confirmation keywords search
   - Calendar event check

2. **Manual Confirmation:**
   - End-of-day checklist
   - One-click completion button
   - Bulk mark as done

**Status States:**
| Status | Ikona | Opis |
|--------|-------|------|
| PENDING | ⚪ | Kreirana, nije izvršena |
| IN_PROGRESS | 🟡 | Započeta |
| COMPLETED | ✅ | Završena |
| OVERDUE | 🔴 | Deadline prošao |
| SNOOZED | ⏸️ | Odložena |

### 6.9 Servis 8: Summarization Service

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Generisanje izvještaja |
| **Input** | All analysis data |
| **Output** | Daily digest, weekly summary, per-email summary |

**Report Types:**

**1. Daily Digest (8:00 AM):**
```
🌅 Good Morning! Here's your email digest for [DATE]

📧 YESTERDAY'S ACTIVITY:
- 47 emails processed
- 12 actions created
- 8 actions completed
- 4 actions overdue

🔴 URGENT (Action Required Today):
1. Client X - Automation inquiry (deadline: 3pm)
   → Respond with discovery call proposal

🟡 IMPORTANT (This Week):
1. Conference invitation - AI Summit
   → Confirm attendance

💰 BUSINESS POTENTIAL:
- 3 hot leads (total: $15K-25K)
```

**2. Weekly Summary:**
- Total emails processed
- Actions completed vs pending
- Business opportunities identified
- ROI estimate

**3. Per-Email Summary:**
- One-liner (max 60 karaktera)
- Key takeaway
- Next action

### 6.10 Multi-Model Validation Matrix

| Servis | Primary Model | Validation Model | Control Model |
|--------|---------------|------------------|---------------|
| HTML Analysis | GPT-4-turbo | Claude-3-Haiku | Llama-3.1-70B |
| Classification | GPT-4-turbo | GPT-3.5-turbo | Mixtral-8x7B |
| Sentiment | Claude-3.5-Sonnet | PaLM-2 | Llama-3.1-70B |
| Recommendations | GPT-4-turbo | Claude-3.5-Sonnet | Qwen-2-72B |

**Confidence Zones:**
| Zone | Threshold | Action |
|------|-----------|--------|
| Green | > 90% | Proceed - svi modeli se slažu |
| Yellow | 80-90% | Warning - potrebna pažnja |
| Red | < 80% | Escalate - ljudska validacija |

---

## 7. SIGURNOSNI ZAHTJEVI

### 7.1 Autentifikacija i Autorizacija

| ID | Zahtjev | Status |
|----|---------|--------|
| SEC-AUTH-001 | JWT token-based authentication | ✅ Implementirano |
| SEC-AUTH-002 | OAuth 2.0 za eksterne integracije | ✅ Implementirano |
| SEC-AUTH-003 | Token expiration (1h access, 7d refresh) | ✅ Implementirano |
| SEC-AUTH-004 | Two-factor authentication | 🔮 Planirano |
| SEC-AUTH-005 | Role-based access control (RBAC) | ✅ Implementirano |

### 7.2 Data Protection

| ID | Zahtjev | Status |
|----|---------|--------|
| SEC-DATA-001 | HTTPS za svu komunikaciju (TLS 1.3) | ✅ Implementirano |
| SEC-DATA-002 | Enkripcija podataka at rest (AES-256) | ✅ Implementirano |
| SEC-DATA-003 | Database transaction safety | ✅ Implementirano |
| SEC-DATA-004 | UTF-8 sanitization | ✅ Implementirano |
| SEC-DATA-005 | Attachment virus scanning | 🔮 Planirano |

### 7.3 API Security

| ID | Zahtjev | Status |
|----|---------|--------|
| SEC-API-001 | Rate limiting (60 req/min standard) | ✅ Implementirano |
| SEC-API-002 | Rate limiting (5 req/min auth) | ✅ Implementirano |
| SEC-API-003 | CORS configuration | ✅ Implementirano |
| SEC-API-004 | Input validation | ✅ Implementirano |
| SEC-API-005 | SQL injection prevention | ✅ Implementirano |
| SEC-API-006 | XSS prevention | ✅ Implementirano |

### 7.4 AI Security

| ID | Zahtjev | Status |
|----|---------|--------|
| SEC-AI-001 | Input sanitization prije AI procesiranja | ✅ Implementirano |
| SEC-AI-002 | Output validation (no sensitive info leak) | ✅ Implementirano |
| SEC-AI-003 | Model monitoring (confidence anomalies) | 🔄 U toku |
| SEC-AI-004 | Cost tracking i limits | ✅ Implementirano |

### 7.5 Compliance

| Standard | Status | Opis |
|----------|--------|------|
| GDPR | 🔄 U toku | Zero data sharing, right to deletion |
| OWASP Top 10 | ✅ Compliant | Security best practices |
| WCAG 2.1 AA | 🔄 U toku | Accessibility compliance |

### 7.6 Audit i Monitoring

| ID | Zahtjev | Status |
|----|---------|--------|
| SEC-AUDIT-001 | Access logging | ✅ Implementirano |
| SEC-AUDIT-002 | API request logging | ✅ Implementirano |
| SEC-AUDIT-003 | Failed login attempt tracking | ✅ Implementirano |
| SEC-AUDIT-004 | Admin action audit trail | 🔮 Planirano |
| SEC-AUDIT-005 | Security incident alerts | 🔮 Planirano |

---

## 8. APPENDIX

### 8.1 Glossary dodatnih termina

| Termin | Definicija |
|--------|------------|
| **Thread** | Grupa povezanih email poruka u konverzaciji |
| **Digest** | Sumarni izvještaj o aktivnostima |
| **Escalation** | Automatsko podizanje prioriteta zadatka |
| **Snooze** | Odlaganje email/task-a za kasnije |
| **Pipeline** | Potencijalne poslovne prilike u praćenju |

### 8.2 Use Case Dijagrami

**UC-001: Email Trijaža**
```
Actor: User
Precondition: User je ulogovan, emails su sinkronizovani

1. User otvara Dashboard
2. System prikazuje Priority Inbox sa AI analizom
3. User pregleda email sa highest priority
4. System prikazuje AI suggestions
5. User izvršava akciju (Reply/Archive/Snooze)
6. System ažurira status

Postcondition: Email je procesuiran, action tracked
```

**UC-002: AI Analysis**
```
Actor: System (automated)
Precondition: Novi email je sinkronizovan

1. System trigger-uje AI analysis
2. HTML Analysis Service čisti content
3. Classification Service kategorizuje email
4. Sentiment Service analizira ton
5. Recommendation Engine generiše preporuke
6. Action Extraction kreira tasks
7. System čuva rezultate u database

Postcondition: Email ima kompletnu AI analizu
```

### 8.3 Error Codes

| Code | HTTP Status | Opis |
|------|-------------|------|
| AUTH001 | 401 | Invalid credentials |
| AUTH002 | 401 | Token expired |
| AUTH003 | 403 | Insufficient permissions |
| VAL001 | 422 | Validation error |
| SYS001 | 500 | Internal server error |
| SYNC001 | 503 | Sync service unavailable |
| AI001 | 503 | AI service unavailable |
| RATE001 | 429 | Rate limit exceeded |

### 8.4 API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### 8.5 Verzije i Changelog

| Verzija | Datum | Opis |
|---------|-------|------|
| 1.0 | Nov 2025 | Initial SRS release |

### 8.6 Approval

| Uloga | Ime | Potpis | Datum |
|-------|-----|--------|-------|
| Project Manager | | | |
| Technical Lead | | | |
| Product Owner | | | |
| QA Lead | | | |

---

**Kraj Dokumenta**

---

*Ovaj dokument je kreiran u skladu sa IEEE 830-1998 standardom za Software Requirements Specification.*
