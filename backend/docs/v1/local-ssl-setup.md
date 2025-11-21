# Local SSL and Custom Domain Setup

## ⚡ Quickstart (5 minutes)

1. Add to `/etc/hosts` (requires sudo):
   ```bash
   echo "127.0.0.1   local.do-my-booking.com" | sudo tee -a /etc/hosts
   ```

2. Install certificates (already in repo):
   - Certificates are pre-generated in `certs/` folder
   - Just trust them in your system:
     ```bash
     # Install mkcert (one-time setup)
     sudo apt install mkcert    # Ubuntu/Debian
     # OR
     brew install mkcert       # macOS

     # Install local CA
     mkcert -install
     ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open https://local.do-my-booking.com:5173 in your browser

That's it! If you need more details or troubleshooting, read on.

---

This document explains how to set up SSL certificates and custom domain for local development.

## 1. Custom Domain Setup

### Add to hosts file
Add the following line to your `/etc/hosts` file:
```
127.0.0.1   local.do-my-booking.com
```

On Unix-like systems (Linux/MacOS):
```bash
sudo nano /etc/hosts
```

On Windows:
- Edit C:\Windows\System32\drivers\etc\hosts as Administrator

## 2. SSL Certificates

### Generate SSL Certificates
Using mkcert (recommended):

1. Install mkcert:
```bash
# On Ubuntu/Debian
sudo apt install mkcert

# On macOS with Homebrew
brew install mkcert
```

2. Install local CA:
```bash
mkcert -install
```

3. Generate certificates:
```bash
mkdir certs
cd certs
mkcert localhost local.do-my-booking.com
```

4. Rename the generated files:
```bash
mv localhost+1-key.pem localhost-key.pem
mv localhost+1.pem localhost.pem
```

## 3. Vite Configuration

The project is already configured in `vite.config.ts`:
```typescript
server: {
    host: 'local.do-my-booking.com',
    port: 5173,
    https: {
        key: fs.readFileSync("./certs/localhost-key.pem"),
        cert: fs.readFileSync("./certs/localhost.pem"),
    },
    proxy: {
        '/api': {
            target: 'https://outsource-team.do-my-booking.com',
            changeOrigin: true,
            secure: false,
        },
        '/sanctum': {
            target: 'https://outsource-team.do-my-booking.com',
            changeOrigin: true,
            secure: false,
        },
    }
}
```

## 4. Running the Development Server

Start the development server:
```bash
npm run dev
```

Access your application at:
https://local.do-my-booking.com:5173

## Troubleshooting

1. If you get certificate errors in the browser:
   - Make sure you've installed the local CA using `mkcert -install`
   - Try restarting your browser

2. If the domain isn't resolving:
   - Verify your hosts file has the correct entry
   - Try flushing your DNS cache:
     ```bash
     # On Linux
     sudo systemd-resolve --flush-caches
     
     # On macOS
     sudo killall -HUP mDNSResponder
     
     # On Windows
     ipconfig /flushdns
     ```

3. If Vite can't read the certificates:
   - Verify the certificate files exist in the `certs` directory
   - Check file permissions
   - Ensure the paths in `vite.config.ts` are correct
