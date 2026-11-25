# NextGen Auth.js (with JavaScript)

A modern, production-grade full-stack authentication system built with **Next.js 16 (App Router)**, **Auth.js v5 (Next-Auth)**, **Prisma ORM**, **Neon Serverless Postgres**, **Tailwind CSS v4**, and **Nodemailer**.

Written entirely in **pure JavaScript** (`.js`, `.jsx`).

> 💡 **Looking for TypeScript?** An identical version written in full TypeScript is also available: [**NextGen_Auth.js (TypeScript Edition)**](https://github.com/TheBinaryNumberSystem/NextGen_Auth.js)

---

## 🌟 Key Features

- **🔐 Next-Auth / Auth.js v5 (Beta)**: Modern session management using JWT strategy with secure cookie storage.
- **⚡ Pure JavaScript**: 100% clean `.js` and `.jsx` implementation without TypeScript configuration overhead.
- **🐘 Neon Serverless Postgres**: High-performance relational database with pooled and direct connection support.
- **🌐 OAuth Providers**: Integrated with **Google** and **GitHub** OAuth authentication.
- **🛡️ Strict OAuth Separation**:
  - OAuth on `/auth/login` checks if an account exists; unregistered OAuth logins are blocked with a clear prompt to register first.
  - OAuth on `/auth/register` provisions new user accounts.
- **🔒 Two-Factor Authentication (2FA)**:
  - Toggleable in user Settings.
  - Generates cryptographic 6-digit OTP tokens with 5-minute expiration.
  - Delivers codes directly to the user's inbox via Nodemailer.
- **📧 Email Verification & Password Reset**:
  - Token-based email verification for new account registrations.
  - Secure "Forgot Password" flow with token invalidation upon use.
  - Dynamic 3-second live countdown with automatic client redirection to `/auth/login`.
- **🛡️ Password Security Measures**:
  - **Complexity Policy**: Passwords must contain at least 6 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.
  - **No Password Reuse**: Re-using the current password when resetting or updating password in Settings is prevented.
  - **Smart Input Controls**: Custom interactive eye visibility toggle (`Eye` / `EyeOff`) that auto-disables when the input is empty and defaults to a masked slash icon. Native browser reveal icons are cleaned up.
- **👥 Role-Based Access Control (RBAC)**:
  - `USER` and `ADMIN` roles.
  - Role-protected Server Components, Client Components, and Admin API routes.
- **🎨 Glassmorphic Modern UI**:
  - Crafted with Tailwind CSS v4, Radix UI, and Lucide icons.
  - Floating pill navigation bar, animated button loading indicators, and clean form validation states.

---

## 🚀 Getting Started

Follow these step-by-step instructions to get the application running on your local machine.

### 1. Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v18.18.0` or higher (Node.js 20+ recommended)
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)
- A free **[Neon Postgres](https://neon.tech)** account (or local PostgreSQL instance)
- A **Gmail** account (or SMTP provider) for sending authentication emails
- **Google Cloud Console** and **GitHub Developer** accounts (for OAuth)

---

### 2. Clone the Repository

```bash
git clone https://github.com/TheBinaryNumberSystem/NextGen-Auth.js-JS.git
cd NextGen-Auth.js-JS
```

---

### 3. Install Dependencies

Install all project dependencies:

```bash
npm install
```

---

### 4. Configure Environment Variables

Create a `.env` file in the root directory by copying the provided example:

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials:

```env
# ==========================================
# Database Configuration (Neon Serverless Postgres)
# ==========================================
# Neon Console -> Dashboard -> Connection Details -> Pooled connection
DATABASE_URL="postgresql://user:password@ep-example-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Neon Console -> Dashboard -> Connection Details -> Direct connection
DATABASE_URL_UNPOOLED="postgresql://user:password@ep-example.region.aws.neon.tech/neondb?sslmode=require"

# ==========================================
# Auth.js / NextAuth Configuration
# ==========================================
# Generate a secret by running: npx auth secret (or openssl rand -base64 32)
AUTH_SECRET="your_generated_auth_secret_here"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==========================================
# Email Service (Nodemailer / Gmail SMTP)
# ==========================================
NODEMAILER_EMAIL="your-email@gmail.com"
# Generate a Google App Password:
# Google Account -> Security -> 2-Step Verification -> App Passwords
NODEMAILER_PW="your_16_character_app_password"

# ==========================================
# Google OAuth Configuration
# ==========================================
# Google Cloud Console -> APIs & Services -> Credentials -> Create OAuth Client ID
# Authorized redirect URI: http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# ==========================================
# GitHub OAuth Configuration
# ==========================================
# GitHub Settings -> Developer Settings -> OAuth Apps -> New OAuth App
# Authorization callback URL: http://localhost:3000/api/auth/callback/github
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

---

### 5. Setup the Database Schema

Sync the Prisma schema with your Neon Postgres database:

```bash
# Push the schema definitions directly to the database
npx prisma db push

# Generate the Prisma Client
npx prisma generate
```

_(Optional)_ Launch Prisma Studio to inspect and manage your database visually:

```bash
npx prisma studio
```

---

### 6. Run the Application

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:3000
```

---

### 7. Production Build

To test or deploy a production build:

```bash
# Build the Next.js application
npm run build

# Start the production server
npm run start
```

---

## 📁 Project Structure

```text
├── actions/                  # Next.js Server Actions (login, register, reset, settings, etc.)
├── app/
│   ├── (protected)/          # Protected routes requiring active session
│   │   ├── _components/      # Navigation bar and protected components
│   │   ├── admin/            # Role-gated admin page
│   │   ├── client/           # Client component example
│   │   ├── server/           # Server component example
│   │   └── settings/         # User profile, 2FA toggle, and password settings
│   ├── api/
│   │   ├── admin/            # Protected admin API route
│   │   └── auth/[...nextauth]# Auth.js route handlers
│   ├── auth/                 # Public auth pages (login, register, reset, verify, error)
│   ├── globals.css           # Global Tailwind CSS v4 styling & overrides
│   ├── layout.jsx            # Root HTML layout and session provider
│   └── page.jsx              # Landing home page
├── components/
│   ├── auth/                 # Auth UI components (login-form, register-form, social, etc.)
│   ├── ui/                   # Reusable Shadcn UI primitives (button, card, dialog, etc.)
│   └── user-info.jsx         # User details presentation component
├── data/                     # Database query utilities (user, tokens, confirmation)
├── hooks/                    # Custom React hooks (useCurrentUser, useCurrentRole)
├── lib/                      # Core libraries (auth helpers, db client, mailer, tokens)
├── prisma/
│   └── schema.prisma         # Prisma schema and model definitions
├── auth.config.js            # Auth.js provider configuration
├── auth.js                   # Auth.js main initialization, callbacks, and Prisma adapter
├── middleware.js             # Route protection and redirection middleware
├── routes.js                 # Public, auth, and API route definitions
└── schemas/index.js          # Zod validation schemas and regex rules
```

---

## 🛡️ Security Details

1. **Password Hashing**: Passwords are encrypted using `bcryptjs` with a cost factor of 10.
2. **Tokens Lifecycle**: Verification and Password Reset tokens are single-use and automatically cleaned up upon successful redemption.
3. **Two-Factor Expiry**: 2FA OTP codes are valid for 5 minutes and immediately destroyed once verified.
4. **Credential Isolation**: Client forms validate input boundaries with Zod before payloads reach server actions, protecting against parameter tampering.
5. **Session Safety**: Sessions use JWT with strict HTTP-only cookies and SameSite protection.

---

## 🔷 TypeScript Edition

Build this application in both TypeScript and JavaScript.

| Edition | Language Stack | Repository Link |
| :--- | :--- | :--- |
| 🟨 **JavaScript Edition** (Current) | Pure JavaScript (`.js`, `.jsx`) | https://github.com/TheBinaryNumberSystem/NextGen-Auth.js-JS |
| 🟦 **TypeScript Edition** | Full TypeScript (`.ts`, `.tsx`) | https://github.com/TheBinaryNumberSystem/NextGen-Auth.js-TS |

---

## 📄 License

Not required. Just go on 😂.
