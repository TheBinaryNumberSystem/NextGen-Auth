# NextGen Auth.js (TypeScript Edition)

A full-stack authentication system built with **Next.js 14 (App Router)**, **TypeScript**, **Auth.js v5 (`next-auth`)**, **Prisma ORM**, **Neon Serverless Postgres**, **Tailwind CSS**, and **Resend**.

> 💡 **Prefer JavaScript?** An edition written in pure JavaScript is also available: [**NextGen-Auth.js-JS**](https://github.com/TheBinaryNumberSystem/NextGen-Auth.js-JS)

---

## 🌟 Key Features

- **🔐 Auth.js v5 (NextAuth Beta)**: JWT-based session management with `@auth/prisma-adapter` and typed session extensions (`next-auth.d.ts`).
- **🔷 Full TypeScript Coverage**: Strict TypeScript configuration (`"strict": true`) across server actions, route handlers, hooks, forms, and Zod schemas.
- **🐘 Neon Serverless Postgres + Prisma**: Pooled `DATABASE_URL` for application queries, `DATABASE_URL_UNPOOLED` (`directUrl`) for schema pushes/migrations, and `neon.ts` branch policy configuration.
- **🌐 OAuth Providers**: Sign in with **Google** and **GitHub** (configured with `issuer: "https://github.com/login/oauth"` for GitHub RFC 9207 issuer validation and `trustHost: true`).
- **📧 Email Verification & Password Reset**:
  - Token-based email verification on registration (`VerificationToken`, 1-hour expiry).
  - Secure forgot-password and reset-password flow (`PasswordResetToken`, 1-hour expiry) powered by **Resend**.
- **🔒 Two-Factor Authentication (2FA)**:
  - Toggleable per account from `/settings` (for credentials users).
  - Cryptographic 6-digit OTP (`TwoFactorToken`, 5-minute expiry) emailed via Resend and verified via `TwoFactorConfirmation`.
- **👥 Role-Based Access Control (RBAC)**:
  - `USER` and `ADMIN` roles (`UserRole` enum in Prisma).
  - Role-gated UI (`RoleGate`), Server Actions (`actions/admin.ts`), API Routes (`/api/admin`), and Server/Client session examples (`/server`, `/client`).
- **🎨 Modular UI**: Built with Tailwind CSS, Radix UI primitives, React Hook Form, Zod, and Sonner toast notifications.

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: `v18.18.0` or higher (Node.js 20+ recommended)
- **npm**: `v9.0.0` or higher
- A **[Neon](https://neon.tech)** account (or any PostgreSQL database)
- A **[Resend](https://resend.com)** account & API key for sending emails
- **Google Cloud Console** and **GitHub Developer** OAuth credentials (optional, for social login)

---

### 2. Clone the Repository

```bash
git clone https://github.com/TheBinaryNumberSystem/NextGen-Auth.js-TS.git
cd NextGen-Auth.js-TS
```

---

### 3. Install Dependencies

```bash
npm install
```

*(Running `npm install` also triggers `postinstall` to run `prisma generate`.)*

---

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

*(On Windows PowerShell: `Copy-Item .env.example .env`)*

Open `.env` and fill in your credentials:

```env
# ==========================================
# Database Configuration (Neon Serverless Postgres / PostgreSQL)
# ==========================================
DATABASE_URL="postgresql://user:password@ep-example-pooler.region.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:password@ep-example.region.aws.neon.tech/neondb?sslmode=require"

# ==========================================
# Auth.js / NextAuth Configuration
# ==========================================
# Generate a secret: npx auth secret
# Or: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
AUTH_SECRET="your_generated_auth_secret_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==========================================
# Email Service (Resend)
# ==========================================
RESEND_API_KEY="re_your_resend_api_key"

# ==========================================
# OAuth Providers
# ==========================================
# Google Authorized redirect URI: http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# GitHub Authorization callback URL: http://localhost:3000/api/auth/callback/github
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

> **Note on Resend (`lib/mail.ts`):** By default, emails are sent from `onboarding@resend.dev`. Without a verified custom domain in Resend, test emails can only be delivered to the email address registered on your Resend account.

---

### 5. Setup the Database Schema

Push the Prisma schema to your PostgreSQL / Neon database:

```bash
npx prisma db push
```

_(Optional)_ Regenerate Prisma Client or open Prisma Studio:

```bash
npx prisma generate
npx prisma studio
```

*(If you use the Neon CLI, you can also manage branches and pull Neon environment variables with `neon init`, `neon checkout <branch> --create`, and `neon deploy` using `neon.ts`.)*

---

### 6. Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 7. Production Build & Lint

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run start
```

---

## 📁 Project Structure

```text
├── actions/                  # Next.js Server Actions (login, register, logout, reset, settings, admin, etc.)
├── app/
│   ├── (protected)/          # Routes requiring an authenticated session
│   │   ├── _components/      # Protected navbar
│   │   ├── admin/            # Role-gated Admin page (API + Server Action tests)
│   │   ├── client/           # Client Component session example
│   │   ├── server/           # Server Component session example
│   │   ├── settings/         # Account settings (name, email, role, 2FA toggle)
│   │   └── layout.tsx        # Protected layout
│   ├── api/
│   │   ├── admin/            # Admin-only API route handler
│   │   └── auth/[...nextauth]# Auth.js route handlers (GET, POST)
│   ├── auth/                 # Auth pages (login, register, reset, new-password, new-verification, error)
│   ├── globals.css           # Global styles & Tailwind CSS variables
│   ├── layout.tsx            # Root layout with SessionProvider & Toaster
│   └── page.tsx              # Public landing page
├── components/
│   ├── auth/                 # Auth forms, guards, buttons, and social login components
│   ├── ui/                   # Reusable Radix / Shadcn UI components
│   ├── form-error.tsx        # Form error alert banner
│   ├── form-success.tsx      # Form success alert banner
│   └── user-info.tsx         # User session info card
├── data/                     # Prisma query helpers (user, account, verification/reset/2FA tokens)
├── hooks/                    # Client hooks (useCurrentUser, useCurrentRole)
├── lib/                      # Auth helpers (auth.ts), Prisma client (db.ts), Resend mailer (mail.ts), tokens
├── prisma/
│   └── schema.prisma         # PostgreSQL datasource & User/Account/Token models
├── schemas/
│   └── index.ts              # Zod validation schemas
├── auth.config.ts            # Edge-compatible Auth.js provider config (Google, GitHub, Credentials)
├── auth.ts                   # Auth.js initialization, Prisma adapter, callbacks & events
├── middleware.ts             # Route protection & auth redirect middleware
├── neon.ts                   # Neon branch & service configuration
├── next-auth.d.ts            # TypeScript module augmentation for Auth.js Session
└── routes.ts                 # Public, auth, and API route definitions
```

---

## 🛡️ Security & Auth Flow Highlights

1. **Password Hashing**: Passwords are hashed using `bcryptjs` (salt rounds = 10).
2. **Middleware Protection**: `middleware.ts` uses the Edge-compatible `auth.config.ts` and `routes.ts` to protect private routes and redirect unauthenticated requests with `callbackUrl`.
3. **Single-Use Tokens**: Verification, password-reset, and 2FA tokens are deleted immediately once redeemed.
4. **JWT Session Enrichment**: `auth.ts` attaches `id`, `role`, `isTwoFactorEnabled`, and `isOAuth` to the JWT and `session.user` with full TypeScript support via `next-auth.d.ts`.

---

## 🟨 JavaScript Edition

| Edition | Language Stack | Repository Link |
| :--- | :--- | :--- |
| 🟦 **TypeScript Edition** (Current) | TypeScript (`.ts`, `.tsx`) | [TheBinaryNumberSystem/NextGen-Auth.js-TS](https://github.com/TheBinaryNumberSystem/NextGen-Auth.js-TS) |
| 🟨 **JavaScript Edition** | Pure JavaScript (`.js`, `.jsx`) | [TheBinaryNumberSystem/NextGen-Auth.js-JS](https://github.com/TheBinaryNumberSystem/NextGen-Auth.js-JS) |

---

## 📺 Original Tutorial Reference

Based on [Code With Antonio's NextAuth v5 Tutorial](https://youtu.be/1MTyCvS05V4), extended with Neon Postgres configuration, updated Auth.js v5 compatibility fixes, and documentation.

---

## 📄 License

Not required. Just go on 😂.
