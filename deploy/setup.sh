#!/usr/bin/env bash
# D Mimo Architects — one-shot server setup for an AWS EC2 Ubuntu 24.04 instance.
# Works on a free-tier t3.micro (1 GB RAM) thanks to a 2 GB swap file.
#
# Usage (from inside the unzipped project folder on the server):
#   sudo ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="StrongPass123" bash deploy/setup.sh
# Optional: SITE_URL="https://www.yourdomain.com" (defaults to http://<public-ip>)
# Safe to re-run later to deploy a new version: keeps .env, database and uploaded images.
set -euo pipefail

if [[ $EUID -ne 0 ]]; then echo "Please run with sudo:  sudo bash deploy/setup.sh"; exit 1; fi

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR=/var/www/dmimo
APP_USER=ubuntu
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@dmimoarchitects.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"
SITE_URL="${SITE_URL:-}"
FIRST_RUN=0
[[ -f "$APP_DIR/.env" ]] || FIRST_RUN=1

echo "==> 1/8 Swap file (lets the 1 GB server build the site)"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> 2/8 System packages (Nginx, PostgreSQL, Node.js 22, PM2)"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl gnupg unzip rsync openssl nginx postgresql postgresql-contrib
if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
command -v pm2 >/dev/null || npm install -g pm2

echo "==> 3/8 PostgreSQL database"
systemctl enable --now postgresql
DB_PASS_FILE=/etc/dmimo-db-pass
if [[ ! -f $DB_PASS_FILE ]]; then openssl rand -hex 16 > $DB_PASS_FILE; chmod 600 $DB_PASS_FILE; fi
DB_PASS="$(cat $DB_PASS_FILE)"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='mimo'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE USER mimo WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='mimo_architects'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE mimo_architects OWNER mimo;"

echo "==> 4/8 Copying app to $APP_DIR"
mkdir -p "$APP_DIR/public/uploads"
if [[ "$SRC_DIR" != "$APP_DIR" ]]; then
  rsync -a --delete \
    --exclude node_modules --exclude .next --exclude .env --exclude 'public/uploads/' \
    "$SRC_DIR"/ "$APP_DIR"/
fi

echo "==> 5/8 Environment file"
if [[ -z "$SITE_URL" ]]; then
  TOKEN=$(curl -s -X PUT http://169.254.169.254/latest/api/token -H "X-aws-ec2-metadata-token-ttl-seconds: 60" || true)
  IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4 || true)
  SITE_URL="http://${IP:-localhost}"
fi
if [[ $FIRST_RUN -eq 1 ]]; then
  if [[ -z "$ADMIN_PASSWORD" ]]; then ADMIN_PASSWORD="$(openssl rand -base64 18 | tr -d '/+=')"; fi
  cat > "$APP_DIR/.env" <<ENV
DATABASE_URL="postgresql://mimo:${DB_PASS}@localhost:5432/mimo_architects?schema=public"
DATABASE_URL_UNPOOLED="postgresql://mimo:${DB_PASS}@localhost:5432/mimo_architects?schema=public"
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_TRUST_HOST=true
NEXTAUTH_URL="${SITE_URL}"
SEED_ADMIN_EMAIL="${ADMIN_EMAIL}"
SEED_ADMIN_PASSWORD="${ADMIN_PASSWORD}"
ENV
else
  sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"${SITE_URL}\"|" "$APP_DIR/.env"
fi
chmod 600 "$APP_DIR/.env"
chown -R $APP_USER:$APP_USER "$APP_DIR"

echo "==> 6/8 Installing dependencies, creating tables, building (5-15 min on t3.micro)"
sudo -u $APP_USER -H bash -c "
  set -euo pipefail
  cd '$APP_DIR'
  set -a; . ./.env; set +a
  npm ci --no-audit --no-fund
  npx prisma db push --skip-generate
  if [[ $FIRST_RUN -eq 1 ]]; then npm run db:seed; fi
  NODE_OPTIONS=--max-old-space-size=1536 npm run build
"

echo "==> 7/8 Starting the app with PM2 (auto-restarts on reboot)"
sudo -u $APP_USER -H bash -c "cd '$APP_DIR' && pm2 startOrReload deploy/ecosystem.config.cjs && pm2 save"
pm2 startup systemd -u $APP_USER --hp /home/$APP_USER >/dev/null

echo "==> 8/8 Nginx web server on port 80"
cat > /etc/nginx/sites-available/dmimo <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    client_max_body_size 12M;

    # Images uploaded from the admin panel are served straight from disk
    location /uploads/ {
        alias /var/www/dmimo/public/uploads/;
        expires 30d;
        access_log off;
    }

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
NGINX
ln -sf /etc/nginx/sites-available/dmimo /etc/nginx/sites-enabled/dmimo
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo
echo "============================================================"
echo " D Mimo Architects is live at:  ${SITE_URL}"
echo " Admin panel:                   ${SITE_URL}/admin/login"
if [[ $FIRST_RUN -eq 1 ]]; then
echo " Admin email:                   ${ADMIN_EMAIL}"
echo " Admin password:                ${ADMIN_PASSWORD}"
echo " (Save these now. Change the password after first login.)"
fi
echo "============================================================"
