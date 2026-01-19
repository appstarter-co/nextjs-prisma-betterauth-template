# Next.js Prisma BetterAuth Free Template

A modern, full-stack Next.js template with authentication, database integration, and a beautiful UI. Perfect for building SaaS applications, dashboards, and web applications quickly.

## ✨ Features

### 🔐 Authentication
- **Better Auth** integration with email/password authentication
- Password reset functionality
- User account management
- Protected routes and middleware support

### 🗄️ Database
- **Prisma ORM** with flexible database support
- SQLite for local development (default)
- PostgreSQL support for production
- Automatic adapter switching based on `DATABASE_URL`
- Type-safe database queries

### 🎨 UI Components
- **Tailwind CSS 4** for styling
- **Radix UI** primitives for accessible components
- **shadcn/ui** component library
- **Lucide React** icons
- Dark mode support with `next-themes`
- Responsive design

### 📊 Additional Features
- **FullCalendar** integration for calendar views
- **React Table** for data tables
- **Recharts** for data visualization
- **Drag & Drop** with dnd-kit
- File upload with FilePond
- Form validation with Zod
- Toast notifications with Sonner
- Animations with Motion

### 🧪 Testing
- **Playwright** for end-to-end testing
- Pre-configured test setup

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn or pnpm
- (Optional) PostgreSQL database for production

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/appstarter-co/nextjs-prisma-betterauth-template.git
cd nextjs-prisma-betterauth-free-template
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Update the following variables:

```env
# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
# Generate with: npx @better-auth/cli secret
# or: openssl rand -base64 32

BETTER_AUTH_URL=http://localhost:3000

# Database (SQLite - Default)
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"

# Database (PostgreSQL - Production)
# DATABASE_URL="postgresql://user:password@host:6543/database?pgbouncer=true"
# DIRECT_URL="postgresql://user:password@host:5432/database"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=

# Email Service (Optional)
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
MAILGUN_URL=https://api.mailgun.net

# Analytics (Optional)
PUBLIC_GOOGLE_ANALYTICS_ID=
PUBLIC_ADOBE_ANALYTICS_ID=
PUBLIC_ADOBE_ANALYTICS_ORG_ID=
```

### 4. Set up the database

Generate Prisma client and create database tables:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

```
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages (login, signup)
│   ├── (protected)/              # Protected routes (dashboard, account, etc.)
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── common/                   # Shared components
│   ├── layout/                   # Layout components
│   └── ui/                       # UI components (shadcn/ui)
├── config/                       # Configuration files
│   ├── site.ts                   # Site configuration
│   ├── sidebar.ts                # Sidebar navigation
│   └── schema.ts                 # Validation schemas
├── context/                      # React context providers
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Better Auth configuration
│   ├── auth-client.ts            # Auth client utilities
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Helper functions
├── prisma/                       # Prisma schema and migrations
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
└── tests/                        # E2E tests
```

## 🗄️ Database

### SQLite (Development)

The template uses SQLite by default for easy local development. No additional setup required.

### PostgreSQL (Production)

To use PostgreSQL:

1. Update your `.env` file with PostgreSQL connection strings:

```env
DATABASE_URL="postgresql://user:password@host:6543/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"
```

2. The Prisma adapter will automatically switch to `@prisma/adapter-pg` when it detects a PostgreSQL connection string.

3. Run migrations:

```bash
npx prisma db push
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run build:prod` | Build with production environment variables |
| `npm run build:staging` | Build with staging environment variables |
| `npm run build:dev` | Build with development environment variables |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run Playwright tests |

## 🎨 Customization

### Site Configuration

Update [config/site.ts](config/site.ts) to customize your site name and logo:

```typescript
export const siteConfigData = {
    siteName: "Your App Name",  
    logo: YourLogoComponent
}
```

### Theme

The template supports dark mode out of the box. Customize colors in [app/globals.css](app/globals.css).

### Database Schema

Modify [prisma/schema.prisma](prisma/schema.prisma) to add or change database tables:

```bash
# After making changes
npx prisma generate
npx prisma db push
```

## 🔐 Authentication Flow

1. Users can sign up with email and password
3. Protected routes are automatically secured
4. Password reset functionality included
5. User profile management available

## 📱 Pages Included

- **Public Pages**
  - Home page
  - Login page
  - Sign up page
  - Error pages (404, 500)

- **Protected Pages**
  - Dashboard
  - Account settings
  - Calendar
  - Settings

## 🧪 Testing

Run end-to-end tests with Playwright:

```bash
npm run test:e2e
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BETTER_AUTH_SECRET` | Secret key for authentication | ✅ |
| `BETTER_AUTH_URL` | Base URL of your application | ✅ |
| `DATABASE_URL` | Database connection string | ✅ |
| `DIRECT_URL` | Direct database connection (for migrations) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌ |
| `TWITTER_CLIENT_ID` | Twitter OAuth client ID | ❌ |
| `TWITTER_CLIENT_SECRET` | Twitter OAuth client secret | ❌ |
| `MAILGUN_API_KEY` | Mailgun API key for emails | ❌ |
| `MAILGUN_DOMAIN` | Mailgun domain | ❌ |
| `LOCAL_AI_API_URL` | Local AI API URL | ❌ |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The template works on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway
- Render

Remember to:
1. Set up a PostgreSQL database
2. Add all required environment variables
3. Run `npm run build` to verify the build succeeds

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Database:** Prisma + SQLite/PostgreSQL
- **Authentication:** Better Auth
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **Forms:** Zod validation
- **Testing:** Playwright
- **Icons:** Lucide React

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review the code comments

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Better Auth](https://www.better-auth.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

Built with ❤️ using Next.js and modern web technologies by appstarter.co.
