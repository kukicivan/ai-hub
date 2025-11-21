# 🚀 Starting Travel Portal Frontend with Docker (Windows Version)

Write-Host "🚀 Starting Travel Portal Frontend with Docker" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Setup environment
Write-Host "🔧 Setting up environment..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.docker") {
        Copy-Item ".env.docker" ".env"
        Write-Host "✅ Copied .env.docker to .env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .env file not found. Please create one from .env.example" -ForegroundColor Yellow
    }
}

# Create directories
Write-Host "📁 Creating directories..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path ".docker/frontend" | Out-Null
New-Item -ItemType Directory -Force -Path ".docker/scripts" | Out-Null
New-Item -ItemType Directory -Force -Path "certs" | Out-Null

# Host file reminder
Write-Host "📝 Reminder: Add this to your hosts file:" -ForegroundColor Yellow
Write-Host "127.0.0.1   local.do-my-booking.com" -ForegroundColor Blue
Write-Host ""

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$hostsContent = Get-Content $hostsPath -ErrorAction SilentlyContinue
if ($hostsContent -notmatch "local.do-my-booking.com") {
    Write-Host "⚠️  Host entry not found. Run this command as Administrator:" -ForegroundColor Yellow
    Write-Host "Add-Content -Path '$hostsPath' -Value '127.0.0.1   local.do-my-booking.com'" -ForegroundColor Blue
    Write-Host ""
}

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Cyan
docker compose up -d --build

# Wait for services
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Show service status
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker compose ps
Write-Host ""

# Final info
Write-Host "🎉 Frontend is starting up!" -ForegroundColor Green
Write-Host "🌐 Access your application:" -ForegroundColor Green
Write-Host "   • HTTPS: https://local.do-my-booking.com:5173" -ForegroundColor Blue
Write-Host ""
Write-Host "🔗 API Endpoint:" -ForegroundColor Green
Write-Host "   • https://outsource-team.do-my-booking.com" -ForegroundColor Blue
Write-Host ""
Write-Host "🔒 SSL Certificate Information:" -ForegroundColor Magenta
Write-Host "   Self-signed certificates are used for HTTPS" -ForegroundColor Yellow
Write-Host "   Browser will show a security warning - this is NORMAL" -ForegroundColor Yellow
Write-Host "   Click 'Advanced' → 'Proceed to site' to continue" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Useful Commands:" -ForegroundColor Green
Write-Host "   • View logs: docker compose logs -f react_frontend" -ForegroundColor Blue
Write-Host "   • Stop services: docker compose down" -ForegroundColor Blue
Write-Host "   • Rebuild: docker compose up -d --build" -ForegroundColor Blue
Write-Host "   • Shell access: docker compose exec react_frontend sh" -ForegroundColor Blue
Write-Host "   • Check SSL: openssl x509 -in certs/localhost.pem -text -noout" -ForegroundColor Blue
Write-Host ""
