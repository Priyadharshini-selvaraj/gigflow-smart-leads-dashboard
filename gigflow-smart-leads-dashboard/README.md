<div align="center">

<img src="https://img.shields.io/badge/GigFlow-Smart%20Leads%20Dashboard-2563eb?style=for-the-badge&logo=lightning&logoColor=white" alt="GigFlow" />

# GigFlow — Smart Leads Dashboard

**A production-ready, full-stack Lead Management System built with the MERN stack and TypeScript.**
Manage your entire sales pipeline — from first contact to closed deal — in one clean, fast interface.

<br />

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

[Live Demo](#deployment-guide) · [API Docs](#api-reference) · [Quick Start](#quick-start) · [Report a Bug](mailto:ritik.yadav@servicehive.tech)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Quick Start](#quick-start)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [API Reference](#api-reference)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Schema](#database-schema)
- [Deployment Guide](#deployment-guide)
- [Seed Data](#seed-data)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

GigFlow is a **Smart Leads Dashboard** designed for sales teams that need a clean, fast, and role-aware interface to track their pipeline. Built as a full-stack internship assignment, it demonstrates production-quality engineering across the entire stack — not just a working prototype, but a scalable, maintainable codebase with real architectural decisions.

**What makes it production-ready:**

- Strict TypeScript throughout — zero `any` shortcuts, all interfaces defined
- Service layer pattern on the backend — controllers are thin, business logic lives in services
- Zustand for lightweight, composable state — no Redux boilerplate
- React Hook Form + Zod — forms that are both performant and type-safe
- Server-side pagination, debounced search, and composable multi-filter queries
- RBAC enforced at both the API middleware layer and the React route layer
- Multi-stage Docker builds — lean images, non-root container user, health checks on every service
- Global error handler — one place to catch Mongoose, JWT, validation, and custom errors

---

## Screenshots

> Replace these placeholders with real screenshots after running the app locally. Store them in `/docs/screenshots/`.

### Login Page
```
[ docs/screenshots/login-light.png ]
Clean auth page — gradient background, demo credential hints,
Inter font, fully dark-mode aware.
```

### Dashboard — Stats Overview
```
[ docs/screenshots/dashboard.png ]
Stat cards (Total, Qualified, In Progress, Lost),
status and source breakdown bars, recent leads panel.
```

### Leads Table — Light Mode
```
[ docs/screenshots/leads-light.png ]
Paginated table, status/source badges, hover-reveal
action buttons, responsive column hiding on mobile.
```

### Leads Table — Dark Mode
```
[ docs/screenshots/leads-dark.png ]
Full dark mode — consistent token-based theming,
no hard-coded colour values anywhere in the component tree.
```

### Filters + Debounced Search
```
[ docs/screenshots/filters.png ]
Status dropdown, source dropdown, sort order, and debounced
search composing a single paginated server query in real time.
```

### Create / Edit Lead Modal
```
[ docs/screenshots/lead-form.png ]
Zod-validated modal form — inline field errors,
React Hook Form, responsive two-column grid layout.
```

### Lead Detail View
```
[ docs/screenshots/lead-detail.png ]
Read-only detail modal showing all lead fields,
assigned user, created-by, and timestamped notes.
```

---

## Features

| Category | Feature | Detail |
|---|---|---|
| **Auth** | JWT Authentication | Signed token, verified on every protected request |
| **Auth** | bcrypt Password Hashing | Configurable salt rounds (default: 12) |
| **Auth** | Protected Routes | Enforced by API middleware and React `ProtectedRoute` |
| **Auth** | Session Persistence | Token stored in localStorage, re-validated on app init via `/auth/me` |
| **RBAC** | Admin Role | Full CRUD across all leads, global pipeline stats |
| **RBAC** | Sales Role | View and update own assigned leads only |
| **Leads** | Create | Admin only, full validation on all fields |
| **Leads** | Read (list) | Paginated, filterable, sortable, searchable |
| **Leads** | Read (single) | Full detail modal with populated relations |
| **Leads** | Update | Status, source, notes, contact info — role-scoped |
| **Leads** | Delete | Admin only, with confirmation modal |
| **Filtering** | Status Filter | New / Contacted / Qualified / Lost |
| **Filtering** | Source Filter | Website / Instagram / Referral |
| **Filtering** | Combined | All filters compose into a single database query |
| **Search** | Debounced Search | 400 ms debounce on name + email, single API call per input burst |
| **Sort** | Date Order | Latest first or Oldest first |
| **Pagination** | Server-side | `skip`/`limit` with full metadata: total, pages, hasNext, hasPrev |
| **Export** | CSV Download | Respects active filters, RFC 4180 quoted to prevent injection |
| **UI** | Dark Mode | System-aware default, toggle-able, persisted to localStorage |
| **UI** | Responsive | Mobile → tablet → desktop with Tailwind breakpoints |
| **UI** | Loading States | Per-component spinners, no layout shift |
| **UI** | Empty States | Contextual messaging with suggested actions |
| **UI** | Toast Notifications | Success, error, and warning toasts via react-hot-toast |
| **Security** | Rate Limiting | 100 req/15 min global, 10 req/15 min on auth routes |
| **Security** | Helmet Headers | XSS, clickjacking, MIME-sniff, and HSTS protection |
| **Security** | CORS | Configurable per-environment allowed origins |
| **Security** | Input Validation | express-validator on backend, Zod on frontend |
| **DevOps** | Docker Compose | One command spins up Mongo + API + Nginx frontend |
| **DevOps** | Multi-stage Builds | Lean Alpine-based production images |
| **DevOps** | Health Checks | All three Docker services have health probes |
| **DevOps** | Nginx API Proxy | Frontend container proxies `/api/*` to backend by service name |
| **DX** | Seed Script | 15 realistic leads, 3 users across all roles |
| **DX** | Postman Collection | All endpoints pre-configured with token auto-save |

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---|---|---|
| `react` | 18.2 | UI framework |
| `typescript` | 5.3 | Static type checking |
| `tailwindcss` | 3.4 | Utility-first CSS framework |
| `react-router-dom` | 6.21 | Client-side routing with nested routes |
| `zustand` | 4.4 | Minimal global state management |
| `axios` | 1.6 | HTTP client — configured with request/response interceptors |
| `react-hook-form` | 7.49 | Uncontrolled form handling (performant, no re-renders on type) |
| `zod` | 3.22 | TypeScript-first schema validation |
| `@hookform/resolvers` | 3.3 | Zod → React Hook Form resolver bridge |
| `lucide-react` | 0.309 | Consistent SVG icon library |
| `react-hot-toast` | 2.4 | Lightweight toast notification system |
| `clsx` | 2.1 | Conditional class name utility |
| `vite` | 5.0 | Frontend build tool with HMR |

### Backend

| Package | Version | Purpose |
|---|---|---|
| `express` | 4.18 | HTTP server framework |
| `typescript` | 5.3 | Static type checking |
| `mongoose` | 8.0 | MongoDB ODM with schema validation |
| `jsonwebtoken` | 9.0 | JWT signing and verification |
| `bcryptjs` | 2.4 | Async password hashing |
| `express-validator` | 7.0 | Declarative request body/query validation |
| `helmet` | 7.1 | Sets security-related HTTP response headers |
| `express-rate-limit` | 7.1 | In-memory rate limiting per IP |
| `cors` | 2.8 | Configurable CORS policy middleware |
| `morgan` | 1.10 | HTTP request logging (dev only) |
| `dotenv` | 16.3 | `.env` file loading |

### Infrastructure

| Tool | Role |
|---|---|
| MongoDB 7 (Jammy) | Primary database |
| Nginx (Alpine) | SPA static file server + `/api` reverse proxy |
| Docker + Compose | Container orchestration for all three services |
| Node 20 (Alpine) | Backend runtime base image |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
│   ┌────────────┐   ┌──────────────┐   ┌──────────────────────┐  │
│   │   Pages    │   │  Zustand     │   │  Axios + Interceptors│  │
│   │ (React 18) │   │  Auth Store  │   │  (JWT auto-attach)   │  │
│   └────────────┘   └──────────────┘   └──────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTPS / REST (relative /api/*)
┌────────────────────────────▼─────────────────────────────────────┐
│                        Nginx :80                                 │
│   /             →  React SPA  (dist/ static files)              │
│   /api/*        →  proxy_pass  http://backend:5000              │
└────────────────────────────┬─────────────────────────────────────┘
                             │ Internal Docker network (gigflow_net)
┌────────────────────────────▼─────────────────────────────────────┐
│                   Express API  :5000  (Node 20)                  │
│                                                                  │
│  POST /api/auth/*     →  Auth Middleware  →  AuthController      │
│  ANY  /api/leads/*    →  Auth Middleware                         │
│                       →  RBAC Middleware (role check)            │
│                       →  Validator + validate()                  │
│                       →  LeadsController                         │
│                       →  LeadsService  (business logic)          │
│                       →  Mongoose Models                         │
│                                                                  │
│  Unhandled errors  →  Global Error Handler (AppError, Mongo,     │
│                        ValidationError, CastError, 11000)        │
└────────────────────────────┬─────────────────────────────────────┘
                             │ Mongoose ODM
┌────────────────────────────▼─────────────────────────────────────┐
│                      MongoDB 7  :27017                           │
│                                                                  │
│   users              leads                                       │
│   ├─ email (idx)     ├─ status + source (compound idx)           │
│   └─ role  (idx)     ├─ createdAt (idx)                          │
│                      ├─ assignedTo (idx)                         │
│                      └─ name + email (text idx, for search)      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
gigflow-smart-leads-dashboard/
│
├── 📄 docker-compose.yml              # Mongo + API + Frontend orchestration
├── 📄 .env.example                    # Root environment variable template
├── 📄 .gitignore
├── 📄 README.md
├── 📄 GigFlow-API.postman_collection.json
│
├── 📁 backend/
│   ├── 📄 Dockerfile                  # Multi-stage: builder → production (non-root user)
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json               # strict: true, no implicit any, no unused vars
│   ├── 📄 .env.example
│   └── 📁 src/
│       ├── 📄 app.ts                  # Express bootstrap — middleware stack, routes, error handler
│       │
│       ├── 📁 config/
│       │   ├── 📄 db.ts               # Mongoose connect, disconnect, reconnect event hooks
│       │   └── 📄 env.ts              # Typed, validated env — throws on missing required vars
│       │
│       ├── 📁 models/
│       │   ├── 📄 User.model.ts       # Schema + bcrypt pre-save hook + comparePassword()
│       │   └── 📄 Lead.model.ts       # Schema + compound indexes for filter/search queries
│       │
│       ├── 📁 types/
│       │   ├── 📄 auth.types.ts       # IUserPayload, RegisterDto, LoginDto, AuthResponse
│       │   └── 📄 lead.types.ts       # LeadStatus, LeadSource, CreateLeadDto, PaginationMeta
│       │
│       ├── 📁 validators/
│       │   ├── 📄 auth.validator.ts   # express-validator chains for /register and /login
│       │   └── 📄 lead.validator.ts   # Chains for create, update, and query param validation
│       │
│       ├── 📁 middleware/
│       │   ├── 📄 auth.middleware.ts  # JWT verify → DB existence check → attach req.user
│       │   ├── 📄 rbac.middleware.ts  # authorize(...roles) factory — isAdmin, isAdminOrSales
│       │   └── 📄 error.middleware.ts # AppError class, validate(), notFound(), errorHandler()
│       │
│       ├── 📁 services/
│       │   ├── 📄 auth.service.ts     # register(), login(), getProfile()
│       │   └── 📄 leads.service.ts    # CRUD, pagination, export query, dashboard stats
│       │
│       ├── 📁 controllers/
│       │   ├── 📄 auth.controller.ts  # Thin: parse req → call service → send response
│       │   └── 📄 leads.controller.ts # getAll, getOne, create, update, delete, exportCSV, getStats
│       │
│       ├── 📁 routes/
│       │   ├── 📄 auth.routes.ts      # POST /register  POST /login  GET /me
│       │   └── 📄 leads.routes.ts     # Full CRUD + GET /stats + GET /export
│       │
│       ├── 📁 utils/
│       │   ├── 📄 jwt.util.ts         # signToken(), verifyToken(), decodeToken()
│       │   └── 📄 response.util.ts    # sendSuccess(), sendError(), sendCreated(), sendPaginated()
│       │
│       └── 📁 scripts/
│           └── 📄 seed.ts             # Standalone: drops + seeds 3 users and 15 leads
│
└── 📁 frontend/
    ├── 📄 Dockerfile                  # Multi-stage: Vite build → Nginx serve
    ├── 📄 nginx.conf                  # SPA fallback + /api proxy_pass to backend service
    ├── 📄 index.html                  # Root HTML — Inter font preload
    ├── 📄 vite.config.ts              # Path aliases (@/), dev proxy, chunk splitting
    ├── 📄 tailwind.config.js          # darkMode: 'class', custom colours, Inter font
    ├── 📄 tsconfig.json               # strict, path aliases, bundler module resolution
    ├── 📄 .env.example
    └── 📁 src/
        ├── 📄 main.tsx                # ReactDOM.createRoot entry point
        ├── 📄 App.tsx                 # ThemeProvider + AppRouter + Toaster config
        ├── 📄 index.css               # Tailwind directives, custom scrollbar, animations
        │
        ├── 📁 api/
        │   ├── 📄 axios.ts            # Axios instance, auth interceptor, 401/403/429/5xx handling
        │   ├── 📄 auth.api.ts         # register(), login(), getMe()
        │   └── 📄 leads.api.ts        # getAll(), getOne(), create(), update(), delete(),
        │                              # exportCSV(), getStats()
        │
        ├── 📁 types/
        │   ├── 📄 auth.types.ts       # User, LoginDto, RegisterDto, AuthResponse
        │   ├── 📄 lead.types.ts       # Lead, DTOs, LeadFilters, PaginationMeta, DashboardStats
        │   └── 📄 api.types.ts        # Generic ApiResponse<T>
        │
        ├── 📁 context/
        │   ├── 📄 authStore.ts        # Zustand: login, register, logout, initAuth
        │   └── 📄 ThemeContext.tsx     # System-aware dark/light toggle, persisted
        │
        ├── 📁 hooks/
        │   ├── 📄 useDebounce.ts      # Generic debounce hook — useDebounce<T>(value, delay)
        │   └── 📄 useLeads.ts         # All leads state: filters, fetch, delete, CSV export
        │
        ├── 📁 components/
        │   ├── 📁 common/
        │   │   ├── 📄 Button.tsx      # variant, size, isLoading, leftIcon, rightIcon
        │   │   ├── 📄 Input.tsx       # Input, Select, Textarea — all forwardRef, error-aware
        │   │   ├── 📄 Modal.tsx       # Accessible: Escape key, backdrop click, body scroll lock
        │   │   └── 📄 index.tsx       # Badge, Spinner, EmptyState, Pagination
        │   ├── 📁 layout/
        │   │   ├── 📄 Sidebar.tsx     # NavLink active states, user info, role badge, logout
        │   │   ├── 📄 Header.tsx      # Page title, dark mode toggle, notification bell
        │   │   └── 📄 Layout.tsx      # Full-page shell — Sidebar + Header + main content
        │   └── 📁 leads/
        │       ├── 📄 LeadTable.tsx       # Paginated table, role-aware action buttons
        │       ├── 📄 LeadFilters.tsx     # Status + source + sort dropdowns + search input
        │       ├── 📄 LeadForm.tsx        # Create/edit with Zod schema + RHF — reusable
        │       └── 📄 LeadDetailModal.tsx # Read-only full detail view with icon rows
        │
        ├── 📁 pages/
        │   ├── 📄 LoginPage.tsx       # Auth form with demo credential hint card
        │   ├── 📄 RegisterPage.tsx    # Registration with role selector
        │   ├── 📄 DashboardPage.tsx   # Stat cards, breakdowns, recent leads panel
        │   └── 📄 LeadsPage.tsx       # Full leads management: filters + table + modals
        │
        ├── 📁 routes/
        │   ├── 📄 AppRouter.tsx       # Route definitions, initAuth on mount
        │   └── 📄 ProtectedRoute.tsx  # Guards unauthenticated access + optional role check
        │
        └── 📁 utils/
            ├── 📄 formatters.ts       # formatDate(), STATUS_COLORS, SOURCE_COLORS maps
            └── 📄 csv.ts              # Client-side CSV builder + anchor download trigger
```

---

## Quick Start

The fastest path from zero to running app — requires only Docker Desktop.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24+ recommended)
- Git

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/gigflow-smart-leads-dashboard.git
cd gigflow-smart-leads-dashboard

# 2. Create your environment file from the template
cp .env.example .env
```

Open `.env` and replace the `JWT_SECRET` placeholder with a strong secret (32+ characters):

```bash
# Generate a cryptographically secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```bash
# 3. Build images and start all three services
docker compose up --build -d

# 4. Seed the database (first run only)
docker exec gigflow_backend node dist/scripts/seed.js

# 5. Open the app in your browser
```

| Service | URL |
|---|---|
| **Frontend (React app)** | [http://localhost:3000](http://localhost:3000) |
| **Backend API** | [http://localhost:5000](http://localhost:5000) |
| **Health check** | [http://localhost:5000/health](http://localhost:5000/health) |

> ### Demo Credentials
> | Role | Email | Password |
> |---|---|---|
> | Admin | admin@gigflow.com | password123 |
> | Sales | sarah@gigflow.com | password123 |
> | Sales | mike@gigflow.com | password123 |

---

## Manual Setup

For local development without Docker — faster HMR, easier debugging.

### Prerequisites

- Node.js v20+
- MongoDB running locally **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- npm v9+

### Step 1 — Clone

```bash
git clone https://github.com/yourusername/gigflow-smart-leads-dashboard.git
cd gigflow-smart-leads-dashboard
```

### Step 2 — Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` — the two required fields are `MONGODB_URI` and `JWT_SECRET`.

```bash
# Start the API with hot-reload
npm run dev
```

API is now running at **http://localhost:5000**. You should see:

```
✅ MongoDB connected: 127.0.0.1
🚀 GigFlow API running at http://localhost:5000
```

### Step 3 — Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000/api (already correct)

npm run dev
```

App opens at **http://localhost:5173**.

### Step 4 — Seed

With the backend running:

```bash
cd backend
npm run seed
```

```
✅ Connected to MongoDB
🧹 Cleared existing data
👥 Created users
🌱 Seeded 15 leads
✅ Seed completed!
```

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | HTTP server port |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `MONGODB_URI` | **Yes** | `mongodb://localhost:27017/gigflow` | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Signing key for JWT tokens. Min 32 chars. **Never commit.** |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime — e.g. `1d`, `7d`, `30d` |
| `BCRYPT_SALT_ROUNDS` | No | `12` | bcrypt cost factor. 12 is OWASP-recommended for 2024. |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Exact frontend origin for CORS allow-list |

### Frontend — `frontend/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | **Yes** | `http://localhost:5000/api` | Backend API base URL baked into the Vite build |

> **Security note:** The `.env` file is in `.gitignore`. Never commit it.
> Generate a secure `JWT_SECRET` with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## Docker Setup

All three services run on an isolated internal bridge network (`gigflow_net`). The browser never talks directly to the backend — Nginx proxies all `/api/*` requests to the backend container by its Docker service name. Only ports 3000 and 5000 are exposed to the host.

```
Host machine
├── :3000  →  gigflow_frontend (Nginx :80)
│              ├──  /          →  React SPA (dist/ static files)
│              └──  /api/*     →  proxy_pass http://backend:5000
│
└── :5000  →  gigflow_backend  (Node.js :5000)
               └──  mongodb://mongo:27017/gigflow  →  gigflow_mongo
```

### Service Summary

| Service | Image | Exposed Port | Role |
|---|---|---|---|
| `mongo` | `mongo:7-jammy` | none (internal only) | Database |
| `backend` | `./backend` (built) | `5000:5000` | REST API + JWT auth |
| `frontend` | `./frontend` (built) | `3000:80` | Nginx SPA + API proxy |

### Common Commands

```bash
# Start all services in the background
docker compose up -d

# Rebuild images after code changes
docker compose up --build -d

# Stream logs from all services
docker compose logs -f

# Stream logs from one service only
docker compose logs -f backend

# Check health of all containers
docker compose ps

# Stop all services (preserves data volume)
docker compose down

# Stop and wipe the database volume
docker compose down -v

# Open a shell in a running container
docker exec -it gigflow_backend sh

# Run the seed script inside the container
docker exec gigflow_backend node dist/scripts/seed.js

# Restart a single service without rebuilding
docker compose restart backend
```

### Build Strategy

**Backend Dockerfile** — two stages:
1. `builder` — installs all dependencies, runs `tsc` to compile TypeScript to `dist/`
2. `production` — fresh Alpine base, installs prod dependencies only, copies `dist/`, runs as non-root user `gigflow`

**Frontend Dockerfile** — two stages:
1. `builder` — installs all dependencies, runs `vite build` (baking env vars at build time via `ARG`)
2. `production` — `nginx:alpine` base, copies `dist/`, adds custom `nginx.conf` for SPA routing and API proxy

---

## API Reference

**Base URL:** `http://localhost:5000/api`

All protected endpoints require:
```http
Authorization: Bearer <jwt_token>
```

All responses use this consistent envelope:
```json
{
  "success": true | false,
  "message": "Human-readable description",
  "data": { ... } | [ ... ] | null,
  "meta": { ... }
}
```

---

### Authentication

#### `POST /auth/register`

Creates a new user account and returns a JWT token immediately.

**Request body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@company.com",
  "password": "securepass1",
  "role": "sales"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | Yes | 2–100 characters |
| `email` | string | Yes | Valid format, must be unique |
| `password` | string | Yes | Min 6 characters, must contain at least one digit |
| `role` | string | No | `admin` or `sales` — defaults to `sales` |

**Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "64f3a1b2c3d4e5f6a7b8c9d0",
      "name": "Sarah Johnson",
      "email": "sarah@company.com",
      "role": "sales"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error `409`:** Email already registered.
**Error `422`:** Validation failed — `errors` array contains per-field messages.

---

#### `POST /auth/login`

Authenticates a user and returns a JWT token.

**Request body:**
```json
{
  "email": "admin@gigflow.com",
  "password": "password123"
}
```

**Response `200`:** Same shape as register response.

**Error `401`:** Invalid email or password (intentionally vague to prevent user enumeration).

---

#### `GET /auth/me` 🔒

Returns the authenticated user's full profile. No body required — identity is read from the Bearer token.

**Response `200`:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "64f3a1b2c3d4e5f6a7b8c9d0",
    "name": "Admin User",
    "email": "admin@gigflow.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Leads

All leads endpoints require authentication. RBAC role restrictions are noted per endpoint.

---

#### `GET /leads` 🔒

Returns a paginated, filtered, sorted list of leads. Sales users automatically see only their assigned leads — no extra parameters needed.

**Query parameters:**

| Parameter | Type | Accepted Values | Default | Description |
|---|---|---|---|---|
| `page` | integer | ≥ 1 | `1` | Page number |
| `limit` | integer | 1–100 | `10` | Results per page |
| `sort` | string | `latest` \| `oldest` | `latest` | Sort direction by `createdAt` |
| `status` | string | `New` \| `Contacted` \| `Qualified` \| `Lost` | — | Filter by lead status |
| `source` | string | `Website` \| `Instagram` \| `Referral` | — | Filter by lead source |
| `search` | string | any | — | Case-insensitive match on `name` or `email` |

All parameters are optional and combinable:
```
GET /api/leads?status=Qualified&source=Instagram&search=rahul&sort=latest&page=1&limit=10
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [
    {
      "_id": "64f3a1b2c3d4e5f6a7b8c9d1",
      "name": "Rahul Sharma",
      "email": "rahul@techcorp.com",
      "phone": "+91-9876543210",
      "company": "TechCorp India",
      "status": "Qualified",
      "source": "Instagram",
      "notes": "Interested in enterprise plan",
      "assignedTo": {
        "_id": "64f3a1b2c3d4e5f6a7b8c9d2",
        "name": "Sarah Johnson",
        "email": "sarah@company.com"
      },
      "createdBy": {
        "_id": "64f3a1b2c3d4e5f6a7b8c9d0",
        "name": "Admin User",
        "email": "admin@gigflow.com"
      },
      "createdAt": "2024-01-20T08:15:00.000Z",
      "updatedAt": "2024-01-22T14:30:00.000Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### `POST /leads` 🔒 `admin only`

Creates a new lead and returns it fully populated.

**Request body:**
```json
{
  "name": "Priya Patel",
  "email": "priya@startupx.io",
  "phone": "+91-8765432109",
  "company": "StartupX",
  "status": "New",
  "source": "Website",
  "notes": "Signed up from blog post"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | **Yes** | 2–100 characters |
| `email` | string | **Yes** | Valid email format |
| `source` | string | **Yes** | `Website` \| `Instagram` \| `Referral` |
| `status` | string | No | `New` \| `Contacted` \| `Qualified` \| `Lost` — defaults to `New` |
| `phone` | string | No | Valid international phone number |
| `company` | string | No | Max 100 characters |
| `notes` | string | No | Max 1,000 characters |

**Response `201`:** The created lead object, fully populated.

---

#### `GET /leads/stats` 🔒

Returns aggregated pipeline statistics. Admins see all leads; sales users see stats scoped to their assigned leads only.

**Response `200`:**
```json
{
  "success": true,
  "message": "Stats fetched successfully",
  "data": {
    "total": 15,
    "byStatus": {
      "New": 5,
      "Contacted": 3,
      "Qualified": 4,
      "Lost": 3
    },
    "bySource": {
      "Website": 6,
      "Instagram": 5,
      "Referral": 4
    },
    "recentLeads": [
      { "_id": "...", "name": "Rahul Sharma", "status": "Qualified", "createdAt": "..." }
    ]
  }
}
```

---

#### `GET /leads/export` 🔒

Downloads all matching leads as a CSV file. Accepts the same `status`, `source`, and `search` query parameters as `GET /leads`. No `page` or `limit` — exports all matching records.

All fields are RFC 4180 double-quoted to prevent CSV injection. Fields containing quote characters are escaped.

**Response `200`:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename=leads-export.csv

"Name","Email","Phone","Company","Status","Source","Notes","Created At"
"Rahul Sharma","rahul@techcorp.com","+91-9876543210","TechCorp India","Qualified","Instagram","","2024-01-20T08:15:00.000Z"
```

---

#### `GET /leads/:id` 🔒

Returns a single lead by MongoDB ObjectId. Sales users receive a `403` for leads not assigned to them.

**Response `200`:** Full lead object (same shape as list item).

**Error `403`:** Sales user attempting to view a lead not assigned to them.

**Error `404`:** No lead found with this ID.

---

#### `PATCH /leads/:id` 🔒

Partially updates a lead. All body fields are optional. Sales users can update only their assigned leads and cannot change the `assignedTo` field — that field is silently stripped from their request.

**Request body (any subset):**
```json
{
  "status": "Contacted",
  "notes": "Called Monday, demo scheduled for Friday 3pm."
}
```

**Response `200`:** Updated lead object, fully populated.

---

#### `DELETE /leads/:id` 🔒 `admin only`

Permanently deletes a lead. This action is irreversible and bypasses soft delete.

**Response `200`:**
```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": null
}
```

---

### Error Responses

All errors follow this structure:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

The `errors` array is only present on `422` responses.

| Status | When it occurs |
|---|---|
| `400` | Malformed ObjectId in URL param, or failed Mongoose cast |
| `401` | Missing, invalid, or expired Bearer token |
| `403` | Authenticated but insufficient role or wrong lead assignment |
| `404` | Requested resource does not exist |
| `409` | Unique constraint violation (email already registered) |
| `422` | Request body/query failed validation — see `errors` array |
| `429` | Rate limit exceeded (100/15 min globally, 10/15 min on auth) |
| `500` | Unexpected server error — stack trace in development only |

---

## User Roles & Permissions

| Action | Admin | Sales |
|---|---|---|
| View all leads | ✅ | ❌ |
| View own assigned leads | ✅ | ✅ |
| View single lead (unassigned) | ✅ | ❌ `403` |
| Create lead | ✅ | ❌ `403` |
| Update any lead | ✅ | ❌ |
| Update own assigned lead | ✅ | ✅ |
| Change lead assignment | ✅ | ❌ (stripped silently) |
| Delete lead | ✅ | ❌ `403` |
| Export CSV (all leads) | ✅ | ❌ |
| Export CSV (assigned leads) | ✅ | ✅ |
| View all pipeline stats | ✅ | ❌ |
| View own pipeline stats | ✅ | ✅ |

**Important:** Roles are enforced at two independent layers. Bypassing the React UI still hits the API middleware guards. A sales user with a valid JWT cannot read admin-only data regardless of how they construct the HTTP request.

---

## Database Schema

### Collection: `users`

```typescript
{
  _id:       ObjectId
  name:      String        // required, 2–100 chars, trimmed
  email:     String        // required, unique, lowercase, indexed
  password:  String        // bcrypt hash — select: false (never returned by default)
  role:      "admin" | "sales"   // default: "sales"
  isActive:  Boolean       // default: true — soft account disable
  createdAt: Date          // auto (timestamps: true)
  updatedAt: Date          // auto (timestamps: true)
}

Indexes:
  { email: 1 }             // unique — used by login lookup
  { role: 1 }              // used by admin/sales queries
```

### Collection: `leads`

```typescript
{
  _id:        ObjectId
  name:       String        // required, 2–100 chars, trimmed
  email:      String        // required, lowercase, trimmed
  phone:      String?       // optional, international format regex
  company:    String?       // optional, max 100 chars
  status:     "New" | "Contacted" | "Qualified" | "Lost"  // default: "New"
  source:     "Website" | "Instagram" | "Referral"        // required
  notes:      String?       // optional, max 1000 chars
  assignedTo: ObjectId?     // ref: User — null if unassigned
  createdBy:  ObjectId      // ref: User — required
  createdAt:  Date          // auto
  updatedAt:  Date          // auto
}

Indexes:
  { status: 1, source: 1 }          // compound — filter queries
  { createdAt: -1 }                  // sort queries
  { assignedTo: 1 }                  // sales-user scoped queries
  { name: "text", email: "text" }    // full-text search
```

---

## Deployment Guide

### Option A — Render (Backend) + Vercel (Frontend) + MongoDB Atlas

This is the recommended free-tier deployment path.

#### 1. MongoDB Atlas

1. Create a free **M0 cluster** at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Under **Database Access**, create a user with `readWrite` on `gigflow`.
3. Under **Network Access**, add `0.0.0.0/0` (or Render's IP range for stricter security).
4. Click **Connect → Drivers**, select **Node.js**, and copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
   ```

#### 2. Render (Backend API)

1. Create a **New Web Service** at [render.com](https://render.com).
2. Connect your GitHub repository.
3. Configure:
   ```
   Root Directory:    backend
   Runtime:           Node
   Build Command:     npm install && npm run build
   Start Command:     npm start
   ```
4. Under **Environment Variables**, set all values from `.env.example`:
   ```
   NODE_ENV          = production
   MONGODB_URI       = <your Atlas connection string>
   JWT_SECRET        = <your generated 64-char hex secret>
   JWT_EXPIRES_IN    = 7d
   BCRYPT_SALT_ROUNDS= 12
   CORS_ORIGIN       = https://your-app.vercel.app   ← set after Vercel deploy
   ```
5. Deploy. Note the URL: `https://gigflow-api.onrender.com`.

#### 3. Vercel (Frontend)

1. Import your repository at [vercel.com](https://vercel.com).
2. Configure:
   ```
   Framework Preset:  Vite
   Root Directory:    frontend
   Build Command:     npm run build
   Output Directory:  dist
   ```
3. Under **Environment Variables**, add:
   ```
   VITE_API_BASE_URL = https://gigflow-api.onrender.com/api
   ```
4. Deploy. Copy the Vercel URL and update `CORS_ORIGIN` in Render.

#### 4. Seed Production Data (Optional)

Trigger the seed script via Render's shell:

```bash
node dist/scripts/seed.js
```

Or use the Render dashboard **Shell** tab.

---

### Option B — Docker on a VPS (DigitalOcean / Hetzner / AWS EC2)

```bash
# On your server
git clone https://github.com/yourusername/gigflow-smart-leads-dashboard.git
cd gigflow-smart-leads-dashboard
cp .env.example .env
nano .env  # fill in production values

docker compose up --build -d
docker exec gigflow_backend node dist/scripts/seed.js
```

For HTTPS, place Nginx or Caddy in front as a TLS terminator, proxying to `:3000`.

---

### Pre-Deploy Checklist

```
[ ] JWT_SECRET is a random 64-char hex string — not the example placeholder
[ ] CORS_ORIGIN exactly matches the frontend URL (no trailing slash)
[ ] MONGODB_URI uses the Atlas connection string, not localhost
[ ] NODE_ENV is set to "production"
[ ] VITE_API_BASE_URL points to the deployed backend URL + /api
[ ] MongoDB Atlas Network Access allows the backend host IP
[ ] npm run build completes locally without TypeScript errors
```

---

## Seed Data

The seed script drops all existing `users` and `leads`, then inserts a clean demo dataset. It is safe to run repeatedly in development.

```bash
# Local
cd backend && npm run seed

# Docker
docker exec gigflow_backend node dist/scripts/seed.js
```

### Users Created

| Name | Email | Password | Role |
|---|---|---|---|
| Admin User | admin@gigflow.com | password123 | admin |
| Sarah Johnson | sarah@gigflow.com | password123 | sales |
| Mike Chen | mike@gigflow.com | password123 | sales |

### Leads Created

15 realistic leads from companies across India, US, UK, UAE, Mexico, Korea, and Spain — covering all four statuses and all three sources, evenly distributed between Sarah and Mike as assignees.

---

## Future Improvements

### Short-term (1–2 sprints)

- [ ] **Refresh token rotation** — Replace 7-day long-lived JWTs with short-lived access tokens (15 min) and rotating refresh tokens stored in httpOnly cookies
- [ ] **Lead notes history** — Append-only notes log with author and timestamp per entry, rather than a single overwritable notes field
- [ ] **Bulk operations** — Multi-select leads to batch-update status, reassign, export, or delete
- [ ] **Lead activity timeline** — Audit log of every status change, edit, and comment with timestamps
- [ ] **Assignee management UI** — Admin dropdown to reassign leads inline from the table

### Medium-term (1–2 months)

- [ ] **Email notifications** — Notify a sales user by email when they are assigned a new lead or when a lead they own is updated
- [ ] **Advanced analytics page** — Conversion funnel chart, average time-to-close by source, monthly pipeline trend with Recharts
- [ ] **Google OAuth** — Social login as an alternative to email/password
- [ ] **Soft delete with restore** — Archive leads instead of permanently deleting, with an "Archived" filter view and restore action
- [ ] **CSV/XLSX import** — Upload a spreadsheet to bulk-create leads with a column mapping UI and validation preview
- [ ] **Custom lead fields** — Admin UI to define domain-specific fields (e.g. "Budget", "Industry") added to the schema dynamically

### Long-term

- [ ] **Multi-tenancy** — Workspace model so multiple organisations can use the same deployment with full data isolation
- [ ] **Webhook integrations** — Push lead events to Slack, HubSpot, or Zapier when status changes
- [ ] **React Native mobile app** — Companion app with push notifications for newly assigned leads
- [ ] **AI lead scoring** — Rank leads by estimated conversion probability using historical close-rate data
- [ ] **Two-factor authentication** — TOTP via Authenticator app for admin accounts

---

## Contributing

Contributions are welcome. Please follow this workflow:

1. **Fork** the repository and create your branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Write your code** — TypeScript strict mode throughout, zero `any` without a documented reason
3. **Test your changes** manually (automated tests are on the roadmap)
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add bulk lead assignment for admin users"
   git commit -m "fix: correct RBAC check order in getLeadById"
   git commit -m "docs: update deployment guide for Render free tier"
   git commit -m "refactor: extract pagination logic into shared utility"
   ```
5. **Push** your branch and open a Pull Request with a clear description of _what_ changed and _why_

---

## License

[MIT](LICENSE) © 2024 GigFlow Contributors

---

<div align="center">

Built for the **ServiceHive Full Stack Internship Assignment**

Submission → **ritik.yadav@servicehive.tech**
Subject → `MERN Internship Assignment Submission – [Your Name]`

</div>
