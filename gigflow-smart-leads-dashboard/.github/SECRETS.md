# GitHub Actions — Required Secrets & Variables

Configure these in your repository:
**Settings → Secrets and variables → Actions**

---

## Secrets (encrypted, never logged)

| Secret | Where to get it | Used by |
|---|---|---|
| `RENDER_DEPLOY_HOOK_URL` | Render Dashboard → Service → Settings → Deploy Hooks → Create hook | `cd.yml` |
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens → Create | `cd.yml` |
| `VERCEL_ORG_ID` | Run `vercel whoami` or check `.vercel/project.json` after `vercel link` | `cd.yml` |
| `VERCEL_PROJECT_ID` | Run `vercel link` in `frontend/` then check `.vercel/project.json` | `cd.yml` |

## Variables (plain text, visible in logs)

| Variable | Example value | Used by |
|---|---|---|
| `RENDER_SERVICE_URL` | `https://gigflow-backend.onrender.com` | `cd.yml` (health check) |
| `VITE_API_BASE_URL` | `https://gigflow-backend.onrender.com/api` | `docker-publish.yml` |

---

## One-time Vercel setup

```bash
# In the frontend/ directory on your local machine:
cd frontend
npx vercel login
npx vercel link        # Creates .vercel/project.json — grab the IDs from there
```

Then add the three Vercel secrets to GitHub.

## One-time Render setup

1. Deploy once manually from the Render dashboard (or via render.yaml Blueprint)
2. Go to: Service → Settings → Deploy Hooks → **Create Deploy Hook**
3. Copy the URL and save it as `RENDER_DEPLOY_HOOK_URL` in GitHub Secrets
