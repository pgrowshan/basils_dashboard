# CI/CD — Dashboard

This document covers everything you need to understand, set up, and maintain the deployment pipeline for the Vite + React admin dashboard.

Production is a static `dist` build on the VPS. Nginx serves it. There is no PM2 process and GitHub Pages is not used.

---

## Architecture

```text
Developer (local)
      │
      │  git push / open PR
      ▼
GitHub Repository (feat/* or main branch)
      │
      │  GitHub Actions: .github/workflows/ci.yml
      ├─► [CI Job: Lint and build]
      │     npm ci → npm run lint → npm run build
      │     Runs on: PR to main + push to any non-main branch
      │     MUST PASS before merge is allowed (via Branch Protection)
      │
      │  GitHub Actions: .github/workflows/deploy.yml
      └─► [CD Job: Deploy to VPS]  (only on push to main)
            │
            │  appleboy/ssh-action
            ▼
          VPS (Ubuntu)
            │
            ├─ Backup .env
            ├─ git fetch && git reset --hard origin/main
            ├─ Restore .env
            ├─ npm ci
            ├─ npm run build   (vite → dist/)
            └─ confirm dist/index.html exists, or rebuild the previous commit

          Nginx  →  /var/www/basils_dashboard/dist
```

The dashboard is a separate app from the storefront. Deploy it from `pgrowshan/basils_dashboard`, not from the shop repository.

---

## How It Works

Every time code is pushed, two things can happen:

1. **CI runs** — The dashboard is linted (`npm run lint`) and built (`npm run build`). This runs on every branch and every pull request to `main`.
2. **CD runs** — If the push is to `main`, GitHub Actions SSHs into the VPS, pulls `main`, and builds in place.

```text
Your branch → PR → CI passes → Merge to main → CD auto-deploys → Nginx serves the new dist
```

Vite bakes `VITE_*` values into the JavaScript at build time. Those values come from the **server `.env`**, not from GitHub secrets. Changing `.env` does nothing until the next `npm run build`.

Nginx should point at the `dist` folder, not the repo root. Client-side routes such as `/orders` and `/promos` need a fallback to `index.html`:

```nginx
root /var/www/basils_dashboard/dist;
location / {
  try_files $uri $uri/ /index.html;
}
```

Also add the dashboard origin to the API `ALLOW_URL` value, or the browser will block every request.

---

## GitHub Secrets You Need to Add

Go to **GitHub → the dashboard repo → Settings → Secrets and variables → Actions**, then click **"New repository secret"**.

| Secret | What it is |
|---|---|
| `VPS_HOST` | The IP or domain of the production server |
| `VPS_USER` | The SSH user on the server |
| `VPS_SSH_KEY` | The private deploy key, full PEM text |
| `VPS_PORT` | SSH port, usually `22` |
| `VPS_DEPLOY_PATH` | Folder on the VPS where this repo is cloned |

Production API values do **not** go in GitHub Actions. Put them in `/var/www/basils_dashboard/.env` on the server.

---

### `VPS_HOST` — Server address

```text
Example: 198.51.100.25
```

---

### `VPS_USER` — SSH username

The user that can `git fetch`, run `npm`, and write in `VPS_DEPLOY_PATH`.

```text
Example: root
```

---

### `VPS_SSH_KEY` — Deploy key

Create a key used only by this workflow. Do not reuse a personal key.

```bash
ssh-keygen -t ed25519 -f basils_dashboard_deploy -C "basils-dashboard-deploy"
```

Put the `.pub` file in `~/.ssh/authorized_keys` for `VPS_USER` on the server. Paste the private file, including the `BEGIN` and `END` lines, into the `VPS_SSH_KEY` secret.

The server also needs a GitHub deploy key or credential that can `git fetch` this repository.

---

### `VPS_PORT` — SSH port

```text
22
```

---

### `VPS_DEPLOY_PATH` — Project directory on the server

```text
/var/www/basils_dashboard
```

---

## Protect the main branch

On the **dashboard** repository, go to **Settings → Branches → Add rule**:

- Target: `main`
- Enable: **Require a pull request before merging**
- Enable: **Require status checks to pass before merging**
- Add check: `Lint and build`

`Lint and build` is the CI job name. It appears in the list after the workflow has run once on a pull request.

---

## Set up the server (first time only)

Install Node.js 22, Git, and Nginx, then clone the repo:

```bash
git clone git@github.com:pgrowshan/basils_dashboard.git /var/www/basils_dashboard
cd /var/www/basils_dashboard
```

Create `.env` on the server. Do not commit it:

```bash
nano /var/www/basils_dashboard/.env
```

```bash
VITE_API_BASE_URL=https://YOUR_API_HOST/api/v1
VITE_BASE_PATH=/
```

`VITE_API_BASE_URL` must be the public API origin the browser can call. It cannot be `localhost` on production.

Build once by hand:

```bash
cd /var/www/basils_dashboard
npm ci
npm run build
ls dist/index.html
```

Point Nginx `root` at `/var/www/basils_dashboard/dist` and reload Nginx. After that, every CD run replaces `dist` in place. Nginx does not need a reload for new hashed assets.

---

## What Triggers a Deploy?

| Action | CI | Deploy |
|---|---|---|
| Push to any feature branch | Yes | No |
| Open or update a PR to `main` | Yes | No |
| Merge a PR into `main` | No | Yes |

---

## Managing Environment Variables

`.env` lives only on the VPS. It is gitignored.

```bash
ssh root@YOUR_VPS_IP
cd /var/www/basils_dashboard
nano .env
npm run build
```

`.env.example` lists the names. Copy it when you set up a new machine:

```bash
cp .env.example .env
```

---

## Manual deploy (same steps as CD)

```bash
cd /var/www/basils_dashboard
git fetch origin main
git reset --hard origin/main
# restore .env if git touched it
npm ci
npm run build
```

---

## Common Problems

### Deploy fails before SSH

One of `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`, or `VPS_DEPLOY_PATH` is missing. The log names the missing secret and does not print its value.

### `ssh: handshake failed` or authentication error

The private key in `VPS_SSH_KEY` does not match a line in `~/.ssh/authorized_keys` for `VPS_USER`, or the key text is missing its begin and end lines.

### `Missing .env on the server`

The deploy will not build without `.env`. Recreate `/var/www/basils_dashboard/.env` with at least `VITE_API_BASE_URL`.

### The dashboard still calls localhost

`VITE_API_BASE_URL` was empty or set to `http://localhost:5000/api/v1` during `npm run build`. Fix `.env`, then build again. Vite does not read that file in the browser after the assets are built.

### A route such as `/orders` returns Nginx 404

`try_files` is missing. Add `try_files $uri $uri/ /index.html;` to the Nginx `location /` block and reload Nginx.

### Assets 404 or a blank page

`VITE_BASE_PATH` does not match the URL path. [https://admin.basilsbakery.com](https://admin.basilsbakery.com/login) needs `VITE_BASE_PATH=/`. Rebuild after changing it.

### CORS blocks dashboard requests

Add `https://admin.basilsbakery.com` to the API `ALLOW_URL` value, then reload PM2 on the backend.

### `npm: command not found` during deploy

The SSH session is non-interactive and does not see the same PATH as your login shell. Install Node so `node` and `npm` are on `/usr/bin`, or use nvm. The workflow sources `~/.nvm/nvm.sh` if nvm is present.

---

## Security Reminders

- `.env` is in `.gitignore`. Do not force-add it
- Never paste a real secret into a PR comment, Slack message, or an AI tool prompt
- If a credential was shared somewhere it should not have been, rotate it before the next deploy
