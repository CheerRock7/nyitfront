# Deploying nyitfront to the VPS

Target server (Contabo) already runs:

- **`nyit-app`** — the live stocking system (PM2, port 3000, + Postgres/MySQL/storage). **Do not touch it.**
- **Apache2** — serving ports 80/443.
- Node v20.20.2, PM2 already installed.

This project reads its catalog **live** from the `nyit` stocking-system Postgres
database (read-only). We deploy it as a standalone frontend on **port 3001**,
reachable at `http://SERVER_IP:3001`. No Apache changes, so the stocking system is
unaffected.

---

## 0. Database setup (one-time)

The website connects to Postgres with a dedicated **read-only** role and never writes.

```bash
# 1. Create the read-only role (edit the password inside the file first):
sudo -u postgres psql -d nyit -f db/create-web-role.sql

# 2. (Optional) seed ~10 sample products so the site isn't near-empty:
sudo -u postgres psql -d nyit -f db/seed-products.sql
#    Undo later with:
#    sudo -u postgres psql -d nyit -c "DELETE FROM products WHERE notes = 'seed:web-demo';"
```

Then create `.env.local` in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
# Edit .env.local:
#   DATABASE_URL=postgres://nyit_web:THE_PASSWORD@localhost:5432/nyit
#   NEXT_PUBLIC_UPLOADS_BASE_URL=http://SERVER_IP:3000   # where /uploads images are served
```

### Local development (from your PC)

The DB only listens on the VPS's localhost, so tunnel to it, then point at the tunnel:

```bash
ssh -L 5433:localhost:5432 root@194.233.88.142     # keep this open
# .env.local on your PC:
#   DATABASE_URL=postgres://nyit_web:THE_PASSWORD@localhost:5433/nyit
npm run dev
```

---

## 1. Get the code and build

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/CheerRock7/nyitfront.git
cd nyitfront

npm install     # install deps (npm ci is stricter and can reject a
                # cross-platform lock file — use npm install on the VPS)
# create .env.local first (see section 0), then:
npm run build   # produces .next/
```

## 2. Start under PM2 (port 3001)

```bash
cd /var/www/nyitfront
pm2 start ecosystem.config.cjs
pm2 save                       # persist so it survives reboot (alongside nyit-app)
```

`pm2 startup` is already configured for the existing app, so `pm2 save` is enough.

Verify locally:

```bash
curl -I http://127.0.0.1:3001   # expect HTTP/1.1 200 OK
```

## 3. Open port 3001 to the internet

Check for a host firewall:

```bash
ufw status        # if "inactive", nothing to do here
```

If ufw is **active**, allow the port:

```bash
ufw allow 3001/tcp
```

Also check the **Contabo control panel → Firewall** — if you have an external
firewall enabled there, add an inbound rule for TCP **3001**. (If it's disabled,
nothing to do.)

Now visit **`http://SERVER_IP:3001`** in a browser.

---

## Redeploying after code changes

```bash
cd /var/www/nyitfront
git pull
npm install        # use npm install, not npm ci (see note in section 1)
npm run build
pm2 reload nyitfront
```

## Handy PM2 commands

```bash
pm2 status               # see nyit-app AND nyitfront
pm2 logs nyitfront       # tail logs for this app only
pm2 restart nyitfront
pm2 stop nyitfront
```

## Later: clean URL + HTTPS via a subdomain (optional)

When ready, point a subdomain (e.g. `shop.yourdomain.com`) at the server and add
an Apache vhost that reverse-proxies to `127.0.0.1:3001`:

```apache
<VirtualHost *:80>
    ServerName shop.yourdomain.com
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3001/
    ProxyPassReverse / http://127.0.0.1:3001/
</VirtualHost>
```

```bash
a2enmod proxy proxy_http
a2ensite your-site.conf
apache2ctl configtest && systemctl reload apache2
# then HTTPS:
certbot --apache -d shop.yourdomain.com
```

At that point you'd also flip the PM2 config back to `--hostname 127.0.0.1` so the
app is only reachable through Apache.
