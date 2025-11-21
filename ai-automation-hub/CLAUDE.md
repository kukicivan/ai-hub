# CLAUDE.md - AI Assistant Guide

This document provides essential information for AI assistants working with the AI Automation Productivity Hub codebase.

## Development Environment

- **Platform**: Windows
- **IDE**: VS Code with Claude Code extension (Pro account)
- **Version Control**: GitLab
- **Containerization**: Docker Desktop for Windows

## Project Overview

AI Automation Productivity Hub is a full-stack business automation platform that consolidates communication, project management, and AI-powered insights. The system features email management with Gmail integration, AI-driven analysis (OpenAI/Groq), and intelligent automation workflows.

## Project Locations (Windows)

The project consists of three separate repositories:

```
C:\Users\Kule\Development\Projects\
├── ai-automation-hub\              # Main project repo (this file)
│   ├── CLAUDE.md                   # This guide
│   └── README.md                   # Project SRS document
│
├── APIs\
│   └── messaging-gateway\          # Backend Laravel application
│       ├── src\                    # Laravel source (Docker volume)
│       ├── .docker\                # Docker configurations
│       ├── docker-compose.yml      # Container orchestration
│       └── Makefile                # Development commands
│
└── Web\
    └── messaging-front\            # Frontend React application
        ├── src\                    # React source (Docker volume)
        ├── .docker\                # Docker configurations
        ├── vite.config.ts          # Vite configuration
        └── package.json            # Dependencies
```

## Tech Stack

### Frontend (`messaging-front`)
- **Framework**: React 19 + TypeScript 5.2
- **Build Tool**: Vite 5.3
- **State Management**: Redux Toolkit + RTK Query
- **UI Components**: Shadcn/ui + Radix UI + Tailwind CSS 3.4
- **Testing**: Jest 30 + React Testing Library + MSW
- **Validation**: Zod + React Hook Form
- **Container**: Docker with volume mapping

### Backend (`messaging-gateway`)
- **Framework**: Laravel 12 (PHP 8.3)
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Authentication**: JWT (tymon/jwt-auth)
- **Testing**: PHPUnit 11.5
- **Container**: Docker with volume mapping

## Repository Structure

### Backend (`C:\Users\Kule\Development\Projects\APIs\messaging-gateway`)
```
messaging-gateway\
├── src\                           # Laravel application (Docker volume)
│   ├── app\
│   │   ├── Http\Controllers\Api\  # API controllers
│   │   ├── Models\                # Eloquent models
│   │   ├── Services\              # Business logic
│   │   └── Jobs\                  # Queue jobs
│   ├── database\                  # Migrations, seeders, factories
│   ├── routes\api.php             # API route definitions
│   ├── config\                    # Configuration files
│   └── tests\                     # PHPUnit tests
├── .docker\                       # Docker configurations (nginx, php, mysql, redis)
├── docker-compose.yml             # Container orchestration
├── Makefile                       # Development commands
└── docs\                          # Backend documentation
```

### Frontend (`C:\Users\Kule\Development\Projects\Web\messaging-front`)
```
messaging-front\
├── src\                           # React source (Docker volume)
│   ├── components\                # React components (ui/, core/, feature-based)
│   ├── pages\                     # Page components (Login, Register, Profile)
│   ├── redux\                     # Redux store, slices, RTK Query APIs
│   ├── routes\                    # Route definitions and guards
│   ├── hooks\                     # Custom React hooks
│   ├── utils\                     # Utility functions
│   ├── types\                     # TypeScript type definitions
│   └── __tests__\                 # Jest tests with MSW mocks
├── .docker\                       # Docker configurations
├── docs\                          # Frontend documentation
├── vite.config.ts                 # Vite configuration
├── jest.config.cjs                # Jest configuration
└── package.json                   # Dependencies and scripts
```

## Quick Start (Windows)

### Backend Setup
```powershell
cd C:\Users\Kule\Development\Projects\APIs\messaging-gateway
copy src\.env.example src\.env
make install    # Build containers, install deps, run migrations
make start      # Start all containers
```

### Frontend Setup
```powershell
cd C:\Users\Kule\Development\Projects\Web\messaging-front
yarn install
yarn dev        # Start dev server on port 5173
```

### Service URLs
- **Frontend**: http://localhost:5173 or https://local.do-my-booking.com:5173
- **Backend API**: http://localhost:9001/api
- **MySQL**: localhost:3306 (backend_db container)
- **Redis**: localhost:6379 (backend_redis container)

## Key Commands

### Frontend (in `messaging-front` directory)
| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn test` | Run Jest tests |
| `yarn test:coverage` | Generate coverage report |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Auto-fix linting issues |
| `yarn format` | Format with Prettier |

### Backend via Makefile (in `messaging-gateway` directory)
| Command | Description |
|---------|-------------|
| `make install` | First-time setup |
| `make start` | Start Docker containers |
| `make stop` | Stop containers |
| `make test` | Run PHPUnit tests |
| `make ssh` | SSH into PHP container |
| `make logs` | View container logs |
| `make artisan cmd="..."` | Run artisan commands |
| `make composer cmd="..."` | Run composer commands |

### Direct Docker Commands (Windows PowerShell)
```powershell
docker compose exec backend_app php artisan test
docker compose exec backend_app php artisan migrate
docker compose exec backend_app php artisan tinker
```

## Architecture Patterns

### Frontend Patterns

**State Management (Redux Toolkit)**
```typescript
// Feature-based structure in redux/features/
// RTK Query for API calls in redux/api/
// baseApi.ts handles auth token injection and refresh
```

**Component Organization**
- `components/ui/` - Reusable Shadcn/ui components
- `components/core/` - Layout components (Sidebar, etc.)
- `components/[feature]/` - Feature-specific components
- `pages/` - Route-level page components

**Route Guards**
- `RequireAuth` - Protects authenticated routes
- `RedirectIfAuthenticated` - Redirects logged-in users from auth pages

### Backend Patterns

**Layered Architecture**
```
Controllers → Services → Models → Database
```

**API Controllers** (`app/Http/Controllers/Api/`)
- `AuthController` - Authentication (login, register, logout, refresh)
- `EmailController` / `EmailControllerV5` - Email management
- `UserProfileController` - User profile operations
- `HealthCheckController` - Health checks

**Key Models** (`app/Models/`)
- `User` - User accounts
- `MessagingChannel` - Email channels/accounts
- `MessagingMessage` - Individual messages
- `MessageThread` - Threaded conversations
- `MessagingAttachment`, `MessagingLabel`, `MessagingHeader`

## API Endpoints

### Authentication
```
POST   /api/auth/login      # Login, returns JWT
POST   /api/auth/register   # Register new user
POST   /api/auth/logout     # Logout (invalidate token)
POST   /api/auth/refresh    # Refresh JWT token
GET    /api/auth/me         # Get current user
```

### Email Management
```
GET    /api/emails          # List emails
GET    /api/emails/{id}     # Get email details
POST   /api/sync/mail       # Trigger email sync
```

### Health
```
GET    /api/health          # Health check endpoint
```

## Testing

### Frontend Tests
```powershell
cd C:\Users\Kule\Development\Projects\Web\messaging-front
yarn test                    # Run all tests
yarn test:watch              # Watch mode
yarn test:coverage           # Coverage report
```

**Test Location**: `src\__tests__\`
- Uses MSW for API mocking (`utils/mock-server.ts`)
- Test utilities in `utils/test-utils.tsx`
- Setup file: `setup.ts`

### Backend Tests
```powershell
cd C:\Users\Kule\Development\Projects\APIs\messaging-gateway
make test                    # Run PHPUnit
docker compose exec backend_app php artisan test --filter=AuthTest
docker compose exec backend_app php artisan test --coverage
```

**Test Location**: `src\tests\`
- `Feature\` - Integration tests
- `Unit\` - Unit tests
- Uses SQLite in-memory for test database

## Environment Configuration

### Backend Required Variables (`messaging-gateway\src\.env`)
```env
# Application
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:9001

# Database
DB_HOST=backend_db
DB_DATABASE=backend_laravel
DB_USERNAME=backend_admin
DB_PASSWORD=backend_pass_2025

# JWT Authentication
JWT_SECRET=[generated]
JWT_TTL=15                    # Access token TTL in minutes
JWT_REFRESH_TTL=20160         # Refresh token TTL (14 days)

# Frontend CORS
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=local.do-my-booking.com:5173

# AI Services (optional)
AI_ENABLED=false
OPENAI_API_KEY=sk-proj-...
GROQ_API_KEY=gsk_...

# Gmail Integration
GMAIL_ENABLED=true
GMAIL_API_KEY=[configured]
```

## Code Style

### Frontend
- **ESLint** + **Prettier** for formatting
- **TypeScript strict mode** enabled
- **Path alias**: `@/` maps to `./src/`
- Component files: PascalCase (e.g., `LoginForm.tsx`)
- Hooks: camelCase with `use` prefix
- Types: PascalCase (e.g., `UserState`)

### Backend
- **PSR-12** coding standard
- **Laravel Pint** for formatting
- Controllers: PascalCase + "Controller"
- Models: PascalCase singular
- Database tables: snake_case plural
- Routes: lowercase with hyphens

## Common Tasks

### Adding a New API Endpoint

**Backend (in `messaging-gateway`):**
1. Create/update controller in `src\app\Http\Controllers\Api\`
2. Add route in `src\routes\api.php`
3. Create request validation if needed
4. Add resource class for response formatting

**Frontend (in `messaging-front`):**
1. Add endpoint in `src\redux\api\` using RTK Query
2. Export hooks from the API slice
3. Use hooks in components

### Adding a New Page

1. Create page component in `messaging-front\src\pages\`
2. Add route in `messaging-front\src\routes\routes.tsx`
3. Add navigation link if needed

### Database Changes

```powershell
cd C:\Users\Kule\Development\Projects\APIs\messaging-gateway

# Create migration
make artisan cmd="make:migration create_table_name"

# Run migrations
make artisan cmd="migrate"

# Rollback
make artisan cmd="migrate:rollback"
```

## Important Files

### Frontend (`messaging-front`)
| File | Purpose |
|------|---------|
| `src\redux\api\baseApi.ts` | Base RTK Query config with auth |
| `src\redux\store.ts` | Redux store configuration |
| `src\routes\routes.tsx` | Route definitions |

### Backend (`messaging-gateway`)
| File | Purpose |
|------|---------|
| `src\routes\api.php` | API route definitions |
| `src\config\jwt.php` | JWT configuration |
| `src\config\cors.php` | CORS settings |
| `docker-compose.yml` | Docker services |
| `Makefile` | Development commands |

## Documentation

- **Frontend**: `messaging-front\docs\` - API docs, development guides
- **Backend**: `messaging-gateway\docs\` - Architecture, implementation notes
- **Project SRS**: `ai-automation-hub\README.md` - Software requirements specification

## Docker Volume Mapping

Both frontend and backend use Docker volumes for development:

### Backend Container (`backend_app`)
- Host: `C:\Users\Kule\Development\Projects\APIs\messaging-gateway\src`
- Container: `/var/www`

### Frontend Container
- Host: `C:\Users\Kule\Development\Projects\Web\messaging-front\src`
- Container: Mapped to container's working directory

## Troubleshooting

### Common Issues

**CORS errors**: Check `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS` in backend `.env`

**JWT token issues**: Ensure `JWT_SECRET` is set; try `make artisan cmd="jwt:secret"`

**Database connection**: Verify containers are running with `make logs`

**Port conflicts**: Default ports are 5173 (frontend), 9001 (backend), 3306 (MySQL)

**Docker on Windows**: Ensure Docker Desktop is running and WSL 2 backend is enabled

### Useful Debug Commands (PowerShell)
```powershell
# Check container status
docker compose ps

# View backend logs (in messaging-gateway directory)
make logs

# Clear Laravel cache
make artisan cmd="config:clear && cache:clear"

# Check routes
make artisan cmd="route:list"

# Restart containers
docker compose restart
```

## Working with Multiple Repositories

When making changes that span both frontend and backend:

1. **Backend changes first**: Update API endpoints, models, migrations
2. **Test backend**: Verify API works with Postman or curl
3. **Frontend changes**: Update RTK Query endpoints and components
4. **Integration test**: Test full flow in browser

### Git Workflow (GitLab)
```powershell
# Backend
cd C:\Users\Kule\Development\Projects\APIs\messaging-gateway
git status
git add .
git commit -m "feat: description"
git push origin branch-name

# Frontend
cd C:\Users\Kule\Development\Projects\Web\messaging-front
git status
git add .
git commit -m "feat: description"
git push origin branch-name
```
