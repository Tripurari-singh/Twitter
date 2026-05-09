#  Threadly

> A modern full-stack web application built with Next.js, secured with Clerk authentication, powered by PostgreSQL via Prisma ORM, and styled with shadcn/ui components.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?style=flat-square)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)
![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-black?style=flat-square)

---


---

##  Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |

---

##  Features

-  Full authentication flow — sign up, sign in, sign out, and profile management via Clerk
-  Type-safe database access with Prisma ORM
-  PostgreSQL relational database
-  Accessible, themeable UI with shadcn/ui and Tailwind CSS
-  Server and Client Components using the Next.js App Router
-  Light / Dark mode support
-  Fully responsive design

---

##  Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) v18.17 or later
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/download/) (local instance or a hosted provider)
- A [Clerk](https://clerk.com/) account (free tier available)

---

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

See the [Environment Variables](#-environment-variables) section for details on each variable.

### 4. Set up the database

```bash
# Push the Prisma schema to your database
npx prisma db push

# Or run migrations (for production workflows)
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Environment Variables

Create a `.env` file in the root of your project. Below is the full list of required variables.

```env
# -----------------------------------------------
# Database (PostgreSQL)
# -----------------------------------------------
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"

# -----------------------------------------------
# Clerk Authentication
# Get these from: https://dashboard.clerk.com
# -----------------------------------------------
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

> **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

---

##  Database Setup

This project uses **Prisma** as the ORM with a **PostgreSQL** backend.

### Schema location

```
prisma/
└── schema.prisma
```

### Common Prisma commands

```bash
# Generate the Prisma Client after schema changes
npx prisma generate

# Create and apply a new migration
npx prisma migrate dev --name <migration_name>

# Apply pending migrations in production
npx prisma migrate deploy

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Reset the database ( deletes all data)
npx prisma migrate reset
```

### Example schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

##  Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/
│   │   │   └── page.tsx          # Clerk sign-in page
│   │   └── sign-up/[[...sign-up]]/
│   │       └── page.tsx          # Clerk sign-up page
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Protected dashboard
│   │   └── layout.tsx
│   ├── api/
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts      # Clerk webhook handler
│   ├── layout.tsx                # Root layout with ClerkProvider
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn/ui generated components
│   └── ...                       # Custom components
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   └── utils.ts                  # Utility functions (cn, etc.)
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
├── public/                       # Static assets
├── .env                          # Environment variables (not committed)
├── .env.example                  # Example env file (committed)
├── middleware.ts                 # Clerk auth middleware
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

##  Authentication

Authentication is handled entirely by **Clerk**. The `middleware.ts` file protects routes using Clerk's built-in middleware helper.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

### Syncing users to the database

Use Clerk webhooks (`/api/webhooks/clerk`) to sync user creation/update/deletion events to your PostgreSQL database via Prisma.

---

##  UI Components

UI is built with **[shadcn/ui](https://ui.shadcn.com/)**, which generates accessible, customizable components into your project using Tailwind CSS.

### Adding a new component

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add input
# ... and many more
```

All generated components are placed in `components/ui/` and are fully editable.

### Theme customization

Edit the CSS variables in `app/globals.css` to customize the color theme, border radius, and other design tokens.

---

##  Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server at `localhost:3000` |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio database browser |
| `npx prisma migrate dev` | Run database migrations (dev) |
| `npx prisma generate` | Regenerate Prisma Client |

---

##  Deployment

### Vercel

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com/).
3. Add all environment variables from `.env` in the Vercel project settings.
4. Deploy — Vercel auto-detects Next.js and configures the build.

### Database hosting options

- [Neon](https://neon.tech/) — serverless PostgreSQL, generous free tier
- [Render](https://render.com/) — managed PostgreSQL

> After deploying, run `npx prisma migrate deploy` to apply pending migrations to your production database.

---

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

---

##  License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ using Next.js, Clerk, Prisma, PostgreSQL & shadcn/ui</p>