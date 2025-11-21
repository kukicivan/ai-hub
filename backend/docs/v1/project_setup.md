# Backend Laravel Project Setup Guide

## Project Structure

Your project should have the following directory structure:

```
backend-laravel/
├── .docker/
│   ├── nginx/
│   │   └── default.conf
│   ├── php/
│   │   ├── Dockerfile
│   │   └── php.ini
│   └── redis/
│       └── redis.conf
├── src/                    # Your Laravel 12 application goes here
├── docker-compose.yml
├── .gitlab-ci.yml
├── .env.example
├── .env.testing
└── README.md
```

## Setup Steps

### 1. Initialize Git Repository
```bash
git init
git remote add origin your-git-repo-url
```

### 2. Install Laravel 12
```bash
# Create Laravel application in src directory
composer create-project laravel/laravel:^12.0 src
cd src
```

### 3. Configure Laravel for Sanctum and CORS

#### Install Laravel Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

#### Update config/sanctum.php
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1')),

'middleware' => [
    'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
    'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    'validate_csrf_token' => App\Http\Middleware\ValidateCsrfToken::class,
],
```

#### Update config/cors.php
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_methods' => ['*'],

'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],

'allowed_origins_patterns' => [],

'allowed_headers' => ['*'],

'exposed_headers' => [],

'max_age' => 0,

'supports_credentials' => true,
```

#### Update app/Http/Kernel.php
Add to API middleware group:
```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

### 4. Configure Session for Database
```bash
php artisan session:table
```

#### Update config/session.php
```php
'driver' => env('SESSION_DRIVER', 'database'),
'connection' => env('SESSION_CONNECTION'),
```

### 5. Setup Environment Files
Copy the provided `.env.example` and `.env.testing` files and update the Laravel `.env`:

```bash
cp ../.env.example .env
cp ../.env.testing .env.testing
php artisan key:generate
```

### 6. Run Docker Setup
```bash
# From project root
docker-compose up -d --build

# Check if everything is running
docker-compose ps
```

### 7. Setup Laravel
```bash
# Run migrations and seeders (will be done automatically by migrations container)
# Or manually:
docker-compose exec backend_app php artisan migrate
docker-compose exec backend_app php artisan db:seed
docker-compose exec backend_app php artisan storage:link
```

## API Routes Example

Create authentication routes in `routes/api.php`:

```php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

// CSRF cookie route
Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Your protected API routes here
});
```

## Frontend Integration

### For React/Vue.js Frontend:

1. **Install Axios and configure it:**
```javascript
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

// Get CSRF token before making authenticated requests
await axios.get('/sanctum/csrf-cookie');
```

2. **Login Example:**
```javascript
// Get CSRF token first
await axios.get('/sanctum/csrf-cookie');

// Then login
const response = await axios.post('/api/auth/login', {
    email: 'user@example.com',
    password: 'password'
});

// Now you can make authenticated requests
const userResponse = await axios.get('/api/auth/user');
```

## Docker Commands

### Development Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend_app

# Execute commands in containers
docker-compose exec backend_app php artisan migrate
docker-compose exec backend_app php artisan tinker
docker-compose exec backend_app composer install

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

### Production Deployment Commands
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations in production
docker-compose exec backend_app php artisan migrate --force

# Clear and cache config
docker-compose exec backend_app php artisan config:cache
docker-compose exec backend_app php artisan route:cache
docker-compose exec backend_app php artisan view:cache
```

## GitLab CI/CD Setup

### Required GitLab Variables

Set these in your GitLab project settings under Settings > CI/CD > Variables:

```bash
# SSH Configuration
SSH_PRIVATE_KEY          # Your private SSH key for server access
SSH_KNOWN_HOSTS          # Known hosts file content
SSH_USER                 # SSH username (e.g., root, deploy)
SSH_HOST                 # Server IP or hostname
SSH_PORT                 # SSH port (default: 22)

# Optional: Custom domain
PRODUCTION_URL           # https://your-api-domain.com
```

### Server Preparation

On your Belgrade server, prepare the deployment directory:

```bash
# Create deployment structure
sudo mkdir -p /var/www/backend-laravel/{releases,shared/storage}
sudo chown -R www-data:www-data /var/www/backend-laravel
sudo chmod -R 755 /var/www/backend-laravel

# Create shared storage directories
mkdir -p /var/www/backend-laravel/shared/storage/{app/public,framework/{cache,sessions,views},logs}

# Create production environment file
sudo nano /var/www/backend-laravel/shared/.env
```

### Production .env Configuration
```env
APP_NAME="Backend Laravel"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-api-domain.com

# Frontend URL for CORS
FRONTEND_URL=https://your-frontend-domain.com
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com

# Production Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=backend_laravel_prod
DB_USERNAME=backend_prod_user
DB_PASSWORD=secure_production_password

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=redis_production_password
REDIS_PORT=6379

# Cache & Sessions
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Security Settings
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@your-domain.com"
MAIL_FROM_NAME="${APP_NAME}"

# Logging
LOG_CHANNEL=daily
LOG_LEVEL=error
```

## Nginx Configuration for Production

Create `/etc/nginx/sites-available/backend-laravel`:

```nginx
server {
    listen 80;
    server_name your-api-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-api-domain.com;
    root /var/www/backend-laravel/current/public;
    index index.php;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # File upload size
    client_max_body_size 100M;

    # Handle Laravel routes
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Process PHP files
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;

        # CORS headers
        add_header Access-Control-Allow-Origin "https://your-frontend-domain.com" always;
        add_header Access-Control-Allow-Credentials "true" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
        add_header Access-Control-Allow-Headers "Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN, X-XSRF-TOKEN" always;

        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://your-frontend-domain.com" always;
            add_header Access-Control-Allow-Credentials "true" always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
            add_header Access-Control-Allow-Headers "Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN, X-XSRF-TOKEN" always;
            add_header Access-Control-Max-Age 86400;
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 200;
        }
    }

    # Deny access to sensitive files
    location ~ /\.(ht|env) {
        deny all;
    }

    # Static file optimization
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|webp)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## Database Setup for Production

```sql
-- Create production database and user
CREATE DATABASE backend_laravel_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'backend_prod_user'@'localhost' IDENTIFIED BY 'secure_production_password';
GRANT ALL PRIVILEGES ON backend_laravel_prod.* TO 'backend_prod_user'@'localhost';
FLUSH PRIVILEGES;
```

## Troubleshooting

### Common CORS Issues

1. **Credentials not being sent:**
   - Ensure `withCredentials: true` in frontend
   - Check `supports_credentials: true` in Laravel CORS config

2. **CSRF Token mismatch:**
   - Always call `/sanctum/csrf-cookie` before authenticated requests
   - Ensure session driver is properly configured

3. **Session not persisting:**
   - Check session configuration in Laravel
   - Verify Redis is running and accessible
   - Check session domain settings

### Development Debugging

```bash
# Check container logs
docker-compose logs backend_app
docker-compose logs backend_nginx
docker-compose logs backend_db

# Connect to containers
docker-compose exec backend_app bash
docker-compose exec backend_db mysql -u backend_admin -p

# Clear Laravel caches
docker-compose exec backend_app php artisan config:clear
docker-compose exec backend_app php artisan cache:clear
docker-compose exec backend_app php artisan view:clear
```

### Performance Optimization

1. **Enable OPcache in production**
2. **Use Redis for sessions and cache**
3. **Configure proper nginx caching**
4. **Optimize database queries**
5. **Use Laravel's built-in caching mechanisms**

## Security Checklist

- [ ] Update all default passwords
- [ ] Enable SSL/TLS in production
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Use environment-specific configurations
- [ ] Regularly update dependencies
- [ ] Set up proper backup procedures
- [ ] Configure log rotation
- [ ] Use strong session and API key encryption

## Next Steps

1. Clone this configuration to your project
2. Install Laravel 12 in the `src` directory
3. Configure Sanctum and CORS as described
4. Test locally with Docker
5. Set up your Belgrade server
6. Configure GitLab CI/CD variables
7. Deploy to production

Your Backend Laravel project is now ready for development and production deployment with proper CORS handling, session management, and CI/CD pipeline!