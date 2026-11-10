#!/usr/bin/env bash
# Deploys the current `master` branch to the live VPS.
#
# What it does:
#   1. SSHes into the VPS
#   2. git pulls the latest commit
#   3. Builds the Next.js static site (frontend-next)
#   4. Syncs the build output into public_html (never touching cms/ or the
#      analytics.massive-designs.com subdomain, which lives in its own
#      directory there but isn't part of this repo's build output)
#
# This repo no longer contains backend/ at all — the site's own backend
# (massive-designs-backend, contact form + audit tool) now lives at
# /home/massive-designs.com/backend-standalone/ on the VPS, completely
# outside this repo's git history, and the separate analytics SaaS platform
# lives in its own repo (massive-analytics-platform) and its own VPS
# directory (analytics-app/) entirely. Neither is touched by this script —
# that's deliberate, after a prior version of this script auto-restarted the
# analytics backend on an unrelated frontend deploy, and a git-pull here once
# nearly deleted the live backend's own running directory. Don't reintroduce
# backend/ to this repo, and don't add pm2 restart logic back here for
# anything other than a backend this repo actually owns.
#
# Usage:
#   bash deploy.sh
#
# Prerequisites:
#   - Your local changes are already committed and pushed to origin/master.
#   - ~/.ssh/deploy_key can SSH into the VPS as root.

set -euo pipefail

VPS_HOST="root@192.64.118.208"
SSH_KEY="$HOME/.ssh/deploy_key"
SSH_PORT=48213

echo "==> Deploying Massive Designs to $VPS_HOST"

ssh -i "$SSH_KEY" -p "$SSH_PORT" -o BatchMode=yes -o ConnectTimeout=15 "$VPS_HOST" bash -s <<REMOTE_SCRIPT
set -euo pipefail
cd /home/massive-designs.com/md-repo

echo "==> Pulling latest code..."
BEFORE=\$(git rev-parse HEAD)
git pull origin master
AFTER=\$(git rev-parse HEAD)

if [ "\$BEFORE" = "\$AFTER" ]; then
  echo "==> Already up to date, nothing to deploy."
  exit 0
fi

echo "==> Building frontend..."
cd frontend-next
npm run build

echo "==> Syncing build output to public_html..."
rsync -a --delete --exclude='cms' --exclude='analytics.massive-designs.com' out/ /home/massive-designs.com/public_html/
chown -R massi1240:massi1240 /home/massive-designs.com/public_html/

echo "==> Deploy finished (\$BEFORE -> \$AFTER)."
REMOTE_SCRIPT

echo "==> Verifying live site..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://massive-designs.com/)
echo "==> https://massive-designs.com/ returned $STATUS"
