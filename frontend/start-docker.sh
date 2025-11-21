#!/bin/bash
set -e

echo "🚀 Starting Travel Portal Frontend with Docker"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Setup environment
echo -e "${BLUE}🔧 Setting up environment...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.docker" ]; then
        cp .env.docker .env
        echo -e "${GREEN}✅ Copied .env.docker to .env${NC}"
    else
        echo -e "${YELLOW}⚠️  .env file not found. Please create one from .env.example${NC}"
    fi
fi

# Create directories
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p .docker/frontend
mkdir -p .docker/scripts
mkdir -p certs

# Make scripts executable
chmod +x .docker/scripts/*.sh 2>/dev/null || true

# Host file reminder
echo -e "${YELLOW}📝 Reminder: Add this to your /etc/hosts file:${NC}"
echo -e "${BLUE}127.0.0.1   local.do-my-booking.com${NC}"
echo ""

if ! grep -q "local.do-my-booking.com" /etc/hosts 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Host entry not found. Run this command:${NC}"
    echo -e "${BLUE}echo '127.0.0.1   local.do-my-booking.com' | sudo tee -a /etc/hosts${NC}"
    echo ""
fi

echo ""

# Start Docker services
echo -e "${BLUE}🐳 Starting Docker services...${NC}"
docker compose up -d --build

# Wait for services
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 10

# Show service status
echo -e "${BLUE}📊 Service Status:${NC}"
docker compose ps

echo ""
echo -e "${GREEN}🎉 Frontend is starting up!${NC}"
echo -e "${GREEN}🌐 Access your application:${NC}"
echo -e "${BLUE}   • HTTPS: https://local.do-my-booking.com:5173${NC}"
echo ""
echo -e "${GREEN}🔗 API Endpoint:${NC}"
echo -e "${BLUE}   • https://outsource-team.do-my-booking.com${NC}"
echo ""
echo -e "${PURPLE}🔒 SSL Certificate Information:${NC}"
echo -e "${YELLOW}   Self-signed certificates are used for HTTPS${NC}"
echo -e "${YELLOW}   Browser will show security warning - this is NORMAL${NC}"
echo -e "${YELLOW}   Click 'Advanced' → 'Proceed to site' to continue${NC}"
echo ""
echo -e "${GREEN}📋 Useful Commands:${NC}"
echo -e "${BLUE}   • View logs: docker compose logs -f react_frontend${NC}"
echo -e "${BLUE}   • Stop services: docker compose down${NC}"
echo -e "${BLUE}   • Rebuild: docker compose up -d --build${NC}"
echo -e "${BLUE}   • Shell access: docker compose exec react_frontend sh${NC}"
echo -e "${BLUE}   • Check SSL: openssl x509 -in certs/localhost.pem -text -noout${NC}"
echo ""

# echo -e "${YELLOW}📝 Showing frontend logs (Ctrl+C to exit):${NC}"
# docker compose logs -f react_frontend
