# 🚀 Backend Laravel API

A modern, Docker-containerized Laravel 12 API backend with authentication, CORS support, and automated CI/CD deployment.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Development Setup](#-development-setup)
- [API Documentation](#-api-documentation)
- [Docker Commands](#-docker-commands)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel** | 12.x | PHP Framework |
| **PHP** | 8.3 | Backend Language |
| **MySQL** | 8.0 | Primary Database |
| **Redis** | Alpine | Cache & Sessions |
| **Nginx** | Stable | Web Server |
| **Docker** | Latest | Containerization |
| **GitLab CI/CD** | - | Automated Deployment |

### Key Packages
- **Laravel Sanctum** - API Authentication
- **Laravel CORS** - Cross-Origin Resource Sharing
- **PHPUnit** - Testing Framework

## ✨ Features

- 🔐 **JWT Authentication** with Laravel Sanctum
- 🌐 **CORS Support** for frontend integration
- 🍪 **Cookie-based Sessions** for SPA authentication
- 📦 **Docker Containerization** for consistent environments
- 🚀 **Automated CI/CD** with GitLab pipelines
- 📊 **Redis Caching** for optimal performance
- 🧪 **Comprehensive Testing** with PHPUnit
- 🔒 **Security Headers** and best practices
- 📈 **Health Checks** for all services

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js (for frontend integration)

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd backend-laravel
cp src/.env.example src/.env
```

### 2. Start Development Environment
```bash
# Build and start all containers
docker-compose up -d --build

# Install Laravel dependencies
docker-compose exec backend_app composer install

# Generate application key
docker-compose exec backend_app php artisan key:generate

# Run migrations
docker-compose exec backend_app php artisan migrate

# Seed database (optional)
docker-compose exec backend_app php artisan db:seed
```

### 3. Verify Setup
- **API Endpoint:** http://localhost:8080
- **Health Check:** http://localhost:8080/api/health
- **Database:** localhost:3306 (backend_laravel/backend_admin)
- **Redis:** localhost:6379

## 🏗 Development Setup

### Project Structure
```
backend-laravel/
├── .docker/                 # Docker configuration
│   ├── nginx/               # Nginx configuration
│   ├── php/                 # PHP-FPM configuration
│   └── redis/               # Redis configuration
├── docs/                    # Documentation & scripts
├── src/                     # Laravel application
├── docker-compose.yml       # Development containers
├── .gitlab-ci.yml          # CI/CD pipeline
└── README.md               # This file
```

### Environment Configuration

#### Development (.env)
```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

DB_HOST=backend_db
REDIS_HOST=backend_redis
```

#### Testing (.env.testing)
```env
APP_ENV=testing
DB_DATABASE=backend_laravel_test
CACHE_DRIVER=array
SESSION_DRIVER=array
```

### Development Workflow

1. **Start Development Server**
   ```bash
   ./docs/dev-start.sh
   ```

2. **Make Changes** to your Laravel application in `src/`

3. **Run Tests**
   ```bash
   ./docs/test.sh
   ```

4. **Check Code Quality**
   ```bash
   ./docs/code-check.sh
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Get CSRF Cookie
```http
GET /sanctum/csrf-cookie
Content-Type: application/json
```

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password"
}
```

#### Get User Profile
```http
GET /api/auth/user
Authorization: Bearer {token}
Content-Type: application/json
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
Content-Type: application/json
```

### Example API Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-01-15T10:00:00.000000Z"
    },
    "token": "1|abc123..."
  },
  "message": "Login successful"
}
```

### Frontend Integration

#### React/Vue.js Setup
```javascript
// axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// Get CSRF token before authenticated requests
export const getCsrfToken = () => api.get('/sanctum/csrf-cookie');

// Login example
export const login = async (credentials) => {
  await getCsrfToken();
  return api.post('/api/auth/login', credentials);
};

// Authenticated request example
export const getProfile = () => api.get('/api/auth/user');
```

#### Usage Example
```javascript
import { login, getProfile } from './api/axios';

// Login user
const handleLogin = async () => {
  try {
    const response = await login({
      email: 'user@example.com',
      password: 'password'
    });
    
    console.log('Login successful:', response.data);
    
    // Get user profile
    const profile = await getProfile();
    console.log('User profile:', profile.data);
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
};
```

## 🐳 Docker Commands

### Development
```bash
# Start all services

Note about PHPUnit & PHP DOM/XML
--------------------------------

If phpunit fails with "current environment lacks PHP DOM/XML extensions" when running locally, rebuild the Docker PHP image so the container includes the DOM/XML extensions used by tests:

1. Rebuild the PHP service image:

  docker compose build backend_app

2. Run tests inside the container:

  docker compose run --rm backend_app ./vendor/bin/phpunit

This project installs the required `dom` and `xml` extensions in `.docker/php/Dockerfile` so rebuilding the `backend_app` image makes them available to phpunit.
docker-compose up -d

# View logs
docker-compose logs -f backend_app

# Execute commands
docker-compose exec backend_app php artisan migrate
docker-compose exec backend_app composer install
docker-compose exec backend_app php artisan tinker

# Stop services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

### Useful Aliases
Add to your `~/.bashrc` or `~/.zshrc`:
```bash
alias dce='docker-compose exec backend_app'
alias dcl='docker-compose logs -f'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
```

Usage: `dce php artisan migrate`

## 🧪 Testing

### Run Test Suite
```bash
# Run all tests
docker-compose exec backend_app php artisan test

# Run with coverage
docker-compose exec backend_app php artisan test --coverage

# Run specific test
docker-compose exec backend_app php artisan test --filter AuthTest
```

### Test Structure
```
tests/
├── Feature/                 # Integration tests
│   ├── Auth/
│   │   ├── LoginTest.php
│   │   └── RegistrationTest.php
│   └── Api/
│       └── UserApiTest.php
└── Unit/                    # Unit tests
    └── Models/
        └── UserTest.php
```

### Example Test
```php
<?php
// tests/Feature/Auth/LoginTest.php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'user' => [
                            'email' => 'test@example.com'
                        ]
                    ]
                ]);
    }
}
```

## 🚀 Deployment

### GitLab CI/CD Setup

1. **Set GitLab Variables** (Settings → CI/CD → Variables):
   ```
   SSH_PRIVATE_KEY: Your deployment server SSH key
   SSH_KNOWN_HOSTS: Server fingerprint
   SSH_USER: Deployment username
   SSH_HOST: Server IP/hostname
   SSH_PORT: SSH port (default: 22)
   ```

2. **Server Preparation**:
   ```bash
   # On your Belgrade server
   sudo mkdir -p /var/www/backend-laravel/{releases,shared}
   sudo chown -R www-data:www-data /var/www/backend-laravel
   ```

3. **Deploy**:
   - Push to `main` branch triggers automatic deployment
   - Manual deployment available in GitLab UI

### Production Environment
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

DB_HOST=localhost
DB_DATABASE=backend_laravel_prod
DB_USERNAME=prod_user
DB_PASSWORD=secure_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

## 🔧 Troubleshooting

### Common Issues

#### CORS Errors
```bash
# Check CORS configuration
docker-compose exec backend_app php artisan route:list | grep cors

# Clear config cache
docker-compose exec backend_app php artisan config:clear
```

#### Session Issues
```bash
# Check Redis connection
docker-compose exec backend_redis redis-cli ping

# Verify session configuration
docker-compose exec backend_app php artisan config:show session
```

#### Database Connection
```bash
# Test database connection
docker-compose exec backend_app php artisan migrate:status

# Check database logs
docker-compose logs backend_db
```

### Performance Optimization
```bash
# Cache configuration
docker-compose exec backend_app php artisan config:cache

# Cache routes
docker-compose exec backend_app php artisan route:cache

# Cache views
docker-compose exec backend_app php artisan view:cache

# Optimize autoloader
docker-compose exec backend_app composer dump-autoload --optimize
```

### Debug Mode
```bash
# Enable query logging
docker-compose exec backend_app php artisan tinker
>>> DB::enableQueryLog();
>>> // Run your queries
>>> DB::getQueryLog();
```

## 📖 Useful Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum Guide](https://laravel.com/docs/sanctum)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)

## 🤝 Contributing

### Development Guidelines
1. Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standards
2. Write tests for new features
3. Update documentation
4. Use conventional commit messages

### Pull Request Process
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style
```bash
# Format code
docker-compose exec backend_app ./vendor/bin/php-cs-fixer fix

# Static analysis
docker-compose exec backend_app ./vendor/bin/phpstan analyse
```

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 📧 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the troubleshooting section above

---

**Happy Coding!** 🎉