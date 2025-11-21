# React Frontend Application

A modern, scalable React application with authentication, user management, and dashboard features built for startups and enterprise applications.

## ⚡ Tech Stack

- **React 18** - A JavaScript library for building user interfaces
- **TypeScript** - Static type-checking for JavaScript
- **Redux Toolkit** - State management solution
- **RTK Query** - Powerful data fetching and caching
- **Shadcn/ui** - Beautifully designed components
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next Generation Frontend Tooling
- **Docker** - Containerization platform

## 🚀 Quick Start

### System Requirements

- Docker and Docker Compose installed
- Git installed
- Node.js 18+ (for local development)

### Running the Application

#### 1. Clone the repository

```bash
git clone git@gitlab.com:tech-talent-connect/frontend-react.git
cd frontend-react
```

#### 2. Set up local environment

```bash
# Add custom domain to hosts file (requires sudo)
echo '127.0.0.1   local.do-my-booking.com' | sudo tee -a /etc/hosts
```

#### 3. Start the application

```bash
./start-docker.sh
```

The script will:
- Set up the Docker environment
- Start all required services
- Configure HTTPS automatically
- Launch the application

#### 4. Access the application

- Open https://local.do-my-booking.com:5173 in your browser
- Accept the security warning for the development certificate

#### 5. Login credentials

```
Email: admin@example.com
Password: password
```

#### 6. Vercel deployment URL

https://frontend-react-ten-beta.vercel.app

That's it! 🎉

## 🔧 Development

### Local Development (without Docker)

```bash
# Install dependencies
yarn install

# Start development server
yarn run dev

# Run tests
yarn run test

# Build for production
yarn run build
```

### Available Scripts

```bash
yarn run dev          # Start development server
yarn run build        # Build for production
yarn run test         # Run test suite
yarn run test:watch   # Run tests in watch mode
yarn run test:coverage # Run tests with coverage
yarn run lint         # Run ESLint
yarn run lint:fix     # Fix linting issues
yarn run format       # Format code with Prettier
```

### Docker Commands

```bash
yarn run docker:setup  # Initial Docker setup
yarn run docker:build  # Build Docker images
yarn run docker:up     # Start containers
yarn run docker:down   # Stop containers
yarn run docker:logs   # View container logs
yarn run docker:clean  # Clean up containers and images
```

## 🛡️ Authentication & Security

### Current Setup
- **Laravel Sanctum** - Session-based authentication
- **CSRF Protection** - Cross-site request forgery protection
- **SSL/HTTPS** - Secure local development environment
- **TypeScript** - Type safety throughout the application

### Security Features
- Protected routes with authentication guards
- CSRF token management
- Secure session handling
- Input validation with Zod schemas
- XSS protection

## 🧪 Testing

The application includes comprehensive testing setup:

- **Unit Tests** - Component and utility testing
- **Integration Tests** - Authentication flow testing
- **Mock Server** - MSW for API mocking
- **Test Utilities** - Custom testing helpers

### Running Tests

```bash
# Run all tests
yarn run test

# Run tests in watch mode
yarn run test:watch

# Generate coverage report
yarn run test:coverage
```

Test files are located in `src/__tests__/` directory with utilities available in `src/__tests__/utils/`.

## 📁 Project Structure

```
src/
├── app/                 # App configuration
├── assets/             # Static assets (icons, images)
├── components/         # Reusable UI components
│   ├── data-table/     # Advanced data table components
│   ├── form/           # Form components
│   ├── layout/         # Layout components
│   ├── ui/             # Shadcn/ui components
│   └── user-management/ # User management components
├── config/             # Configuration files
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── redux/              # Redux store and slices
│   ├── api/            # RTK Query API definitions
│   └── features/       # Feature-based slices
├── routes/             # Route definitions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── __tests__/          # Test files
```

## 🌐 Environment Setup

### SSL and Custom Domain

SSL certificates are automatically configured by Docker:
- Self-signed certificates are generated during container startup
- No additional setup required
- Browser will show a security warning (normal for local development)

For manual SSL setup, see [LOCAL SSL SETUP](docs/LOCAL-SSL-SETUP.md).

## 🛠️ Development Workflow

### Getting Started as a Developer

This project follows a structured development approach with weekly tickets and priorities. Here's how to get started:

#### 1. Review Development Priorities

Check [DEVELOPMENT PRIORITIES](docs/DEVELOPMENT-PRIORITIES.md) for the current development roadmap. The project is organized into 8-week development cycles with specific tickets for each week.

#### 2. Current Development Phase

**Week 1-2: Authentication Core**
- Complete Login/Register flow implementation
- Implement forgot password functionality
- Set up JWT token management system

#### 3. Pick Your First Ticket

Start with high-priority (P0) tickets from the current week:

1. **Ticket #1.1**: Complete Login/Register Flow
   - Fix `Login.tsx` component (currently minimal)
   - Complete `Register.tsx` implementation
   - Add form validation with Zod schemas

2. **Ticket #1.2**: Forgot Password Implementation
   - Create ForgotPassword.tsx page
   - Add password reset API endpoints

3. **Ticket #1.3**: JWT Token System Setup
   - Configure JWT token handling
   - Update authentication flow from session to JWT

#### 4. Development Best Practices

- Follow the existing code structure and conventions
- Write tests for new features (aim for >80% coverage)
- Use TypeScript strictly - no `any` types
- Follow the component patterns established in the codebase
- Update documentation when adding new features

#### 5. Before Starting Development

1. Familiarize yourself with the existing Redux structure
2. Run the test suite to ensure everything works
3. Check the existing components in `src/components/` for patterns

#### 6. Weekly Focus Areas

- **Weeks 1-2**: Authentication & User Profile
- **Weeks 3-4**: Dashboard & Data Visualization  
- **Weeks 5-6**: User Management & RBAC
- **Weeks 7-8**: Testing, Performance & Production Polish

For detailed ticket breakdowns and acceptance criteria, see the full development plan in [DEVELOPMENT PRIORITIES](docs/DEVELOPMENT-PRIORITIES.md).

## 🤝 Contributing

1. Pick a ticket from the current week's priorities
2. Create a feature branch: `git checkout -b feature/ticket-number-description`
3. Make your changes following the established patterns
4. Write/update tests for your changes
5. Run the full test suite: `yarn run test`
6. Submit a pull request with a clear description

## License

MIT License

Copyright © 2025 Outsource Team. 

---

<sup>Made with ♥ by [OutsourceTeam](https://outsourceteam.me/)
and [contributors](https://github.com).</sup>