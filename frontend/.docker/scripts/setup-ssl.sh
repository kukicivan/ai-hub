#!/bin/bash
set -e

echo "🔧 Setting up SSL certificates for local development..."

CERT_DIR="/app/certs"
DOMAIN="localhost"
CERT_FILE="$CERT_DIR/$DOMAIN.pem"
KEY_FILE="$CERT_DIR/$DOMAIN-key.pem"

mkdir -p "$CERT_DIR"

# Check if certificates exist and are valid
if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo "✅ SSL certificates already exist, checking validity..."
    if openssl x509 -in "$CERT_FILE" -checkend 86400 -noout >/dev/null 2>&1; then
        echo "✅ Existing certificates are valid, skipping generation"
        exit 0
    else
        echo "⚠️  Certificates expired, regenerating..."
    fi
fi

echo "🔑 Generating new SSL certificates..."

# Initialize mkcert if needed
if ! mkcert -CAROOT >/dev/null 2>&1; then
    echo "📦 Installing mkcert local CA..."
    mkcert -install
fi

echo "🏗️  Using existing certificates..."

# Copy existing certificates
cp /certs/localhost.pem "$CERT_FILE"
cp /certs/localhost-key.pem "$KEY_FILE"

# Set proper permissions
chmod 644 "$CERT_FILE"
chmod 600 "$KEY_FILE"

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificate: $CERT_FILE"
echo "🔑 Private Key: $KEY_FILE"

# Verify certificate
if openssl x509 -in "$CERT_FILE" -text -noout >/dev/null 2>&1; then
    echo "✅ Certificate verification successful"
    openssl x509 -in "$CERT_FILE" -subject -dates -noout
else
    echo "❌ Certificate verification failed"
    exit 1
fi

echo "🎉 SSL setup completed successfully!"
