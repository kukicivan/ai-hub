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
   yarn run dev
   ```

4. Open https://local.do-my-booking.com:5173 in your browser

That's it! If you need more details or troubleshooting, read on.

---

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