# Deploying to a VPS (Node + PM2 + Nginx, HTTP via IP)

This is a static Next.js 16 frontend (no backend, database, or env vars).
The app runs `next start` bound to `127.0.0.1:3000`; Nginx reverse-proxies
port 80 to it. Replace `SERVER_IP` with your server's public IP below.

## 1. One-time server setup (run as root)

```bash
# System packages
apt update && apt upgrade -y
apt install -y git nginx ufw

# Node.js 20 LTS (Next 16 needs Node >= 20.9)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 process manager
npm install -g pm2

# Firewall: allow SSH + HTTP
ufw allow OpenSSH
ufw allow 'Nginx HTTP'
ufw --force enable
```

## 2. Get the code and build

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/CheerRock7/nyitfront.git
cd nyitfront

npm ci          # clean install from package-lock.json
npm run build   # produces .next/
```

## 3. Start under PM2

```bash
cd /var/www/nyitfront
pm2 start ecosystem.config.cjs
pm2 save                       # persist process list
pm2 startup systemd            # prints a command — run the line it outputs
```

Verify it's up locally:

```bash
curl -I http://127.0.0.1:3000   # expect HTTP/1.1 200 OK
```

## 4. Nginx reverse proxy

Create `/etc/nginx/sites-available/nyitfront`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;   # matches any hostname / the bare IP

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it and reload:

```bash
ln -sf /etc/nginx/sites-available/nyitfront /etc/nginx/sites-enabled/nyitfront
rm -f /etc/nginx/sites-enabled/default   # remove the default welcome page
nginx -t                                 # test config
systemctl reload nginx
```

Now visit `http://SERVER_IP` in a browser.

## 5. Redeploying after code changes

```bash
cd /var/www/nyitfront
git pull
npm ci
npm run build
pm2 reload nyitfront
```

## Handy PM2 commands

```bash
pm2 status            # process state
pm2 logs nyitfront    # tail logs
pm2 restart nyitfront
pm2 stop nyitfront
```

## Adding HTTPS later (when you have a domain)

Point the domain's A record at `SERVER_IP`, set `server_name your.domain;`
in the Nginx config, then:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your.domain
ufw allow 'Nginx HTTPS'
```
