# SOFTWARE REQUIREMENTS SPECIFICATION (SRS) v2.0
## AI Automation Productivity Hub

**Verzija dokumenta:** 2.0
**Datum:** Novembar 2025
**Standard:** IEEE 830-1998
**Status:** Production Ready (Gmail Sync), AI Integration u toku

---

## ISTORIJA REVIZIJA

| Verzija | Datum | Autor | Opis Izmjena |
|---------|-------|-------|--------------|
| 1.0 | Novembar 2025 | AI Automation Team | Inicijalna verzija dokumenta |
| 2.0 | Novembar 2025 | AI Automation Team | Unaprijeđena verzija sa detaljnim UI/UX, user stories, i kompletnom tehničkom specifikacijom |

---

## SADRŽAJ

1. [Uvod](#1-uvod)
2. [Opšti Opis](#2-opšti-opis)
3. [Korisničke Persone i Scenariji](#3-korisničke-persone-i-scenariji)
4. [Korisnički Interfejs - Detaljna Specifikacija](#4-korisnički-interfejs---detaljna-specifikacija)
5. [User Journey i Onboarding](#5-user-journey-i-onboarding)
6. [Specifični Zahtjevi](#6-specifični-zahtjevi)
7. [Zahtjevi Baze Podataka](#7-zahtjevi-baze-podataka)
8. [AI Servisi - Specifikacije](#8-ai-servisi---specifikacije)
9. [Sigurnosni Zahtjevi](#9-sigurnosni-zahtjevi)
10. [Tehnička Implementacija](#10-tehnička-implementacija)
11. [Plan Implementacije i ROI](#11-plan-implementacije-i-roi)
12. [Appendix](#12-appendix)

---

## 1. UVOD

### 1.1 Svrha

Ovaj dokument specificira softverske zahtjeve za **AI Automation Productivity Hub** - inteligentnu platformu za automatizaciju poslovnih procesa. Dokument je namijenjen:

- **Razvojnom timu** - kao vodič za implementaciju
- **QA timu** - kao osnova za testiranje
- **Menadžmentu projekta** - za praćenje napretka
- **Klijentima** - za razumijevanje funkcionalnosti sistema
- **Dizajnerima** - za UI/UX specifikacije

### 1.2 Opseg

**AI Automation Productivity Hub** je web-bazirana aplikacija koja transformiše način na koji profesionalci upravljaju svojom email komunikacijom, vremenom i projektima korištenjem naprednih AI tehnologija.

**Glavne mogućnosti sistema:**
- Automatska analiza email komunikacije sa 8 specijalizovanih AI servisa
- Personalizovani dnevni izvještaji sa konkretnim akcijama i preporukama
- Inteligentna klasifikacija poruka prema prioritetu i poslovnoj vrijednosti
- Proaktivni sistem eskalacije za kritične zadatke
- Multi-kanal podrška: Email, Viber, WhatsApp, Telegram, društvene mreže
- Goal Management System za personalizovane preporuke
- Elegantan, responsivan dizajn inspirisan Notion i Linear aplikacijama

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
| **PWA** | Progressive Web App |
| **SSE** | Server-Sent Events |

### 1.4 Reference

| Dokument | Opis |
|----------|------|
| IEEE 830-1998 | Standard za SRS dokumente |
| PROJECT_DOCUMENTATION_ENHANCED.md | Kompletna projektna dokumentacija sa UI/UX |
| USER_STORIES_AND_SCENARIOS.md | Detaljni scenariji korištenja |
| UI_UX_DETAILED_MOCKUPS.md | Vizuelne specifikacije interfejsa |
| USER_ONBOARDING_GUIDE.md | Vodič za onboarding korisnika |
| TECHNICAL_IMPLEMENTATION_GUIDE.md | Tehnička dokumentacija |

---

## 2. OPŠTI OPIS

### 2.1 Perspektiva Proizvoda

AI Automation Productivity Hub je samostalna web aplikacija koja se integriše sa postojećim komunikacijskim platformama. Aplikacija izgleda kao elegantni dashboard sa tamnom/svijetlom temom, gdje na prvi pogled korisnik vidi najvažnije informacije organizovane u kartice i widgete.

**Ključne vizuelne karakteristike:**
- 🎨 **Moderan, minimalistički dizajn** inspirisan Notion-om i Linear-om
- 📱 **Potpuno responsivan** - radi savršeno na desktop, tablet i mobilnim uređajima
- ⚡ **Real-time updates** - sve promjene se vide odmah bez refresh-a
- 🌙 **Dark/Light mode** - automatski prati sistem postavke
- ♿ **Pristupačnost** - WCAG 2.1 AA compliant

**Arhitektura sistema:**

```
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                             │
│  React 19 + TypeScript + Redux Toolkit + Shadcn/ui + Framer     │
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
│                     │ │  Groq (18+)     │ │  Queue Jobs         │
└─────────────────────┘ └─────────────────┘ └─────────────────────┘
```

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
- Real-time ROI tracking

#### 2.2.5 Follow-Up Recommendations Engine
- Analiza komunikacijskih obrazaca
- Personalizovane follow-up preporuke
- Prioritizacija prema poslovnom uticaju
- Praćenje završetka i efektivnosti
- Učenje iz korisničkog feedback-a

### 2.3 Ciljni Korisnici

| Tip Korisnika | Opis | Prioritet |
|---------------|------|-----------|
| **CEO/Executives** | Strateški dashboard, KPI-evi, team oversight | Visok |
| **Project Managers** | Project tracking, resource management | Visok |
| **Sales Professionals** | Praćenje lead-ova i follow-up-a | Visok |
| **Consultants/Freelancers** | Multi-client management | Srednji |
| **Marketing Managers** | Koordinacija kampanja, team collaboration | Srednji |
| **HR Directors** | Sensitive employee communications | Srednji |

---

## 3. KORISNIČKE PERSONE I SCENARIJI

### 3.1 Persona 1: Marko - CEO Male IT Firme

**Profile:**
- Starost: 38 godina
- Firma: 12 zaposlenih
- Email volume: 80-100 dnevno
- Bolna tačka: Propušta poslovne prilike zbog email overload-a
- Cilj: Povećati revenue 30% kroz bolju organizaciju

**Tipičan dan SA aplikacijom:**

**7:45 AM - Jutarnja Kafa**
```
┌────────────────────────────────────────────┐
│                                            │
│   Dobro jutro, Marko! ☀️                  │
│                                            │
│   Dok ste spavali, stiglo je:             │
│   • 3 HITNE poslovne prilike (€35K total) │
│   • 1 zahtjev za meeting (CEO Mondrian)   │
│   • 14 rutinskih emailova (AI sorted)     │
│                                            │
│   🎯 Današnji fokus: Zatvorite TechCorp   │
│   deal prije nego odu na godišnji (petak) │
│                                            │
│   [Počni sa Hitnim] [Pregled Svih]        │
└────────────────────────────────────────────┘
```

**8:00 AM - Hitne Akcije**
- AI priprema draft odgovore sa personalizovanim predlozima
- Automatski research kompanije i pricing suggestions
- Live Call Assistant panel tokom poziva

**5:00 PM - End of Day Review**
```
✅ DANAS POSTIGNUTO:
• Zatvoren TechCorp deal: €12,750
• 2 nova lead-a u pipeline: €20,000
• 23 email odgovora (AI draft pomogao na 18)
• Ušteđeno vrijeme: 2.5 sata
```

### 3.2 Persona 2: Ana - Marketing Manager

**Profile:**
- Starost: 32 godine
- Tim: 5 ljudi
- Email volume: 150+ dnevno
- Bolna tačka: Koordinacija kampanja kroz email
- Cilj: Bolja team kolaboracija

**Ključne funkcije:**
- Team Dashboard sa campaign progress tracking
- Vendor Communication Hub sa AI grupiranjem
- Automated Status Updates za C-level
- Shared inbox views

### 3.3 Persona 3: Stefan - Freelance Konsultant

**Profile:**
- Starost: 29 godina
- Klijenti: 8-10 concurrent
- Email volume: 60-80 dnevno
- Bolna tačka: Juggling više projekata
- Cilj: Ne propustiti deadline, održati klijente srećnim

**Ključne funkcije:**
- Client Priority Matrix
- SLA Tracking po klijentu
- Response time monitoring
- Client handoff summaries

### 3.4 Persona 4: Jelena - HR Director

**Profile:**
- Starost: 45 godina
- Zaposleni: 500+
- Email volume: 200+ dnevno
- Bolna tačka: Sensitive employee communications
- Cilj: Brzi response na employee issues

**Ključne funkcije:**
- Sensitive Content Detection
- Encrypted storage za HR komunikacije
- Legal consultation triggering
- Prioritizacija employee issues

---

## 4. KORISNIČKI INTERFEJS - DETALJNA SPECIFIKACIJA

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

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                    AI HUB LOGO                       │
│                   ╔═══════════╗                      │
│                   ║    🤖     ║                      │
│                   ╚═══════════╝                      │
│                                                      │
│         Dobrodošli u AI Automation Hub               │
│                                                      │
│     ┌────────────────────────────────────┐          │
│     │  Email: [____________________]     │          │
│     │  Password: [____________________]  │          │
│     │  □ Remember me                     │          │
│     │                                    │          │
│     │  [      Login      ]              │          │
│     │                                    │          │
│     │  [Sign in with Google]            │          │
│     │  [Sign in with Microsoft]         │          │
│     │                                    │          │
│     │  Forgot Password?                  │          │
│     └────────────────────────────────────┘          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Elementi:**
- Centrirana forma na sredini ekrana
- Gradijent pozadina (plava → ljubičasta)
- Logo aplikacije sa animiranim AI pulsom
- Email i Password input fields
- "Remember me" checkbox
- OAuth buttons
- "Forgot Password" link

**Validacija:**
- Real-time validacija (crveni border za greške)
- Loading spinner prilikom prijavljivanja
- Error toast za neuspjelu prijavu
- Smooth tranzicija prema dashboard-u

#### 4.2.2 Glavni Dashboard

**Layout (Desktop):**
```
┌────────────────────────────────────────────────────────────────┐
│ 🏠 Dashboard  📧 Inbox  📊 Analytics  🎯 Goals  ⚙️           │
│                                         🔍 ⌘K  🔔3 👤         │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Dobro jutro, Marko! ☀️           [🔍 Search]  [🔔 3] [👤]     │
│  Petak, 21. Novembar 2025 • 8:15 AM                            │
│                                                                  │
├──────────────┬─────────────────────────────────────────────────┤
│              │                                                  │
│   DANAS      │         📧 PRIORITY INBOX                       │
│              │    ┌─────────────────────────────────────┐      │
│ ⚡ 5 Hitnih  │    │ 🔴 URGENT: Ponuda za automatizaciju │      │
│ 📋 12 Akcija │    │ Od: director@company.com           │      │
│ ✅ 8 Završeno│    │ AI: "Visok potencijal - €10,000"   │      │
│              │    │ [Reply] [Schedule] [Archive]        │      │
│   STATISTIKE │    └─────────────────────────────────────┘      │
│              │    ┌─────────────────────────────────────┐      │
│ 📊 47 Emailova│   │ 🟡 Meeting request - AI Conference  │      │
│ 💬 23 Odgovora│   │ Od: conference@aiworld.com         │      │
│ 📈 +15% Prod. │   │ AI: "Networking prilika"           │      │
│              │    └─────────────────────────────────────┘      │
│   SHORTCUTS  │                                                  │
│              │         🎯 DANAŠNJE AKCIJE                       │
│ ➕ Novi Email│    □ Odgovori na ponudu za automatizaciju       │
│ 📅 Kalendar  │    □ Zakaži call sa CEO Mondrian              │
│ 📊 Izvještaji│    ✅ Review technical documentation           │
│              │    ████████░░░░░░░░░░░░ 67% Complete           │
└──────────────┴─────────────────────────────────────────────────┘
```

**Komponente:**

**1. Welcome Widget**
- Personalizirani pozdrav sa imenom korisnika
- Trenutno vrijeme i datum
- AI sumarizacija dana
- Productivity progress bar

**2. Priority Inbox**
- Email kartice sa preview-om
- Priority indikatori:
  - 🔴 Crvena = URGENT (odgovor danas)
  - 🟡 Žuta = IMPORTANT (ova sedmica)
  - 🟢 Zelena = NORMAL (može sačekati)
- AI summary (max 60 karaktera)
- Quick actions (Reply, Archive, Snooze, Mark as Done)

**3. Today's Actions Panel**
- Check-box lista akcija
- Time estimate za svaku akciju (~5 min)
- Drag & drop reorganizacija
- Progress bar na vrhu
- Motivacioni tekst kada završite sve

**4. AI Insights Card**
- Bullet points sa insights
- Sparkline grafikoni za trendove
- KPI promjene

#### 4.2.3 Email Detail View

**Layout:**
```
┌────────────────────────────────────────────┐
│ ← Back to Inbox                     ✕ Close│
├────────────────────────────────────────────┤
│                                            │
│ Re: Automatizacija Procesa - Ponuda       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                            │
│ From: john.doe@company.com                │
│ To: you@domain.com                         │
│ Date: Nov 21, 2025 at 10:30 AM           │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │      🤖 AI ANALIZA                    │  │
│ │                                       │  │
│ │ Tip: Business Opportunity            │  │
│ │ Prioritet: HIGH (8/10)              │  │
│ │ Sentiment: Positive, Eager          │  │
│ │ Potencijal: €10,000 - €15,000      │  │
│ │                                       │  │
│ │ Preporučene Akcije:                  │  │
│ │ 1. Zakaži discovery call (30 min)   │  │
│ │ 2. Pripremi pricing proposal        │  │
│ │ 3. Research njihovu industriju       │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ [Email content here...]                    │
│                                            │
│ [💬 Reply] [📎 Forward] [📁 Archive]      │
└────────────────────────────────────────────┘
```

#### 4.2.4 Mobile Interface (iPhone)

**Dashboard:**
```
┌─────────────────┐
│ 9:41 AM    ██│🔋│
├─────────────────┤
│                 │
│ AI Hub     🔍 🔔│
│                 │
├─────────────────┤
│ Dobro jutro! ☀️ │
│                 │
│ ┌─────────────┐ │
│ │ 5 Hitnih    │ │
│ │ 12 Akcija   │ │
│ │ 67% Done    │ │
│ └─────────────┘ │
│                 │
│ EMAILS ▼        │
│ ┌─────────────┐ │
│ │ 🔴 John Doe │ │
│ │ Automation  │ │
│ │ AI: €10K    │ │
│ │ [→ Swipe]   │ │
│ └─────────────┘ │
│                 │
├─────────────────┤
│ 🏠  📧  ➕  📊  👤│
└─────────────────┘
```

**Swipe Actions:**
- ←Swipe Left: Archive
- →Swipe Right: Important
- ↑Swipe Up: Need Desktop
- ↓Swipe Down: Delegate

### 4.3 Responsive Breakpoints

| Ime | Range | Layout |
|-----|-------|--------|
| Mobile | 320px - 768px | Single column, hamburger menu |
| Tablet | 768px - 1024px | 2 column grid |
| Desktop | 1024px - 1920px | 3 column sa sidebar |
| Wide | 1920px+ | Maximum width container (1440px) |

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
- Modal scales from 0.95 to 1
- Duration: 300ms spring animation

### 4.5 Notifikacije

| Tip | Boja | Duration |
|-----|------|----------|
| Success | Zelena | 3 sekunde |
| Info | Plava | 5 sekundi |
| Warning | Žuta | 5 sekundi |
| Error | Crvena | Manual dismiss |

**Push Notification Format:**
```
🔴 URGENT: New €50,000 opportunity detected
CEO of TechCorp wants to discuss automation
[View] [Snooze]
```

---

## 5. USER JOURNEY I ONBOARDING

### 5.1 Onboarding Flow (30 minuta)

#### Korak 1: Registracija (2 min)
- Google OAuth (preporučeno) ili email registracija
- Email verifikacija

#### Korak 2: Gmail Konekcija (3 min)
```
┌────────────────────────────────────┐
│  Connect Your Gmail Account        │
│                                    │
│  AI Hub needs permission to:       │
│  ✓ Read your emails               │
│  ✓ Send emails on your behalf     │
│  ✓ Organize with labels           │
│                                    │
│  [Connect Gmail Account]           │
│                                    │
│  🔒 Your data is encrypted         │
│  🚫 Never shared with third parties│
└────────────────────────────────────┘
```

#### Korak 3: Personalizacija (5 min)
- Postavljanje ciljeva (do 3)
- Komunikacijski stil (Formal/Professional/Casual)
- Radno vrijeme i timezone

#### Korak 4: Dashboard Tour (5 min)
- Priority Inbox objašnjenje
- AI Analysis Panel demo
- Daily Actions lista
- Productivity Score

#### Korak 5: Prva AI Analiza (10 min)
- Procesiranje postojećih emailova
- Progress tracking
- Rezultati analize

#### Korak 6: Prvi Task (5 min)
- Odgovaranje na email sa AI draft-om
- Edit ili Send as-is opcije
- Celebration animation

### 5.2 Dnevna Rutina

**Optimalna jutarnja rutina (15 minuta):**
```
8:00 AM - Otvori Dashboard
8:01 AM - Review AI Digest (2 min)
8:03 AM - Handle URGENT items (5 min)
8:08 AM - Quick replies sa AI (5 min)
8:13 AM - Schedule follow-ups (2 min)
8:15 AM - Start deep work!

Rezultat: Inbox Zero prije 8:30!
```

---

## 6. SPECIFIČNI ZAHTJEVI

### 6.1 Zahtjevi Eksternih Interfejsa

#### 6.1.1 Korisnički Interfejsi

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| UI-001 | Sistem mora podržavati responsive dizajn (desktop, tablet, mobile) | Kritičan |
| UI-002 | Sistem mora podržavati Dark i Light mode sa automatskim prepoznavanjem | Visok |
| UI-003 | Svi interaktivni elementi minimum 44x44px za touch | Visok |
| UI-004 | Kontrast ratio minimum 4.5:1 (WCAG 2.1 AA) | Visok |
| UI-005 | Keyboard navigacija kroz cijelu aplikaciju | Srednji |
| UI-006 | Sve animacije 60fps | Srednji |
| UI-007 | Page load < 2 sekunde | Kritičan |

#### 6.1.2 Softverski Interfejsi

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| SW-001 | Gmail API (Google Apps Script + OAuth 2.0) | Kritičan |
| SW-002 | OpenAI API (GPT-4-turbo, GPT-3.5-turbo) | Kritičan |
| SW-003 | Anthropic API (Claude-3.5-Sonnet, Claude-3-Haiku) | Visok |
| SW-004 | Groq API (18+ modela: Llama, Mixtral, Gemma) | Visok |
| SW-005 | Google Calendar API | Srednji |
| SW-006 | Slack API | Nizak |
| SW-007 | Microsoft Teams/Outlook API | Nizak |

#### 6.1.3 Komunikacijski Interfejsi

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| COM-001 | HTTPS (TLS 1.3) za svu komunikaciju | Kritičan |
| COM-002 | RESTful API konvencije | Kritičan |
| COM-003 | JSON format odgovora | Kritičan |
| COM-004 | WebSocket za real-time updates | Visok |
| COM-005 | SSE za AI processing progress | Visok |
| COM-006 | CORS za definisane domene | Kritičan |

### 6.2 Funkcionalni Zahtjevi

#### 6.2.1 Autentifikacija i Autorizacija

| ID | Zahtjev | Opis | Prioritet |
|----|---------|------|-----------|
| REQ-AUTH-001 | Registracija sa email verifikacijom | Kreiranje naloga sa potvrdom | Kritičan |
| REQ-AUTH-002 | JWT login | Token-based auth | Kritičan |
| REQ-AUTH-003 | OAuth 2.0 (Google, Microsoft) | Social login | Visok |
| REQ-AUTH-004 | Refresh token mehanizam | Automatsko obnavljanje | Kritičan |
| REQ-AUTH-005 | Logout sa invalidacijom | Sigurno odjavljivanje | Kritičan |
| REQ-AUTH-006 | Password reset | Forgot password flow | Visok |
| REQ-AUTH-007 | Two-factor authentication | 2FA | Srednji |

**API Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/change-password
```

#### 6.2.2 Email Sync i Management

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| REQ-EMAIL-001 | Gmail OAuth sync | Kritičan |
| REQ-EMAIL-002 | Email storage u lokalnoj bazi | Kritičan |
| REQ-EMAIL-003 | Lista emailova sa paginacijom | Kritičan |
| REQ-EMAIL-004 | Detalji pojedinačnog emaila | Kritičan |
| REQ-EMAIL-005 | Mark read/unread | Visok |
| REQ-EMAIL-006 | Bulk operacije | Visok |
| REQ-EMAIL-007 | Pretraga emailova | Visok |
| REQ-EMAIL-008 | Filtriranje (prioritet, status, kategorija) | Visok |
| REQ-EMAIL-009 | Threading (grupiranje u konverzacije) | Visok |

**API Endpoints:**
```
GET  /api/v1/emails
GET  /api/v1/emails/messages
GET  /api/v1/emails/messages/v5
GET  /api/v1/emails/{id}
PATCH /api/v1/emails/{id}/read
PATCH /api/v1/emails/{id}/unread
POST /api/v1/emails/bulk-read
POST /api/v1/emails/bulk-delete
```

#### 6.2.3 AI Analiza

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| REQ-AI-001 | HTML Structural Analysis | Kritičan |
| REQ-AI-002 | Email Classification | Kritičan |
| REQ-AI-003 | Sentiment Analysis | Kritičan |
| REQ-AI-004 | Recommendation Engine | Kritičan |
| REQ-AI-005 | Action Extraction | Visok |
| REQ-AI-006 | Escalation Logic | Visok |
| REQ-AI-007 | Completion Tracking | Visok |
| REQ-AI-008 | Summarization (Daily/Weekly digest) | Visok |
| REQ-AI-009 | Multi-model validacija | Srednji |

**API Endpoints:**
```
POST /api/v1/emails/{id}/analyze
POST /api/v1/sync/ai
POST /api/v1/sync/ai/{id}
GET  /api/v1/communication/ai-dashboard
GET  /api/v1/communication/ai-message/{id}
GET  /api/v1/ai/usage
```

#### 6.2.4 Todo/Action Management

| ID | Zahtjev | Prioritet |
|----|---------|-----------|
| REQ-TODO-001 | CRUD todo stavki | Kritičan |
| REQ-TODO-002 | Todo iz emaila | Visok |
| REQ-TODO-003 | Toggle completion | Kritičan |
| REQ-TODO-004 | Prioritizacija | Visok |
| REQ-TODO-005 | Deadline management | Visok |

**API Endpoints:**
```
GET    /api/v1/todos
POST   /api/v1/todos
GET    /api/v1/todos/{id}
PUT    /api/v1/todos/{id}
DELETE /api/v1/todos/{id}
PATCH  /api/v1/todos/{id}/toggle
POST   /api/v1/todos/from-email
```

### 6.3 Nefunkcionalni Zahtjevi

#### 6.3.1 Performance

| ID | Zahtjev | Metrika |
|----|---------|---------|
| NFR-PERF-001 | Response time | < 3 sekunde |
| NFR-PERF-002 | Page load time | < 2 sekunde |
| NFR-PERF-003 | Concurrent users | Do 1000 po instanci |
| NFR-PERF-004 | Email processing | Do 10,000/sat |
| NFR-PERF-005 | AI processing | < 5 sekundi/email |
| NFR-PERF-006 | Database query | < 100ms |
| NFR-PERF-007 | Rate limit | 60 req/min (standard), 5 req/min (auth) |

#### 6.3.2 Reliability

| ID | Zahtjev | Metrika |
|----|---------|---------|
| NFR-REL-001 | System uptime | 99.9% |
| NFR-REL-002 | Automatic backup | Dnevni |
| NFR-REL-003 | Disaster recovery | RTO < 4h, RPO < 1h |
| NFR-REL-004 | Graceful error handling | Sve greške logged |
| NFR-REL-005 | Data integrity | Zero data loss |

#### 6.3.3 Usability

| ID | Zahtjev |
|----|---------|
| NFR-USE-001 | Intuitivan interfejs bez obuke |
| NFR-USE-002 | Multi-language (EN, srpski/bosanski) |
| NFR-USE-003 | WCAG 2.1 AA compliance |
| NFR-USE-004 | Consistent design system |
| NFR-USE-005 | User-friendly error messages |

---

## 7. ZAHTJEVI BAZE PODATAKA

### 7.1 Core Tables

| Tabela | Opis | Status |
|--------|------|--------|
| `users` | Korisnici sistema | ✅ |
| `user_types` | Tipovi korisnika | ✅ |
| `permissions/roles/*` | Spatie RBAC tabele | ✅ |
| `messaging_channels` | Email kanali (Gmail, etc.) | ✅ |
| `message_threads` | Email thread-ovi | ✅ |
| `messaging_messages` | Pojedinačne email poruke | ✅ |
| `messaging_attachments` | Email attachmenti | ✅ |
| `messaging_headers` | Email headeri | ✅ |
| `messaging_labels` | Gmail labele | ✅ |
| `messaging_sync_logs` | Logovi sinkronizacije | ✅ |
| `messaging_processing_jobs` | AI job queue | ✅ |
| `email_actions` | Akcije iz emailova | ✅ |
| `todos` | Todo stavke | ✅ |
| `user_goals` | Korisnički ciljevi | 🔄 Planirano |
| `ai_processing_logs` | AI cost tracking | 🔄 Planirano |

### 7.2 Ključne Kolone (messaging_messages)

**Core fields:**
- `message_id` (unique), `thread_id`, `message_number`
- `message_timestamp`, `received_date`
- `sender` (JSON), `recipients` (JSON)

**Content fields:**
- `content_text`, `content_html`, `content_snippet`
- `attachment_count`, `reactions` (JSON)

**Gmail flags:**
- `is_draft`, `is_unread`, `is_starred`, `is_in_trash`, `is_in_inbox`
- `is_spam`, `priority` (high/normal/low)

**AI fields:**
- `ai_analysis` (JSON), `ai_status`, `ai_processed_at`
- `ai_classification`, `ai_sentiment`, `ai_recommendations`, `ai_actions`

### 7.3 Indeksi

```sql
-- messaging_messages
INDEX idx_thread_id (thread_id)
INDEX idx_message_timestamp (message_timestamp)
INDEX idx_is_unread (is_unread)
INDEX idx_ai_status (ai_status)
UNIQUE INDEX idx_message_id (message_id)
FULLTEXT idx_content (content_text, subject)
```

---

## 8. AI SERVISI - SPECIFIKACIJE

### 8.1 Master Orchestrator

Centralni AI koordinator upravlja sa 8 specijalizovanih servisa:

```
Email Input → Master Orchestrator
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
Servis 1-3      Servis 4-5      Servis 6-8
(Parallel)      (Sequential)    (Sequential)
    │               │               │
    └───────────────┼───────────────┘
                    ▼
           Aggregated Result
```

### 8.2 Servis 1: HTML Structural Analysis

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Optimizacija HTML sadržaja |
| **Performance** | 50-100ms |
| **Token Reduction** | 60-80% |

**Output:**
```json
{
  "cleaned_text": "Optimizovan tekst",
  "structure": {
    "headings": ["H1: Title"],
    "key_phrases": ["BOLD: Important"],
    "links": [{"text": "CTA", "url": "...", "importance": "high"}]
  },
  "urgency_markers": ["URGENT", "DEADLINE: Friday"],
  "is_newsletter": false
}
```

### 8.3 Servis 2: Classification Service

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Kategorizacija emaila |
| **Performance** | 200-300ms |
| **Accuracy** | 92%+ |

**Kategorije:**
- `automation_opportunity` - B2B, consulting
- `business_inquiry` - Direktni zahtjevi
- `networking` - Konferencije, events
- `educational` - Learning, webinari
- `financial` - Računi, plaćanja
- `administrative` - Notifikacije
- `marketing` - Newsletters, promotions
- `personal` - Lične poruke

### 8.4 Servis 3: Sentiment Analysis

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Ton, urgentnost, potencijal |
| **Performance** | 150-250ms |

**Urgency Scale (1-10):**
| Score | Indikatori |
|-------|------------|
| 9-10 | "URGENT", "ASAP", "today" |
| 7-8 | "this week", "by Friday" |
| 5-6 | "when you can" |
| 3-4 | "eventually" |
| 1-2 | Bez indikatora |

### 8.5 Servis 4: Recommendation Engine

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Personalizovane preporuke |
| **Performance** | 300-500ms |

**Logic:**
```
IF category == "automation_opportunity" AND urgency >= 7:
    → HIGH priority, "Direktna business prilika"

ELSE IF category == "business_inquiry" AND business_potential >= 6:
    → HIGH priority, "Zakazati discovery call"

ELSE IF is_newsletter:
    → LOW priority, "Može se ignorisati"
```

### 8.6 Servis 5: Action Extraction

| Atribut | Vrijednost |
|---------|------------|
| **Uloga** | Konkretne akcije |
| **Performance** | 200-400ms |
| **Max Actions** | 3 po emailu |

**Action Types:**
- RESPOND - Email odgovor
- SCHEDULE - Zakazivanje
- RESEARCH - Istraživanje
- ADD_TO_TODO - Task
- FOLLOW_UP - Reminder
- ARCHIVE - Nema akcije

### 8.7 Servis 6: Escalation Logic

**Immediate Triggers:**
- Urgency >= 9 AND business_potential >= 8
- Deadline u subject-u
- Client complaint
- Payment issues

**Delayed Escalation:**
- HIGH: 24h bez odgovora
- MEDIUM: 3 dana bez odgovora

### 8.8 Servis 7: Completion Tracking

**Status States:**
- ⚪ PENDING
- 🟡 IN_PROGRESS
- ✅ COMPLETED
- 🔴 OVERDUE
- ⏸️ SNOOZED

### 8.9 Servis 8: Summarization Service

**Report Types:**

**1. Daily Digest (8:00 AM):**
```
🌅 Good Morning! Here's your email digest

📧 YESTERDAY'S ACTIVITY:
- 47 emails processed
- 12 actions created

🔴 URGENT (Today):
1. Client X - Automation inquiry

💰 BUSINESS POTENTIAL:
- 3 hot leads ($15K-25K)
```

**2. Weekly Summary:**
- Total emails
- Actions completed/pending
- Business opportunities
- ROI estimate

### 8.10 Multi-Model Validation

| Servis | Primary | Validation | Control |
|--------|---------|------------|---------|
| HTML | GPT-4-turbo | Claude-3-Haiku | Llama-3.1-70B |
| Classification | GPT-4-turbo | GPT-3.5-turbo | Mixtral-8x7B |
| Sentiment | Claude-3.5-Sonnet | PaLM-2 | Llama-3.1-70B |

**Confidence Zones:**
- **Green (>90%):** Proceed
- **Yellow (80-90%):** Warning
- **Red (<80%):** Human validation

---

## 9. SIGURNOSNI ZAHTJEVI

### 9.1 Autentifikacija

| ID | Zahtjev | Status |
|----|---------|--------|
| SEC-AUTH-001 | JWT authentication | ✅ |
| SEC-AUTH-002 | OAuth 2.0 | ✅ (Gmail) |
| SEC-AUTH-003 | Token expiration (1h/7d) | ✅ |
| SEC-AUTH-004 | 2FA | 🔮 Planirano |
| SEC-AUTH-005 | RBAC (Spatie) | ✅ |

### 9.2 Data Protection

| ID | Zahtjev | Status |
|----|---------|--------|
| SEC-DATA-001 | HTTPS (TLS 1.3) | ✅ |
| SEC-DATA-002 | Encryption at rest (AES-256) | ✅ |
| SEC-DATA-003 | Transaction safety | ✅ |
| SEC-DATA-004 | UTF-8 sanitization | ✅ |

### 9.3 API Security

| ID | Zahtjev | Status |
|----|---------|--------|
| SEC-API-001 | Rate limiting (60/min) | ✅ |
| SEC-API-002 | CORS configuration | ✅ |
| SEC-API-003 | Input validation | ✅ |
| SEC-API-004 | SQL injection prevention | ✅ |
| SEC-API-005 | XSS prevention | ✅ |

### 9.4 AI Security

| ID | Zahtjev | Status |
|----|---------|--------|
| SEC-AI-001 | Input sanitization | ✅ |
| SEC-AI-002 | Output validation | ✅ |
| SEC-AI-003 | Cost tracking | ✅ |

### 9.5 Compliance

| Standard | Status |
|----------|--------|
| GDPR | 🔄 U toku |
| OWASP Top 10 | ✅ |
| WCAG 2.1 AA | 🔄 U toku |

---

## 10. TEHNIČKA IMPLEMENTACIJA

### 10.1 Tehnološki Stack

**Frontend:**
| Tehnologija | Verzija |
|-------------|---------|
| React | 19 |
| TypeScript | 5.2 |
| Redux Toolkit + RTK Query | 2.8 |
| Shadcn/ui + Radix UI | Latest |
| Tailwind CSS | 3.4 |
| Framer Motion | Latest |
| Vite | 5.3 |

**Backend:**
| Tehnologija | Verzija |
|-------------|---------|
| Laravel | 12 |
| PHP | 8.3 |
| MySQL | 8.0 |
| Redis | Alpine |
| JWT (php-open-source-saver) | Latest |

**AI Servisi:**
| Model | Tier |
|-------|------|
| GPT-4-turbo | Production |
| Claude-3.5-Sonnet | Production |
| Groq (18+ modela) | Production |

### 10.2 Docker Infrastructure

```yaml
services:
  app:           # Laravel Backend
  frontend:      # React Frontend
  mysql:         # Database
  redis:         # Cache & Sessions
  ai-processor:  # AI Service
  websocket:     # Real-time updates
  nginx:         # Reverse Proxy
```

---

## 11. PLAN IMPLEMENTACIJE I ROI

### 11.1 Faze Implementacije

| Faza | Status | Opis |
|------|--------|------|
| **MVP (Mjesec 1-2)** | ✅ Završeno | Gmail sync, 5 AI servisa |
| **Kompletno (Mjesec 3-4)** | 🔄 U toku | 8 AI servisa, eskalacija |
| **Optimizacija (Mjesec 5-6)** | 📅 | Advanced analytics |
| **Skaliranje (Mjesec 7-12)** | 📅 | Enterprise, multi-tenant |

### 11.2 ROI Kalkulacija

**Za profesionalca sa 1000 komunikacija mjesečno:**

| Stavka | Iznos |
|--------|-------|
| AI procesiranje | ~$246/mjesečno |
| Infrastruktura | $70-130/mjesečno |
| **Ukupan trošak** | ~$400-500/mjesečno |

**Ušteda:**
| Stavka | Iznos |
|--------|-------|
| Ušteda vremena | 20 sati/mjesečno |
| Vrijednost sata | $50-150 |
| **Mjesečna ušteda** | $1,000-3,000 |

**ROI: 200-600%**

### 11.3 Cjenovni Modeli

| Plan | Cijena | Komunikacija |
|------|--------|--------------|
| Solo | €450/mj | 1,000 |
| Executive | €850/mj | 2,500 |
| Enterprise | €650/korisnik | Unlimited |

---

## 12. APPENDIX

### 12.1 Error Codes

| Code | HTTP | Opis |
|------|------|------|
| AUTH001 | 401 | Invalid credentials |
| AUTH002 | 401 | Token expired |
| AUTH003 | 403 | Insufficient permissions |
| VAL001 | 422 | Validation error |
| SYS001 | 500 | Internal server error |
| SYNC001 | 503 | Sync unavailable |
| AI001 | 503 | AI unavailable |
| RATE001 | 429 | Rate limit exceeded |

### 12.2 API Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error"]
  }
}
```

### 12.3 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Quick search |
| `R` | Reply to email |
| `A` | Archive |
| `S` | Snooze |
| `Esc` | Close modal |

### 12.4 Approval

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

**Verzija:** 2.0
**Posljednja izmjena:** Novembar 2025
**Autor:** AI Automation Team
**Status:** Active Development
