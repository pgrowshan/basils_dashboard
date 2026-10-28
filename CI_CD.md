# CI/CD — Dashboard

This document covers everything you need to understand, set up, and maintain the deployment pipeline for the admin dashboard.

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
      └─► [CD]  (only on push to main)
            ├─ Build site: npm ci → npm run build → upload dist
            └─ Deploy to GitHub Pages
                    ▼
          https://pgrowshan.github.io/basils_dashboard/
```

The dashboard is a separate app from the storefront. Its Git remote currently points at `pgrowshan/basils_frontend`. Do not push this project there. Create `pgrowshan/basils_dashboard`, then point `origin` at that repository before the first deploy. Pushing `main` to the storefront repository would replace the shop.

---

## How It Works

Every time code is pushed, two things can happen:

1. **CI runs** — The dashboard is linted (`npm run lint`) and built (`npm run build`). This runs on every branch and every pull request to `main`.
2. **CD runs** — If the push is to `main`, GitHub Actions builds the site with the production API URL and publishes `dist` to GitHub Pages.

```text
Your branch → PR → CI passes → Merge to main → CD publishes → GitHub Pages
```

Vite bakes `VITE_*` values into the JavaScript at build time. Changing a secret does nothing until the next deploy.

Client-side routes such as `/orders` and `/promos` keep working because the deploy copies `index.html` to `404.html`.

---

## GitHub Secrets You Need to Add

Go to **GitHub → the dashboard repo → Settings → Secrets and variables → Actions**, then click **"New repository secret"**.

| Secret | Required | What it is |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Public API origin, including `/api/v1` |

| Variable | What it is |
|---|---|
| `VITE_BASE_PATH` | Vite `base`. Defaults to `/basils_dashboard/` |

---

### `VITE_API_BASE_URL` — Production API

```text
Example: https://api.example.com/api/v1
```

A push to `main` fails before publish when this secret is missing.

---

### `VITE_BASE_PATH` — Site path

Leave this unset for `https://pgrowshan.github.io/basils_dashboard/`. Set it to `/` only when a custom domain serves the dashboard at the root of the host.

---

## Protect the main branch

On the **dashboard** repository, go to **Settings → Branches → Add rule**:

- Target: `main`
- Enable: **Require a pull request before merging**
- Enable: **Require status checks to pass before merging**
- Add check: `Lint and build`

Turn on Pages once:

- **Settings → Pages**
- Source: **GitHub Actions**

Also add the dashboard origin to the API `ALLOW_URL` value, or the browser will block every request.

---

## What Triggers a Deploy?

| Action | CI | Deploy |
|---|---|---|
| Push to any feature branch | Yes | No |
| Open or update a PR to `main` | Yes | No |
| Merge a PR into `main` | No | Yes |

---

## Managing Environment Variables

Local development uses `dashboard/.env`. That file is gitignored. Production values live in GitHub Actions secrets.

```bash
cp .env.example .env
```

To change the live API URL, update the secret and re-run **Deploy** from the Actions tab.

---

## Common Problems

### Deploy fails with "Add the VITE_API_BASE_URL repository secret"

Add it under **Repository secrets** on the dashboard repo, then re-run the failed deploy.

### The shop site was replaced by the dashboard

`origin` still pointed at `basils_frontend`. Move `origin` to `basils_dashboard` and redeploy the storefront from its own repository.

### A route such as `/orders` returns the GitHub Pages 404

Re-run Deploy. The workflow copies `index.html` to `404.html` so the client router can load.

### The dashboard still calls localhost

`VITE_API_BASE_URL` was empty during the build. Confirm the secret, then re-run Deploy.

---

## Security Reminders

- `.env` is in `.gitignore`. Do not force-add it
- Never paste a real secret into a PR comment, Slack message, or an AI tool prompt
- If a credential was shared somewhere it should not have been, rotate it before the next deploy
