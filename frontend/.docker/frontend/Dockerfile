FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    openssl \
    ca-certificates \
    git \
    bash

# Install mkcert for SSL certificates
RUN wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64 && \
    chmod +x mkcert && \
    mv mkcert /usr/local/bin/

WORKDIR /app

# Copy package files first for better caching
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p /app/certs /app/.docker/scripts

# Make scripts executable
RUN chmod +x .docker/scripts/*.sh 2>/dev/null || true

EXPOSE 5173 443
CMD ["yarn", "dev", "--host", "0.0.0.0"]
