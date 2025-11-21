# Fullstack Auth & User Management Template
## Kompletna Dokumentacija

### Verzija: 1.0
### Datum: Juli 2025

---

## Sadržaj

1. [Studija Izvodljivosti](#1-studija-izvodljivosti)
2. [SRS - Software Requirements Specification](#2-srs-software-requirements-specification)
3. [Tehnička Dokumentacija](#3-tehnička-dokumentacija)
4. [Deployment Plan](#4-deployment-plan)
5. [Prijedlog za Testiranje i QA Proces](#5-prijedlog-za-testiranje-i-qa-proces)
6. [Modularna Struktura za Reusability](#6-modularna-struktura-za-reusability)

---

## 1. Studija Izvodljivosti

### 1.1 Tehnička Izvodljivost

#### 1.1.1 Ocjena Tehničke Složenosti
**Ocjena: VISOKA (4/5)**

**Razlozi:**
- Podrška za multiple backend frameworke (C#/.NET, Java/Spring, Node.js/Express, Python/Django, Laravel)
- Podrška za multiple frontend frameworke (React, Angular, Vue, Next.js)
- Mobilne platforme (Flutter, React Native, Kotlin, Swift)
- Složeni sigurnosni zahtjevi (OAuth2, RBAC, 2FA)
- Integracija sa vanjskim servisima (Stripe, Firebase, AWS)

#### 1.1.2 Resursi i Ekspertiza
**Potrebni resursi:**
- **Backend developeri**: 3-4 seniorna developera sa ekspertizom u različitim tehnologijama
- **Frontend developeri**: 2-3 developera sa iskustvom u React/Vue/Angular ekosistemu
- **Mobile developeri**: 2 developera (Flutter/React Native)
- **DevOps inženjer**: 1 ekspert za CI/CD i deployment
- **QA inženjer**: 1 ekspert za automatizovano testiranje
- **Projektni menadžer**: 1 senior PM
- **Ukupno trajanje**: 6-8 mjeseci

#### 1.1.3 Tehnički Rizici
| Rizik | Vjerovatnoća | Uticaj | Mitigacija |
|-------|--------------|---------|------------|
| Kompatibilnost između različitih stack-ova | Visoka | Visok | Standardizacija API-ja, dokumentacija |
| Sigurnosni propusti | Srednja | Kritičan | Redovno security auditing, penetration testing |
| Performance bottlenecks | Srednja | Visok | Load testing, optimizacija |
| Održavanje multiple tech stack-ova | Visoka | Srednji | Modularizacija, automatizacija |

### 1.2 Ekonomska Izvodljivost

#### 1.2.1 Analiza Troškova
**Inicijalni troškovi razvoja:**
- Razvojni tim (8 osoba × 6 mjeseci): $480,000
- Infrastruktura i alati: $15,000
- Licenciranje: $10,000
- QA i testiranje: $25,000
- **Ukupno**: $530,000

**Operativni troškovi (godišnje):**
- Održavanje i updates: $120,000
- Hosting i infrastruktura: $24,000
- Support i dokumentacija: $60,000
- **Ukupno**: $204,000

#### 1.2.2 Analiza Profitabilnosti
**Prihodi:**
- Licenciranje template-a: $299-999 po licenci
- Enterprise licencije: $2,999-9,999
- Support i consulting: $150-300/sat
- Customizacija projekata: $50,000-200,000 po projektu

**ROI kalkulacija:**
- Breakeven: 18-24 mjeseca
- Projektovani ROI: 150-300% u toku 3 godine

### 1.3 Operativna Izvodljivost

#### 1.3.1 Organizacijski Faktori
**Prednosti:**
- Visoka potražnja za auth/user management rješenjima
- Mogućnost brzog pokretanja novih projekata
- Standardizacija razvoja unutar organizacije

**Izazovi:**
- Potreba za kontinuiranim održavanjem multiple tech stack-ova
- Kompleksnost dokumentacije i onboarding procesa
- Potreba za ekspertnim znanjem u različitim tehnologijama

#### 1.3.2 Preporuke
- **Početak sa MVP** - fokus na najčešće korištene tehnologije (React + Node.js)
- **Fazni pristup** - dodavanje novih tehnologija postepeno
- **Community engagement** - aktivno uključivanje korisnika u razvoj

---

## 2. SRS - Software Requirements Specification

### 2.1 Opis Sistema

#### 2.1.1 Svrha
Fullstack Auth & User Management Template je komercijalni, produkcijski template koji omogućava brzо implementaciju autentifikacije i upravljanja korisnicima u web i mobilnim aplikacijama.

#### 2.1.2 Scope
Template pokriva:
- **Autentifikaciju**: registraciju, prijavu, odjavu
- **Autorizaciju**: role-based access control (RBAC)
- **Upravljanje korisnicima**: profile, preferences, admin panel
- **Sigurnost**: 2FA, OAuth2, JWT tokens
- **Integracije**: payment (Stripe), analytics, notifications
- **Multi-platform support**: web, mobile, desktop

#### 2.1.3 Definicije i Akronimi
- **RBAC**: Role-Based Access Control
- **2FA**: Two-Factor Authentication
- **JWT**: JSON Web Token
- **OAuth2**: Open Authorization Framework
- **API**: Application Programming Interface
- **SPA**: Single Page Application
- **PWA**: Progressive Web Application

### 2.2 Funkcionalni Zahtjevi

#### 2.2.1 Autentifikacija (AUTH)
| ID | Zahtjev | Prioritet | Složenost |
|----|---------|-----------|-----------|
| AUTH-001 | Registracija korisnika email/password | Visok | Niska |
| AUTH-002 | Prijava korisnika | Visok | Niska |
| AUTH-003 | Odjava korisnika | Visok | Niska |
| AUTH-004 | Zaboravljena lozinka | Visok | Srednja |
| AUTH-005 | Email verifikacija | Visok | Srednja |
| AUTH-006 | Social login (Google, Facebook, GitHub) | Srednji | Visoka |
| AUTH-007 | Two-factor authentication | Srednji | Visoka |
| AUTH-008 | Biometric authentication (mobile) | Nizak | Visoka |

#### 2.2.2 Autorizacija (AUTHZ)
| ID | Zahtjev | Prioritet | Složenost |
|----|---------|-----------|-----------|
| AUTHZ-001 | Role-based access control | Visok | Visoka |
| AUTHZ-002 | Permission management | Visok | Visoka |
| AUTHZ-003 | Resource-based authorization | Srednji | Visoka |
| AUTHZ-004 | Dynamic permissions | Nizak | Visoka |

#### 2.2.3 Upravljanje Korisnicima (USER)
| ID | Zahtjev | Prioritet | Složenost |
|----|---------|-----------|-----------|
| USER-001 | User profile management | Visok | Srednja |
| USER-002 | Avatar upload | Srednji | Srednja |
| USER-003 | Account settings | Visok | Srednja |
| USER-004 | User preferences | Srednji | Srednja |
| USER-005 | Account deletion | Visok | Srednja |
| USER-006 | Admin user management | Visok | Visoka |
| USER-007 | User search and filtering | Srednji | Srednja |
| USER-008 | Bulk user operations | Nizak | Visoka |

#### 2.2.4 Integracije (INTEG)
| ID | Zahtjev | Prioritet | Složenost |
|----|---------|-----------|-----------|
| INTEG-001 | Stripe payment integration | Srednji | Visoka |
| INTEG-002 | Email service integration | Visok | Srednja |
| INTEG-003 | Push notifications | Srednji | Visoka |
| INTEG-004 | Analytics integration | Nizak | Srednja |
| INTEG-005 | File storage integration | Srednji | Srednja |

### 2.3 Nefunkcionalni Zahtjevi

#### 2.3.1 Performance
- **Response time**: < 200ms za lokalne operacije
- **Throughput**: 1000 concurrent users po instanci
- **Database queries**: < 50ms average
- **File uploads**: Support za fajlove do 10MB

#### 2.3.2 Security
- **Encryption**: AES-256 za podatke u mirovanju
- **Transport security**: TLS 1.3
- **Password policy**: Minimalno 8 karaktera, složenost
- **Session management**: Secure JWT tokens
- **Rate limiting**: 100 requests/minute po IP
- **OWASP compliance**: Top 10 security vulnerabilities

#### 2.3.3 Scalability
- **Horizontal scaling**: Stateless design
- **Database**: Support za read replicas
- **Caching**: Redis/Memcached integration
- **Load balancing**: Support za multiple instances

#### 2.3.4 Reliability
- **Uptime**: 99.9% availability
- **Data backup**: Daily automated backups
- **Disaster recovery**: RTO < 4 sata, RPO < 1 sat
- **Monitoring**: Real-time health checks

#### 2.3.5 Usability
- **Responsive design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: Support za multiple jezika
- **Documentation**: Comprehensive developer docs

### 2.4 Use Case Dijagrami i Opisi

#### 2.4.1 Use Case Dijagram - Autentifikacija
```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication System                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Guest User          Regular User         Admin User        │
│      │                    │                   │             │
│      │                    │                   │             │
│  ┌───▼────┐          ┌────▼────┐         ┌────▼────┐        │
│  │Register│          │ Login   │         │Manage   │        │
│  │        │          │         │         │Users    │        │
│  └───┬────┘          └────┬────┘         └────┬────┘        │
│      │                    │                   │             │
│  ┌───▼────┐          ┌────▼────┐         ┌────▼────┐        │
│  │Verify  │          │ Logout  │         │Assign   │        │
│  │Email   │          │         │         │Roles    │        │
│  └────────┘          └────┬────┘         └─────────┘        │
│                           │                                 │
│                      ┌────▼────┐                            │
│                      │Change   │                            │
│                      │Password │                            │
│                      └─────────┘                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2.4.2 Use Case Opisi

**UC-001: Registracija korisnika**
- **Akter**: Guest User
- **Preduslovi**: Korisnik nije registrovan
- **Tok**: 
  1. Korisnik unosi email i password
  2. System validira podatke
  3. System kreira novi account
  4. System šalje verifikacijski email
  5. Korisnik potvrđuje email
- **Postuslov**: Korisnik je registrovan i verifikovan

**UC-002: Prijava korisnika**
- **Akter**: Regular User
- **Preduslovi**: Korisnik je registrovan
- **Tok**:
  1. Korisnik unosi credentials
  2. System validira podatke
  3. System generiše JWT token
  4. System vraća token korisniku
- **Postuslov**: Korisnik je prijavljen

### 2.5 Dijagrami Toka Podataka

#### 2.5.1 Context Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────┐    ┌─────────────────────────────────────┐    │
│  │   User   │◄──►│                                     │    │
│  └──────────┘    │                                     │    │
│                  │     Auth & User Management          │    │
│  ┌──────────┐    │           System                    │    │
│  │  Admin   │◄──►│                                     │    │
│  └──────────┘    │                                     │    │
│                  └─────────────────────────────────────┘    │
│  ┌──────────┐                        ▲                      │
│  │  Email   │◄───────────────────────┼──────────────────────┤
│  │ Service  │                        │                      │
│  └──────────┘                        ▼                      │
│                                                             │
│  ┌──────────┐    ┌─────────────────────────────────────┐    │
│  │ Payment  │◄──►│           Database                  │    │
│  │ Service  │    │                                     │    │
│  └──────────┘    └─────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2.5.2 Level 1 DFD - Autentifikacija
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  User Input ──┐                                             │
│              │                                             │
│              ▼                                             │
│  ┌─────────────────────┐        ┌─────────────────────┐    │
│  │    1. Validate      │        │    2. Generate      │    │
│  │   Credentials       │──────► │     Token          │    │
│  └─────────────────────┘        └─────────────────────┘    │
│              │                              │              │
│              ▼                              ▼              │
│  ┌─────────────────────┐        ┌─────────────────────┐    │
│  │   User Database     │        │   Session Store     │    │
│  │                     │        │                     │    │
│  └─────────────────────┘        └─────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.6 ER Dijagrami

#### 2.6.1 Core Entity Relationship Diagram
```sql
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────┐       ┌──────────────┐                    │
│  │    Users     │       │    Roles     │                    │
│  │──────────────│       │──────────────│                    │
│  │ id (PK)      │       │ id (PK)      │                    │
│  │ email        │       │ name         │                    │
│  │ password     │       │ description  │                    │
│  │ first_name   │       │ created_at   │                    │
│  │ last_name    │       │ updated_at   │                    │
│  │ avatar_url   │       └──────────────┘                    │
│  │ is_verified  │              │                            │
│  │ is_active    │              │                            │
│  │ created_at   │              │                            │
│  │ updated_at   │              │                            │
│  └──────────────┘              │                            │
│         │                      │                            │
│         │                      │                            │
│         │        ┌──────────────▼──────────────┐            │
│         │        │        User_Roles           │            │
│         │        │────────────────────────────│            │
│         │        │ user_id (FK)               │            │
│         │        │ role_id (FK)               │            │
│         │        │ assigned_at                │            │
│         │        │ assigned_by                │            │
│         │        └────────────────────────────┘            │
│         │                                                  │
│         │                                                  │
│         │        ┌──────────────┐                          │
│         │        │ Permissions  │                          │
│         │        │──────────────│                          │
│         │        │ id (PK)      │                          │
│         │        │ name         │                          │
│         │        │ resource     │                          │
│         │        │ action       │                          │
│         │        │ created_at   │                          │
│         │        └──────────────┘                          │
│         │                 │                                │
│         │                 │                                │
│         │        ┌────────▼────────┐                       │
│         │        │  Role_Permissions│                       │
│         │        │─────────────────│                       │
│         │        │ role_id (FK)    │                       │
│         │        │ permission_id   │                       │
│         │        │ granted_at      │                       │
│         │        └─────────────────┘                       │
│         │                                                  │
│         │                                                  │
│         │        ┌──────────────┐                          │
│         └───────►│   Sessions   │                          │
│                  │──────────────│                          │
│                  │ id (PK)      │                          │
│                  │ user_id (FK) │                          │
│                  │ token        │                          │
│                  │ expires_at   │                          │
│                  │ created_at   │                          │
│                  │ ip_address   │                          │
│                  │ user_agent   │                          │
│                  └──────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.7 Arhitektura Sistema

#### 2.7.1 High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Web Apps    │  Mobile Apps  │  Desktop Apps │  APIs        │
│ (React, Vue, │  (Flutter,    │  (Electron,   │ (Postman,    │
│  Angular)    │  React Native)│  Tauri)       │  Swagger)    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway                              │
├─────────────────────────────────────────────────────────────┤
│  Rate Limiting  │  Authentication  │  Load Balancing       │
│  CORS          │  Request Logging │  API Versioning       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Auth Service  │  User Service   │  Notification Service   │
│  Role Service  │  File Service   │  Analytics Service      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Data Layer                                 │
├─────────────────────────────────────────────────────────────┤
│  Primary DB    │  Cache (Redis)  │  File Storage (S3)      │
│  (PostgreSQL)  │  Session Store  │  Search (Elasticsearch) │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                External Services                            │
├─────────────────────────────────────────────────────────────┤
│  Email Service │  Payment (Stripe)│  Analytics (GA)        │
│  (SendGrid)    │  Social Auth     │  Monitoring (Sentry)   │
└─────────────────────────────────────────────────────────────┘
```

#### 2.7.2 Microservices Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │    Auth     │    │    User     │    │    Role     │      │
│  │   Service   │    │   Service   │    │   Service   │      │
│  │             │    │             │    │             │      │
│  │ - Login     │    │ - Profile   │    │ - RBAC      │      │
│  │ - Register  │    │ - Settings  │    │ - Perms     │      │
│  │ - 2FA       │    │ - Avatar    │    │ - Assign    │      │
│  │ - OAuth     │    │ - Prefs     │    │ - Check     │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │    File     │    │    Email    │    │   Payment   │      │
│  │   Service   │    │   Service   │    │   Service   │      │
│  │             │    │             │    │             │      │
│  │ - Upload    │    │ - Templates │    │ - Stripe    │      │
│  │ - Resize    │    │ - Send      │    │ - Webhooks  │      │
│  │ - Storage   │    │ - Queue     │    │ - Billing   │      │
│  │ - CDN       │    │ - Track     │    │ - Invoices  │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Tehnička Dokumentacija

### 3.1 Struktura Projekta

#### 3.1.1 Mono-repo struktura
```
fullstack-auth-template/
├── README.md
├── package.json
├── lerna.json
├── .gitignore
├── .env.example
├── docker-compose.yml
├── docs/
│   ├── api/
│   ├── deployment/
│   ├── development/
│   └── user-guide/
├── packages/
│   ├── core/                    # Shared types, utilities
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── validation/
│   ├── backend/
│   │   ├── nodejs/              # Node.js/Express
│   │   ├── dotnet/              # C#/.NET
│   │   ├── java/                # Java/Spring
│   │   ├── python/              # Python/Django
│   │   └── laravel/             # PHP/Laravel
│   ├── frontend/
│   │   ├── react/               # React
│   │   ├── vue/                 # Vue.js
│   │   ├── angular/             # Angular
│   │   └── nextjs/              # Next.js
│   ├── mobile/
│   │   ├── flutter/             # Flutter
│   │   ├── react-native/        # React Native
│   │   ├── android/             # Kotlin/Android
│   │   └── ios/                 # Swift/iOS
│   └── infrastructure/
│       ├── docker/
│       ├── kubernetes/
│       ├── terraform/
│       └── scripts/
└── tools/
    ├── cli/                     # CLI tool za setup
    ├── generators/              # Code generators
    └── validators/              # Config validators
```

#### 3.1.2 Backend struktura (Node.js primjer)
```
packages/backend/nodejs/
├── src/
│   ├── config/                  # Configuration
│   │   ├── database.ts
│   │   ├── auth.ts
│   │   ├── email.ts
│   │   └── index.ts
│   ├── controllers/             # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── role.controller.ts
│   │   └── index.ts
│   ├── services/                # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── email.service.ts
│   │   └── index.ts
│   ├── models/                  # Data models
│   │   ├── user.model.ts
│   │   ├── role.model.ts
│   │   ├── session.model.ts
│   │   └── index.ts
│   ├── middleware/              # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── cors.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── index.ts
│   ├── routes/                  # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── admin.routes.ts
│   │   └── index.ts
│   ├── utils/                   # Utility functions
│   │   ├── jwt.util.ts
│   │   ├── crypto.util.ts
│   │   ├── validation.util.ts
│   │   └── index.ts
│   ├── types/                   # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   └── app.ts                   # Main application
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── migrations/                  # Database migrations
├── seeders/                     # Database seeders
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
└── README.md
```

### 3.2 Korištene Tehnologije

#### 3.2.1 Backend Technologies
```yaml
Node.js Stack:
  - Runtime: Node.js 20+
  - Framework: Express.js 4.x
  - Database ORM: Prisma / TypeORM
  - Authentication: Passport.js
  - Validation: Joi / Zod
  - Testing: Jest + Supertest
  - Documentation: Swagger/OpenAPI

.NET Stack:
  - Runtime: .NET 8.0
  - Framework: ASP.NET Core
  - Database ORM: Entity Framework Core
  - Authentication: Identity + JWT
  - Validation: FluentValidation
  - Testing: xUnit + Moq
  - Documentation: Swagger/OpenAPI

Java Stack:
  - Runtime: Java 21
  - Framework: Spring Boot 3.x
  - Database ORM: JPA/Hibernate
  - Authentication: Spring Security
  - Validation: Bean Validation
  - Testing: JUnit 5 + Mockito
  - Documentation: SpringDoc OpenAPI

Python Stack:
  - Runtime: Python 3.11+
  - Framework: Django 5.x / FastAPI
  - Database ORM: Django ORM / SQLAlchemy
  - Authentication: Django Auth / OAuth2
  - Validation: Pydantic
  - Testing: pytest + pytest-django
  - Documentation: DRF Spectacular

PHP Stack:
  - Runtime: PHP 8.2+
  - Framework: Laravel 10.x
  - Database ORM: Eloquent
  - Authentication: Laravel Sanctum
  - Validation: Laravel Validation
  - Testing: PHPUnit + Pest
  - Documentation: Scramble
```

#### 3.2.2 Frontend Technologies
```yaml
React Stack:
  - Runtime: Node.js 20+
  - Framework: React 18.x
  - State Management: Zustand / Redux Toolkit
  - Routing: React Router v6
  - UI Framework: Tailwind CSS + Headless UI
  - Forms: React Hook Form + Zod
  - HTTP Client: Axios / TanStack Query
  - Testing: Vitest + React Testing Library
  - Build Tool: Vite

Vue Stack:
  - Runtime: Node.js 20+
  - Framework: Vue 3.x
  - State Management: Pinia
  - Routing: Vue Router v4
  - UI Framework: Tailwind CSS + Headless UI
  - Forms: VeeValidate + Yup
  - HTTP Client: Axios / TanStack Query
  - Testing: Vitest + Vue Testing Library
  - Build Tool: Vite

Angular Stack:
  - Runtime: Node.js 20+
  - Framework: Angular 17.x
  - State Management: NgRx
  - Routing: Angular Router
  - UI Framework: Angular Material + Tailwind
  - Forms: Reactive Forms + Validators
  - HTTP Client: HttpClient
  - Testing: Jasmine + Karma / Jest
  - Build Tool: Angular CLI

Next.js Stack:
  - Runtime: Node.js 20+
  - Framework: Next.js 14.x
  - State Management: Zustand / Redux Toolkit
  - Styling: Tailwind CSS + CSS Modules
  - Forms: React Hook Form + Zod
  - HTTP Client: Axios / SWR
  - Testing: Jest + React Testing Library
  - Deployment: Vercel / Netlify
```

#### 3.2.3 Mobile Technologies
```yaml
Flutter Stack:
  - Runtime: Flutter 3.16+
  - Language: Dart 3.2+
  - State Management: Bloc / Riverpod
  - Navigation: GoRouter
  - UI Framework: Material 3 / Cupertino
  - HTTP Client: Dio
  - Local Storage: Hive / Isar
  - Testing: flutter_test
  - Build Tool: Flutter CLI

React Native Stack:
  - Runtime: Node.js 20+
  - Framework: React Native 0.73+
  - State Management: Zustand / Redux Toolkit
  - Navigation: React Navigation v6
  - UI Framework: NativeBase / React Native Elements
  - HTTP Client: Axios / React Query
  - Local Storage: AsyncStorage / MMKV
  - Testing: Jest + React Native Testing Library
  - Build Tool: Metro

Android Native Stack:
  - Runtime: Android SDK 34+
  - Language: Kotlin 1.9+
  - Architecture: MVVM + Clean Architecture
  - UI Framework: Jetpack Compose
  - HTTP Client: Retrofit + OkHttp
  - Local Storage: Room Database
  - Testing: JUnit + Espresso
  - Build Tool: Gradle

iOS Native Stack:
  - Runtime: iOS 16+
  - Language: Swift 5.9+
  - Architecture: MVVM + Combine
  - UI Framework: SwiftUI + UIKit
  - HTTP Client: URLSession + Alamofire
  - Local Storage: Core Data / SwiftData
  - Testing: XCTest
  - Build Tool: Xcode
```

#### 3.2.4 Database Technologies
```yaml
Primary Databases:
  - PostgreSQL 15+ (Recommended)
  - MySQL 8.0+
  - SQL Server 2022+
  - MongoDB 7.0+

Caching:
  - Redis 7.0+
  - Memcached 1.6+

Search:
  - Elasticsearch 8.0+
  - OpenSearch 2.0+

Message Queues:
  - RabbitMQ 3.12+
  - Apache Kafka 3.0+
  - AWS SQS
```

### 3.3 API Endpointi

#### 3.3.1 Authentication Endpoints
```yaml
POST /api/auth/register
  Description: Register new user
  Request Body:
    email: string (required)
    password: string (required, min 8 chars)
    firstName: string (required)
    lastName: string (required)
    termsAccepted: boolean (required)
  Response:
    201: User created successfully
    400: Validation error
    409: Email already exists

POST /api/auth/login
  Description: Login user
  Request Body:
    email: string (required)
    password: string (required)
    rememberMe: boolean (optional)
  Response:
    200: Login successful
    401: Invalid credentials
    423: Account locked

POST /api/auth/logout
  Description: Logout user
  Headers:
    Authorization: Bearer <token>
  Response:
    200: Logout successful
    401: Unauthorized

POST /api/auth/refresh
  Description: Refresh access token
  Request Body:
    refreshToken: string (required)
  Response:
    200: Token refreshed
    401: Invalid refresh token

POST /api/auth/forgot-password
  Description: Request password reset
  Request Body:
    email: string (required)
  Response:
    200: Reset email sent
    404: Email not found

POST /api/auth/reset-password
  Description: Reset password
  Request Body:
    token: string (required)
    password: string (required)
  Response:
    200: Password reset successful
    400: Invalid token

POST /api/auth/verify-email
  Description: Verify email address
  Request Body:
    token: string (required)
  Response:
    200: Email verified
    400: Invalid token

POST /api/auth/resend-verification
  Description: Resend verification email
  Request Body:
    email: string (required)
  Response:
    200: Verification email sent
    400: Email already verified

POST /api/auth/2fa/enable
  Description: Enable 2FA
  Headers:
    Authorization: Bearer <token>
  Response:
    200: 2FA enabled
    400: 2FA already enabled

POST /api/auth/2fa/verify
  Description: Verify 2FA code
  Headers:
    Authorization: Bearer <token>
  Request Body:
    code: string (required)
  Response:
    200: 2FA verified
    400: Invalid code

POST /api/auth/social/google
  Description: Google OAuth login
  Request Body:
    accessToken: string (required)
  Response:
    200: Login successful
    400: Invalid token

POST /api/auth/social/facebook
  Description: Facebook OAuth login
  Request Body:
    accessToken: string (required)
  Response:
    200: Login successful
    400: Invalid token

POST /api/auth/social/github
  Description: GitHub OAuth login
  Request Body:
    code: string (required)
  Response:
    200: Login successful
    400: Invalid code
```

#### 3.3.2 User Management Endpoints
```yaml
GET /api/users/profile
  Description: Get current user profile
  Headers:
    Authorization: Bearer <token>
  Response:
    200: User profile
    401: Unauthorized

PUT /api/users/profile
  Description: Update user profile
  Headers:
    Authorization: Bearer <token>
  Request Body:
    firstName: string (optional)
    lastName: string (optional)
    phone: string (optional)
    bio: string (optional)
  Response:
    200: Profile updated
    400: Validation error
    401: Unauthorized

POST /api/users/avatar
  Description: Upload user avatar
  Headers:
    Authorization: Bearer <token>
  Request Body:
    file: multipart/form-data (required)
  Response:
    200: Avatar uploaded
    400: Invalid file
    401: Unauthorized

DELETE /api/users/avatar
  Description: Delete user avatar
  Headers:
    Authorization: Bearer <token>
  Response:
    200: Avatar deleted
    401: Unauthorized

GET /api/users/settings
  Description: Get user settings
  Headers:
    Authorization: Bearer <token>
  Response:
    200: User settings
    401: Unauthorized

PUT /api/users/settings
  Description: Update user settings
  Headers:
    Authorization: Bearer <token>
  Request Body:
    notifications: object (optional)
    privacy: object (optional)
    preferences: object (optional)
  Response:
    200: Settings updated
    400: Validation error
    401: Unauthorized

POST /api/users/change-password
  Description: Change user password
  Headers:
    Authorization: Bearer <token>
  Request Body:
    currentPassword: string (required)
    newPassword: string (required)
  Response:
    200: Password changed
    400: Invalid current password
    401: Unauthorized

DELETE /api/users/account
  Description: Delete user account
  Headers:
    Authorization: Bearer <token>
  Request Body:
    password: string (required)
    reason: string (optional)
  Response:
    200: Account deleted
    400: Invalid password
    401: Unauthorized
```

#### 3.3.3 Admin Endpoints
```yaml
GET /api/admin/users
  Description: Get all users (paginated)
  Headers:
    Authorization: Bearer <token>
  Query Parameters:
    page: number (optional, default: 1)
    limit: number (optional, default: 10)
    search: string (optional)
    role: string (optional)
    status: string (optional)
  Response:
    200: Users list
    401: Unauthorized
    403: Insufficient permissions

GET /api/admin/users/:id
  Description: Get user by ID
  Headers:
    Authorization: Bearer <token>
  Parameters:
    id: string (required)
  Response:
    200: User details
    401: Unauthorized
    403: Insufficient permissions
    404: User not found

PUT /api/admin/users/:id
  Description: Update user
  Headers:
    Authorization: Bearer <token>
  Parameters:
    id: string (required)
  Request Body:
    firstName: string (optional)
    lastName: string (optional)
    email: string (optional)
    isActive: boolean (optional)
  Response:
    200: User updated
    400: Validation error
    401: Unauthorized
    403: Insufficient permissions
    404: User not found

DELETE /api/admin/users/:id
  Description: Delete user
  Headers:
    Authorization: Bearer <token>
  Parameters:
    id: string (required)
  Response:
    200: User deleted
    401: Unauthorized
    403: Insufficient permissions
    404: User not found

POST /api/admin/users/:id/roles
  Description: Assign role to user
  Headers:
    Authorization: Bearer <token>
  Parameters:
    id: string (required)
  Request Body:
    roleId: string (required)
  Response:
    200: Role assigned
    400: Role already assigned
    401: Unauthorized
    403: Insufficient permissions
    404: User or role not found

DELETE /api/admin/users/:id/roles/:roleId
  Description: Remove role from user
  Headers:
    Authorization: Bearer <token>
  Parameters:
    id: string (required)
    roleId: string (required)
  Response:
    200: Role removed
    401: Unauthorized
    403: Insufficient permissions
    404: User or role not found

GET /api/admin/roles
  Description: Get all roles
  Headers:
    Authorization: Bearer <token>
  Response:
    200: Roles list
    401: Unauthorized
    403: Insufficient permissions

POST /api/admin/roles
  Description: Create new role
  Headers:
    Authorization: Bearer <token>
  Request Body:
    name: string (required)
    description: string (optional)
    permissions: array (required)
  Response:
    201: Role created
    400: Validation error
    401: Unauthorized
    403: Insufficient permissions
    409: Role already exists

PUT /api/admin/roles/:id
  Description: Update role
  Headers:
    Authorization: Bearer <token>
  Parameters:
    id: string (required)
  Request Body:
    name: string (optional)
    description: string (optional)
    permissions: array (optional)
  Response:
    200: Role updated
    400: Validation error
    401: Unauthorized
    403: Insufficient permissions
    404: Role not found

DELETE /api/admin/roles/:id
  Description: Delete role
  Headers:
    Authorization: Bearer <token>
  Parameters:
    id: string (required)
  Response:
    200: Role deleted
    401: Unauthorized
    403: Insufficient permissions
    404: Role not found
    409: Role in use

GET /api/admin/analytics
  Description: Get system analytics
  Headers:
    Authorization: Bearer <token>
  Query Parameters:
    period: string (optional, default: '7d')
    metric: string (optional)
  Response:
    200: Analytics data
    401: Unauthorized
    403: Insufficient permissions
```

### 3.4 Sigurnosni Mehanizmi

#### 3.4.1 Authentication & Authorization
```typescript
// JWT Token Structure
interface JWTPayload {
  sub: string;           // User ID
  email: string;         // User email
  roles: string[];       // User roles
  permissions: string[]; // User permissions
  iat: number;          // Issued at
  exp: number;          // Expiration time
  jti: string;          // JWT ID
}

// Authentication Middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Check if token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(decoded.jti);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Authorization Middleware
export const authorize = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JWTPayload;
    
    const hasPermission = requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

#### 3.4.2 Role-Based Access Control (RBAC)
```typescript
// Permission System
interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

// Permission Checker
export class PermissionChecker {
  static hasPermission(
    userPermissions: string[],
    requiredPermission: string
  ): boolean {
    return userPermissions.includes(requiredPermission);
  }

  static hasAnyPermission(
    userPermissions: string[],
    requiredPermissions: string[]
  ): boolean {
    return requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );
  }

  static hasAllPermissions(
    userPermissions: string[],
    requiredPermissions: string[]
  ): boolean {
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
  }

  static canAccessResource(
    userPermissions: string[],
    resource: string,
    action: string
  ): boolean {
    const permissionKey = `${resource}:${action}`;
    return userPermissions.includes(permissionKey);
  }
}

// Default Roles and Permissions
export const DEFAULT_PERMISSIONS = {
  // User permissions
  'user:read': 'Read user profile',
  'user:update': 'Update user profile',
  'user:delete': 'Delete user account',
  
  // Admin permissions
  'admin:users:read': 'Read all users',
  'admin:users:create': 'Create new users',
  'admin:users:update': 'Update any user',
  'admin:users:delete': 'Delete any user',
  'admin:roles:read': 'Read all roles',
  'admin:roles:create': 'Create new roles',
  'admin:roles:update': 'Update any role',
  'admin:roles:delete': 'Delete any role',
  'admin:analytics:read': 'Read system analytics',
  
  // Super admin permissions
  'system:settings:read': 'Read system settings',
  'system:settings:update': 'Update system settings',
  'system:logs:read': 'Read system logs',
  'system:backup:create': 'Create system backup',
  'system:backup:restore': 'Restore system backup'
};

export const DEFAULT_ROLES = [
  {
    name: 'user',
    description: 'Standard user with basic permissions',
    permissions: [
      'user:read',
      'user:update',
      'user:delete'
    ]
  },
  {
    name: 'admin',
    description: 'Administrator with user management permissions',
    permissions: [
      'user:read',
      'user:update',
      'user:delete',
      'admin:users:read',
      'admin:users:create',
      'admin:users:update',
      'admin:users:delete',
      'admin:roles:read',
      'admin:analytics:read'
    ]
  },
  {
    name: 'super_admin',
    description: 'Super administrator with full system access',
    permissions: Object.keys(DEFAULT_PERMISSIONS)
  }
];
```

#### 3.4.3 Two-Factor Authentication (2FA)
```typescript
// 2FA Implementation
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

export class TwoFactorAuth {
  static generateSecret(userEmail: string): {
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
  } {
    const secret = speakeasy.generateSecret({
      name: userEmail,
      service: 'Your App Name',
      length: 32
    });

    const qrCodeUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: userEmail,
      service: 'Your App Name',
      encoding: 'base32'
    });

    const backupCodes = this.generateBackupCodes();

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes
    };
  }

  static async generateQRCode(qrCodeUrl: string): Promise<string> {
    return await QRCode.toDataURL(qrCodeUrl);
  }

  static verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });
  }

  static generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    return codes;
  }

  static async enable2FA(userId: string, secret: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: true
      }
    });
  }

  static async disable2FA(userId: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        twoFactorEnabled: false,
        backupCodes: []
      }
    });
  }
}

// 2FA Middleware
export const require2FA = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JWTPayload;
  
  const dbUser = await db.user.findUnique({
    where: { id: user.sub },
    select: { twoFactorEnabled: true }
  });

  if (dbUser?.twoFactorEnabled && !user.twoFactorVerified) {
    return res.status(403).json({ 
      error: 'Two-factor authentication required',
      code: 'REQUIRE_2FA'
    });
  }

  next();
};
```

#### 3.4.4 Rate Limiting
```typescript
// Rate Limiting Implementation
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// General API rate limiting
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'api_limit:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication rate limiting
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'auth_limit:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true
});

// Password reset rate limiting
export const passwordResetLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'reset_limit:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset attempts per hour
  message: 'Too many password reset attempts, please try again later'
});

// Email verification rate limiting
export const emailVerificationLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'verify_limit:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 verification emails per hour
  message: 'Too many verification emails sent, please try again later'
});
```

#### 3.4.5 Security Headers & CORS
```typescript
// Security Configuration
import helmet from 'helmet';
import cors from 'cors';

export const securityConfig = {
  // Helmet configuration
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),

  // CORS configuration
  cors: cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 hours
  })
};

// Input Validation
import Joi from 'joi';

export const validationSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    termsAccepted: Joi.boolean().valid(true).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    rememberMe: Joi.boolean().default(false)
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(new RegExp('^[+]?[1-9][\d]{0,15})),
    bio: Joi.string().max(500)
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
  })
};
```

### 3.5 Integracije

#### 3.5.1 Stripe Payment Integration
```typescript
// Stripe Configuration
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export class StripeService {
  // Create customer
  static async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    return await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'auth_template'
      }
    });
  }

  // Create subscription
  static async createSubscription(
    customerId: string,
    priceId: string,
    trialPeriodDays?: number
  ): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialPeriodDays,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent']
    });
  }

  // Handle webhooks
  static async handleWebhook(
    payload: string,
    signature: string
  ): Promise<void> {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private static async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    await db.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        user: {
          connect: {
            email: (customer as Stripe.Customer).email!
          }
        }
      }
    });
  }

  private static async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    await db.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });
  }

  private static async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    await db.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        canceledAt: new Date()
      }
    });
  }

  private static async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    await db.payment.create({
      data: {
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'succeeded',
        paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
        subscription: {
          connect: {
            stripeSubscriptionId: invoice.subscription as string
          }
        }
      }
    });
  }

  private static async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    await db.payment.create({
      data: {
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: 'failed',
        subscription: {
          connect: {
            stripeSubscriptionId: invoice.subscription as string
          }
        }
      }
    });
  }
}
```

### 3.5.2 Firebase Integration

```typescript
// Push Notifications Service
export class PushNotificationService {
  static async subscribeToTopic(token: string, topic: string): Promise<void> {
    await messaging.subscribeToTopic([token], topic);
  }

  static async unsubscribeFromTopic(token: string, topic: string): Promise<void> {
    await messaging.unsubscribeFromTopic([token], topic);
  }

  private static async getUserTokens(userId: string): Promise<string[]> {
    const userDoc = await db.collection('users').doc(userId).get();
    return userDoc.data()?.fcmTokens || [];
  }
}

// File Upload Service
export class FileUploadService {
  static async uploadAvatar(userId: string, file: File): Promise<string> {
    const storageRef = ref(storage, `avatars/${userId}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  static async deleteFile(filePath: string): Promise<void> {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  }
}
```

### 3.5.3 AWS S3 Integration

```typescript
// AWS S3 Configuration
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export class S3Service {
  static async uploadFile(
    bucket: string,
    key: string,
    file: Buffer,
    contentType: string
  ): Promise<string> {
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  }

  static async deleteFile(bucket: string, key: string): Promise<void> {
    const params = {
      Bucket: bucket,
      Key: key
    };

    await s3.deleteObject(params).promise();
  }

  static async generatePresignedUrl(
    bucket: string,
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expiresIn
    };

    return s3.getSignedUrl('getObject', params);
  }
}
```

### 3.5.4 SendGrid Email Integration

```typescript
// SendGrid Configuration
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export class EmailService {
  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL!,
      subject: 'Welcome to Your App',
      templateId: 'd-1234567890abcdef',
      dynamicTemplateData: {
        name,
        loginUrl: `${process.env.FRONTEND_URL}/login`
      }
    };

    await sgMail.send(msg);
  }

  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL!,
      subject: 'Password Reset Request',
      templateId: 'd-abcdef1234567890',
      dynamicTemplateData: {
        resetUrl,
        expirationTime: '1 hour'
      }
    };

    await sgMail.send(msg);
  }

  static async sendEmailVerification(email: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL!,
      subject: 'Please verify your email',
      templateId: 'd-fedcba0987654321',
      dynamicTemplateData: {
        verificationUrl
      }
    };

    await sgMail.send(msg);
  }
}
```

### 3.6 Database Schema

#### 3.6.1 PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    backup_codes TEXT[],
    last_login_at TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles (many-to-many)
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);

-- Role permissions (many-to-many)
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- User sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OAuth providers
CREATE TABLE oauth_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_id)
);

-- Subscriptions table (for paid features)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    plan_id VARCHAR(100),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    canceled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    stripe_invoice_id VARCHAR(255),
    amount INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(50) NOT NULL,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_oauth_providers_user_id ON oauth_providers(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

#### 3.6.2 Prisma Schema

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  emailVerified     Boolean   @default(false)
  emailVerifiedAt   DateTime?
  passwordHash      String
  firstName         String
  lastName          String
  phone             String?
  avatarUrl         String?
  bio               String?
  isActive          Boolean   @default(true)
  twoFactorEnabled  Boolean   @default(false)
  twoFactorSecret   String?
  backupCodes       String[]
  lastLoginAt       DateTime?
  loginAttempts     Int       @default(0)
  lockedUntil       DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  roles                     UserRole[]
  sessions                  UserSession[]
  passwordResetTokens       PasswordResetToken[]
  emailVerificationTokens   EmailVerificationToken[]
  oauthProviders           OAuthProvider[]
  subscriptions            Subscription[]
  auditLogs                AuditLog[]
  assignedRoles            UserRole[] @relation("AssignedBy")

  @@map("users")
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  users       UserRole[]
  permissions RolePermission[]

  @@map("roles")
}

model Permission {
  id          String   @id @default(cuid())
  name        String   @unique
  resource    String
  action      String
  description String?
  createdAt   DateTime @default(now())

  // Relations
  roles RolePermission[]

  @@map("permissions")
}

model UserRole {
  userId     String
  roleId     String
  assignedAt DateTime @default(now())
  assignedBy String?

  // Relations
  user     User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role     Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  assigner User? @relation("AssignedBy", fields: [assignedBy], references: [id])

  @@id([userId, roleId])
  @@map("user_roles")
}

model RolePermission {
  roleId       String
  permissionId String

  // Relations
  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
  @@map("role_permissions")
}

model UserSession {
  id         String    @id @default(cuid())
  userId     String
  tokenHash  String
  deviceInfo Json?
  ipAddress  String?
  userAgent  String?
  expiresAt  DateTime
  createdAt  DateTime  @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_sessions")
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("password_reset_tokens")
}

model EmailVerificationToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("email_verification_tokens")
}

model OAuthProvider {
  id           String    @id @default(cuid())
  userId       String
  provider     String
  providerId   String
  accessToken  String?
  refreshToken String?
  expiresAt    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerId])
  @@map("oauth_providers")
}

model Subscription {
  id                   String    @id @default(cuid())
  userId               String
  stripeSubscriptionId String?   @unique
  stripeCustomerId     String?
  status               String
  planId               String?
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  canceledAt           DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  // Relations
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  payments Payment[]

  @@map("subscriptions")
}

model Payment {
  id              String    @id @default(cuid())
  subscriptionId  String
  stripeInvoiceId String?
  amount          Int
  currency        String
  status          String
  paidAt          DateTime?
  createdAt       DateTime  @default(now())

  // Relations
  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  @@map("payments")
}

model AuditLog {
  id           String    @id @default(cuid())
  userId       String?
  action       String
  resourceType String?
  resourceId   String?
  oldValues    Json?
  newValues    Json?
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime  @default(now())

  // Relations
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("audit_logs")
}
```

---

## 4. Deployment Plan

### 4.1 CI/CD Pipeline Strategy

#### 4.1.1 GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
        backend: [node, dotnet, java, python, laravel]
    
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:${{ matrix.backend }}
      
      - name: Run E2E tests
        run: npm run test:e2e
```

#### 4.1.2 Multi-Stack Build Configuration
```yaml
# docker-compose.yml
version: '3.8'
services:
  # Frontend services
  react-app:
    build:
      context: ./frontend/react
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=${API_URL}
  
  angular-app:
    build:
      context: ./frontend/angular
      dockerfile: Dockerfile
    ports:
      - "4200:4200"
  
  # Backend services
  node-api:
    build:
      context: ./backend/node
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
  
  dotnet-api:
    build:
      context: ./backend/dotnet
      dockerfile: Dockerfile
    ports:
      - "5001:5001"
```

### 4.2 Environment Configuration

#### 4.2.1 Environment Variables Template
```bash
# .env.template
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/authdb
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Integration
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name

# Frontend URLs
FRONTEND_URL=http://localhost:3000
ADMIN_PANEL_URL=http://localhost:3001
```

#### 4.2.2 Environment-Specific Configurations

**Development Environment**
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: authdb_dev
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"
      - "8025:8025"
```

**Production Environment**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
  
  app:
    image: your-registry/fullstack-auth:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
      - redis
```

### 4.3 Platform-Specific Deployment

#### 4.3.1 Vercel Deployment
```json
{
  "name": "fullstack-auth-template",
  "version": 2,
  "builds": [
    {
      "src": "frontend/react/package.json",
      "use": "@vercel/node"
    },
    {
      "src": "backend/node/package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/node/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/react/index.html"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

#### 4.3.2 AWS Deployment
```yaml
# serverless.yml
service: fullstack-auth-template

provider:
  name: aws
  runtime: nodejs18.x
  stage: ${opt:stage, 'dev'}
  region: us-east-1
  
  environment:
    DATABASE_URL: ${env:DATABASE_URL}
    JWT_SECRET: ${env:JWT_SECRET}
  
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/*"

functions:
  api:
    handler: backend/node/lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true

resources:
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.stage}-users
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
```

#### 4.3.3 Render Deployment
```yaml
# render.yaml
services:
  - type: web
    name: fullstack-auth-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: authdb
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
        
  - type: web
    name: fullstack-auth-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./build
    
databases:
  - name: authdb
    databaseName: authdb
    user: authuser
```

### 4.4 Docker Configuration

#### 4.4.1 Multi-Stage Dockerfile for Node.js

```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY .. .

EXPOSE 5000

USER node

CMD ["npm", "start"]
```

#### 4.4.2 Frontend Dockerfile
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4.5 Monitoring and Logging

#### 4.5.1 Application Monitoring
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
  
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
  
  jaeger:
    image: jaegertracing/all-in-one
    ports:
      - "16686:16686"
      - "14268:14268"
```

#### 4.5.2 Logging Configuration
```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

---

## 5. Prijedlog za Testiranje i QA Proces

### 5.1 Testna Strategija

#### 5.1.1 Piramida Testiranja
```
    /\
   /  \
  / E2E \
 /______\
/        \
/Integration\
/____________\
/            \
/  Unit Tests  \
/________________\
```

**Raspodjela testova:**
- Unit Tests: 70%
- Integration Tests: 20%
- E2E Tests: 10%

#### 5.1.2 Testni Nivoi i Odgovornosti

**Unit Testing**
- Testiranje pojedinačnih funkcija i komponenti
- Pokrivanje: 90%+ code coverage
- Alati: Jest, Vitest, xUnit, PyTest

**Integration Testing**
- Testiranje komunikacije između komponenti
- API endpoint testiranje
- Database integration testiranje
- Alati: Supertest, TestContainers, Postman

**E2E Testing**
- Testiranje korisničkih scenarija
- Cross-browser testiranje
- Mobile responsive testiranje
- Alati: Cypress, Playwright, Selenium

### 5.2 Test Configuration

#### 5.2.1 Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'
  ]
};
```

#### 5.2.2 Cypress Configuration
```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    
    env: {
      apiUrl: 'http://localhost:5000/api',
      testUser: {
        email: 'test@example.com',
        password: 'testpassword123'
      }
    },
    
    setupNodeEvents(on, config) {
      // Database seeding
      on('task', {
        'db:seed': () => {
          // Seed test data
          return null;
        },
        'db:cleanup': () => {
          // Clean test data
          return null;
        }
      });
    }
  }
});
```

### 5.3 Test Scenarios

#### 5.3.1 Authentication Test Suite
```javascript
// tests/auth.test.js
describe('Authentication', () => {
  describe('User Registration', () => {
    test('should register user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        firstName: 'Test',
        lastName: 'User'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });
    
    test('should reject registration with weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
        firstName: 'Test',
        lastName: 'User'
      };
      
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });
  });
  
  describe('User Login', () => {
    test('should login with valid credentials', async () => {
      // Test implementation
    });
    
    test('should reject invalid credentials', async () => {
      // Test implementation
    });
    
    test('should handle rate limiting', async () => {
      // Test implementation
    });
  });
});
```

#### 5.3.2 E2E Test Scenarios
```javascript
// cypress/e2e/auth-flow.cy.js
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.task('db:cleanup');
    cy.visit('/');
  });
  
  it('should complete full registration flow', () => {
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="confirm-password-input"]').type('SecurePassword123!');
    cy.get('[data-testid="first-name-input"]').type('Test');
    cy.get('[data-testid="last-name-input"]').type('User');
    cy.get('[data-testid="submit-registration"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome, Test');
  });
  
  it('should handle 2FA setup', () => {
    cy.login('test@example.com', 'SecurePassword123!');
    cy.visit('/settings/security');
    cy.get('[data-testid="enable-2fa"]').click();
    cy.get('[data-testid="qr-code"]').should('be.visible');
    cy.get('[data-testid="backup-codes"]').should('be.visible');
  });
});
```

### 5.4 Performance Testing

#### 5.4.1 Load Testing with Artillery
```yaml
# artillery.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 5
    - duration: 120
      arrivalRate: 10
    - duration: 60
      arrivalRate: 20
  
scenarios:
  - name: "Authentication Flow"
    flow:
      - post:
          url: "/api/auth/register"
          json:
            email: "test{{ $randomNumber() }}@example.com"
            password: "SecurePassword123!"
            firstName: "Test"
            lastName: "User"
      - post:
          url: "/api/auth/login"
          json:
            email: "test{{ $randomNumber() }}@example.com"
            password: "SecurePassword123!"
```

#### 5.4.2 Database Performance Tests
```javascript
// tests/performance/database.test.js
describe('Database Performance', () => {
  test('should handle concurrent user queries', async () => {
    const promises = Array(100).fill().map(() => 
      User.findById('user-id')
    );
    
    const start = Date.now();
    await Promise.all(promises);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(1000); // Should complete within 1 second
  });
  
  test('should maintain performance with large datasets', async () => {
    // Create 10,000 test users
    const users = Array(10000).fill().map((_, i) => ({
      email: `user${i}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    }));
    
    await User.insertMany(users);
    
    const start = Date.now();
    const result = await User.find({ firstName: 'Test' }).limit(100);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(500);
    expect(result.length).toBe(100);
  });
});
```

### 5.5 Security Testing

#### 5.5.1 Security Test Suite
```javascript
// tests/security/security.test.js
describe('Security Tests', () => {
  describe('Input Validation', () => {
    test('should prevent SQL injection', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: maliciousInput, password: 'password' })
        .expect(400);
      
      expect(response.body.error).toContain('Invalid email format');
    });
    
    test('should prevent XSS attacks', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      
      const response = await request(app)
        .post('/api/users/profile')
        .send({ firstName: xssPayload })
        .expect(400);
      
      expect(response.body.error).toContain('Invalid characters');
    });
  });
  
  describe('Authentication Security', () => {
    test('should enforce rate limiting', async () => {
      const promises = Array(10).fill().map(() =>
        request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'wrong' })
      );
      
      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
```

### 5.6 QA Process Workflow

#### 5.6.1 Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:unit"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

#### 5.6.2 Test Execution Pipeline
```yaml
# .github/workflows/test.yml
name: Test Pipeline

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm run test:unit
      - name: Upload coverage
        uses: codecov/codecov-action@v3
  
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/testdb
  
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Start application
        run: npm start &
      - name: Wait for application
        run: npx wait-on http://localhost:3000
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

---

## 6. Modularna Struktura za Reusability

### 6.1 Monorepo Struktura

#### 6.1.1 Workspace Configuration
```json
{
  "name": "fullstack-auth-template",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@turbo/gen": "^1.10.0",
    "turbo": "^1.10.0"
  }
}
```

#### 6.1.2 Folder Structure
```
fullstack-auth-template/
├── apps/
│   ├── web-react/           # React frontend aplikacija
│   ├── web-angular/         # Angular frontend aplikacija
│   ├── web-vue/            # Vue.js frontend aplikacija
│   ├── web-nextjs/         # Next.js full-stack aplikacija
│   ├── mobile-flutter/     # Flutter mobile aplikacija
│   ├── mobile-react-native/ # React Native aplikacija
│   ├── api-node/           # Node.js backend API
│   ├── api-dotnet/         # .NET Core backend API
│   ├── api-java/           # Java Spring Boot API
│   ├── api-python/         # Python FastAPI/Django API
│   ├── api-laravel/        # Laravel PHP API
│   └── admin-panel/        # Admin panel aplikacija
├── packages/
│   ├── shared-types/       # TypeScript tipovi
│   ├── shared-utils/       # Utility funkcije
│   ├── shared-components/  # Reusable komponente
│   ├── auth-lib/          # Authentication biblioteka
│   ├── ui-kit/            # UI komponente
│   ├── api-client/        # API client biblioteka
│   └── config/            # Shared konfiguracije
├── tools/
│   ├── eslint-config/     # ESLint konfiguracija
│   ├── prettier-config/   # Prettier konfiguracija
│   ├── jest-config/       # Jest konfiguracija
│   └── scripts/           # Build i deployment skripte
├── docs/                  # Dokumentacija
├── docker/               # Docker konfiguracije
├── k8s/                  # Kubernetes manifesti
├── terraform/            # Infrastructure as Code
└── .github/              # GitHub Actions workflows
```

### 6.2 Shared Packages

#### 6.2.1 Shared Types Package
```typescript
// packages/shared-types/src/index.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  GITHUB = 'github',
  FACEBOOK = 'facebook'
}
```

#### 6.2.2 Authentication Library
```typescript
// packages/auth-lib/src/index.ts
import { User, AuthTokens } from '@fullstack-auth/shared-types';

export class AuthService {
  private apiUrl: string;
  private tokenStorage: TokenStorage;
  
  constructor(config: AuthConfig) {
    this.apiUrl = config.apiUrl;
    this.tokenStorage = config.tokenStorage || new LocalTokenStorage();
  }
  
  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const tokens = await response.json();
    await this.tokenStorage.setTokens(tokens);
    
    return tokens;
  }
  
  async register(userData: RegisterData): Promise<AuthTokens> {
    const response = await fetch(`${this.apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const tokens = await response.json();
    await this.tokenStorage.setTokens(tokens);
    
    return tokens;
  }
  
  async logout(): Promise<void> {
    await this.tokenStorage.clearTokens();
  }
  
  async getCurrentUser(): Promise<User | null> {
    const tokens = await this.tokenStorage.getTokens();
    if (!tokens) return null;
    
    const response = await fetch(`${this.apiUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
    });
    
    if (!response.ok) return null;
    
    return response.json();
  }
  
  async refreshToken(): Promise<AuthTokens> {
    const tokens = await this.tokenStorage.getTokens();
    if (!tokens) throw new Error('No refresh token available');
    
    const response = await fetch(`${this.apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const newTokens = await response.json();
    await this.tokenStorage.setTokens(newTokens);
    
    return newTokens;
  }
}

export interface AuthConfig {
  apiUrl: string;
  tokenStorage?: TokenStorage;
}

export interface TokenStorage {
  setTokens(tokens: AuthTokens): Promise<void>;
  getTokens(): Promise<AuthTokens | null>;
  clearTokens(): Promise<void>;
}

export class LocalTokenStorage implements TokenStorage {
  async setTokens(tokens: AuthTokens): Promise<void> {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }
  
  async getTokens(): Promise<AuthTokens | null> {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored) : null;
  }
  
  async clearTokens(): Promise<void> {
    localStorage.removeItem('auth_tokens');
  }
}
```

#### 6.2.3 UI Kit Package
```typescript
// packages/ui-kit/src/components/Button.tsx
import React from 'react';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

// packages/ui-kit/src/components/Input.tsx
import React from 'react';
import { InputProps } from './Input.types';

export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  ...props
}) => {
  const inputClasses = `
    block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// packages/ui-kit/src/components/Modal.tsx
import React from 'react';
import { ModalProps } from './Modal.types';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div className={`inline-block w-full ${sizeClasses[size]} transform rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:p-6 sm:align-middle`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
```

### 6.3 Framework-Specific Implementations

#### 6.3.1 React Implementation
```typescript
// apps/web-react/src/hooks/useAuth.ts
import { useState, useEffect, useContext, createContext } from 'react';
import { AuthService } from '@fullstack-auth/auth-lib';
import { User } from '@fullstack-auth/shared-types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const authService = new AuthService({
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    const user = await authService.getCurrentUser();
    setUser(user);
  };

  const register = async (userData: RegisterData) => {
    await authService.register(userData);
    const user = await authService.getCurrentUser();
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### 6.3.2 Angular Implementation
```typescript
// apps/web-angular/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService as BaseAuthService } from '@fullstack-auth/auth-lib';
import { User } from '@fullstack-auth/shared-types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private authService: BaseAuthService;

  public user$ = this.userSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public isAuthenticated$ = this.user$.pipe(
    map(user => !!user)
  );

  constructor() {
    this.authService = new BaseAuthService({
      apiUrl: environment.apiUrl
    });
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser();
      this.userSubject.next(user);
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async login(email: string, password: string): Promise<void> {
    await this.authService.login(email, password);
    const user = await this.authService.getCurrentUser();
    this.userSubject.next(user);
  }

  async register(userData: any): Promise<void> {
    await this.authService.register(userData);
    const user = await this.authService.getCurrentUser();
    this.userSubject.next(user);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.userSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
```

#### 6.3.3 Vue.js Implementation
```typescript
// apps/web-vue/src/composables/useAuth.ts
import { ref, computed, onMounted } from 'vue';
import { AuthService } from '@fullstack-auth/auth-lib';
import { User } from '@fullstack-auth/shared-types';

const user = ref<User | null>(null);
const loading = ref(true);

const authService = new AuthService({
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value);

  const initializeAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      user.value = currentUser;
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    const currentUser = await authService.getCurrentUser();
    user.value = currentUser;
  };

  const register = async (userData: any) => {
    await authService.register(userData);
    const currentUser = await authService.getCurrentUser();
    user.value = currentUser;
  };

  const logout = async () => {
    await authService.logout();
    user.value = null;
  };

  onMounted(() => {
    initializeAuth();
  });

  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    login,
    register,
    logout
  };
};
```

### 6.4 Backend API Standardization

#### 6.4.1 API Response Format
```typescript
// packages/shared-types/src/api.ts
export interface StandardResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T = any> extends StandardResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

#### 6.4.2 Middleware Pattern
```typescript
// packages/shared-utils/src/middleware/auth.ts
export interface AuthMiddleware {
  authenticate(req: any, res: any, next: any): Promise<void>;
  authorize(roles: string[]): (req: any, res: any, next: any) => Promise<void>;
}

// Node.js Implementation
export class NodeAuthMiddleware implements AuthMiddleware {
  async authenticate(req: any, res: any, next: any): Promise<void> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' }
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
      });
    }
  }
  
  authorize(roles: string[]) {
    return async (req: any, res: any, next: any) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
        });
      }
      
      next();
    };
  }
}
```

### 6.5 Configuration Management

#### 6.5.1 Environment Configuration
```typescript
// packages/config/src/index.ts
export interface AppConfig {
  port: number;
  database: DatabaseConfig;
  jwt: JwtConfig;
  oauth: OAuthConfig;
  email: EmailConfig;
  storage: StorageConfig;
  redis: RedisConfig;
}

export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
}

export const createConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.PORT || '5000'),
    database: {
      url: process.env.DATABASE_URL || '',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'authdb',
      ssl: process.env.DB_SSL === 'true'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    },
    oauth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
      }
    },
    email: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    storage: {
      provider: process.env.STORAGE_PROVIDER || 'local',
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        region: process.env.AWS_REGION || 'us-east-1',
        bucket: process.env.AWS_S3_BUCKET || ''
      }
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || ''
    }
  };
};
```

### 6.6 Build and Development Tools

#### 6.6.1 Turbo Configuration
```json
{
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:unit": {
      "dependsOn": ["^build"]
    },
    "test:integration": {
      "dependsOn": ["^build"]
    },
    "test:e2e": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### 6.6.2 Development Scripts
```json
{
  "scripts": {
    "dev:react": "turbo run dev --filter=web-react",
    "dev:angular": "turbo run dev --filter=web-angular",
    "dev:vue": "turbo run dev --filter=web-vue",
    "dev:nextjs": "turbo run dev --filter=web-nextjs",
    "dev:node": "turbo run dev --filter=api-node",
    "dev:dotnet": "turbo run dev --filter=api-dotnet",
    "dev:java": "turbo run dev --filter=api-java",
    "dev:python": "turbo run dev --filter=api-python",
    "dev:laravel": "turbo run dev --filter=api-laravel",
    "dev:full-stack": "turbo run dev --filter=web-react --filter=api-node --parallel",
    "build:all": "turbo run build",
    "test:all": "turbo run test",
    "lint:all": "turbo run lint",
    "type-check:all": "turbo run type-check",
    "clean:all": "turbo run clean"
  }
}
```

### 6.7 Template Generation

#### 6.7.1 Template Generator Script
```typescript
// tools/scripts/generate-template.ts
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface TemplateConfig {
  name: string;
  frontend: 'react' | 'angular' | 'vue' | 'nextjs';
  backend: 'node' | 'dotnet' | 'java' | 'python' | 'laravel';
  mobile?: 'flutter' | 'react-native' | 'kotlin' | 'swift';
  database: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';
  features: string[];
}

export class TemplateGenerator {
  constructor(private config: TemplateConfig) {}

  async generate(): Promise<void> {
    console.log(`Generating template: ${this.config.name}`);
    
    // Create project structure
    this.createProjectStructure();
    
    // Copy base files
    this.copyBaseFiles();
    
    // Generate frontend
    await this.generateFrontend();
    
    // Generate backend
    await this.generateBackend();
    
    // Generate mobile (if specified)
    if (this.config.mobile) {
      await this.generateMobile();
    }
    
    // Generate database configuration
    this.generateDatabaseConfig();
    
    // Generate Docker configuration
    this.generateDockerConfig();
    
    // Install dependencies
    await this.installDependencies();
    
    console.log(`Template generated successfully: ${this.config.name}`);
  }

  private createProjectStructure(): void {
    const dirs = [
      this.config.name,
      `${this.config.name}/apps`,
      `${this.config.name}/packages`,
      `${this.config.name}/tools`,
      `${this.config.name}/docs`,
      `${this.config.name}/docker`,
      `${this.config.name}/.github/workflows`
    ];

    dirs.forEach(dir => {
      mkdirSync(dir, { recursive: true });
    });
  }

  private async generateFrontend(): Promise<void> {
    const frontendGenerators = {
      react: () => this.generateReactApp(),
      angular: () => this.generateAngularApp(),
      vue: () => this.generateVueApp(),
      nextjs: () => this.generateNextjsApp()
    };

    await frontendGenerators[this.config.frontend]();
  }

  private async generateBackend(): Promise<void> {
    const backendGenerators = {
      node: () => this.generateNodeAPI(),
      dotnet: () => this.generateDotnetAPI(),
      java: () => this.generateJavaAPI(),
      python: () => this.generatePythonAPI(),
      laravel: () => this.generateLaravelAPI()
    };

    await backendGenerators[this.config.backend]();
  }

  private generateReactApp(): void {
    const appPath = join(this.config.name, 'apps', 'web-react');
    execSync(`npx create-react-app ${appPath} --template typescript`);
    
    // Add custom configurations
    this.addReactCustomizations(appPath);
  }

  private generateNodeAPI(): void {
    const apiPath = join(this.config.name, 'apps', 'api-node');
    mkdirSync(apiPath, { recursive: true });
    
    // Generate package.json
    const packageJson = {
      name: "api-node",
      version: "1.0.0",
      scripts: {
        start: "node dist/index.js",
        dev: "nodemon src/index.ts",
        build: "tsc",
        test: "jest"
      },
      dependencies: {
        express: "^4.18.2",
        "@types/express": "^4.17.17",
        typescript: "^5.0.0",
        "@fullstack-auth/shared-types": "workspace:*",
        "@fullstack-auth/auth-lib": "workspace:*"
      }
    };
    
    writeFileSync(
      join(apiPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }
}

// Usage example
const generator = new TemplateGenerator({
  name: 'my-auth-app',
  frontend: 'react',
  backend: 'node',
  mobile: 'react-native',
  database: 'postgresql',
  features: ['2fa', 'oauth', 'rbac', 'payments']
});

generator.generate().catch(console.error);
```

### 6.8 Documentation Generation

#### 6.8.1 API Documentation Generator
```typescript
// tools/scripts/generate-docs.ts
import { writeFileSync } from 'fs';
import { join } from 'path';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: Parameter[];
  responses: Response[];
  authentication?: boolean;
  authorization?: string[];
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Response {
  status: number;
  description: string;
  example?: any;
}

export class DocumentationGenerator {
  private endpoints: APIEndpoint[] = [];

  addEndpoint(endpoint: APIEndpoint): void {
    this.endpoints.push(endpoint);
  }

  generateMarkdown(): string {
    let markdown = `# API Documentation\n\n`;
    
    this.endpoints.forEach(endpoint => {
      markdown += `## ${endpoint.method.toUpperCase()} ${endpoint.path}\n\n`;
      markdown += `${endpoint.description}\n\n`;
      
      if (endpoint.authentication) {
        markdown += `**Authentication:** Required\n\n`;
      }
      
      if (endpoint.authorization) {
        markdown += `**Authorization:** ${endpoint.authorization.join(', ')}\n\n`;
      }
      
      if (endpoint.parameters) {
        markdown += `### Parameters\n\n`;
        markdown += `| Name | Type | Required | Description |\n`;
        markdown += `|------|------|----------|-------------|\n`;
        
        endpoint.parameters.forEach(param => {
          markdown += `| ${param.name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description} |\n`;
        });
        
        markdown += `\n`;
      }
      
      markdown += `### Responses\n\n`;
      endpoint.responses.forEach(response => {
        markdown += `**${response.status}** - ${response.description}\n\n`;
        
        if (response.example) {
          markdown += `\`\`\`json\n${JSON.stringify(response.example, null, 2)}\n\`\`\`\n\n`;
        }
      });
      
      markdown += `---\n\n`;
    });
    
    return markdown;
  }

  generateOpenAPI(): object {
    const openAPI = {
      openapi: '3.0.0',
      info: {
        title: 'Fullstack Auth API',
        version: '1.0.0',
        description: 'Authentication and User Management API'
      },
      servers: [
        {
          url: 'http://localhost:5000/api',
          description: 'Development server'
        }
      ],
      paths: {},
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    };

    this.endpoints.forEach(endpoint => {
      if (!openAPI.paths[endpoint.path]) {
        openAPI.paths[endpoint.path] = {};
      }
      
      openAPI.paths[endpoint.path][endpoint.method.toLowerCase()] = {
        summary: endpoint.description,
        security: endpoint.authentication ? [{ BearerAuth: [] }] : [],
        responses: endpoint.responses.reduce((acc, response) => {
          acc[response.status] = {
            description: response.description,
            content: response.example ? {
              'application/json': {
                example: response.example
              }
            } : undefined
          };
          return acc;
        }, {})
      };
    });

    return openAPI;
  }

  saveDocumentation(outputPath: string): void {
    const markdown = this.generateMarkdown();
    const openAPI = this.generateOpenAPI();
    
    writeFileSync(join(outputPath, 'api-docs.md'), markdown);
    writeFileSync(join(outputPath, 'openapi.json'), JSON.stringify(openAPI, null, 2));
  }
}
```

### 6.9 Zaključak

Ovaj kompletni deployment plan, QA proces i modularna struktura omogućavaju:

1. **Skalabilnost** - Lako dodavanje novih tehnologija i funkcionalnosti
2. **Maintainability** - Jasna struktura i odvojene odgovornosti
3. **Reusability** - Zajedničke komponente i biblioteke
4. **Flexibilnost** - Mogućnost korišćenja različitih kombinacija tehnologija
5. **Kvalitet** - Komprehenzivno testiranje i QA procesi
6. **Deployment** - Automatizovani CI/CD pipeline i podrška za različite platforme

Template je dizajniran da bude produkcijski spreman i da omogući timovima brzu implementaciju autentifikacije i upravljanja korisnicima u bilo kojoj kombinaciji tehnologija.