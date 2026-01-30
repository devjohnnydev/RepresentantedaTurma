# Replit.md - SENAI Student Representative Election System

## Overview

This is a student representative election system for SENAI DEV-SESI school (2026 elections). The application manages a complete election workflow with three phases: candidate registration, voting, and results display. Students can register as candidates, vote for male and female representatives, and view election results with celebratory animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom SENAI brand colors (primary red: #E30613)
- **Animations**: Framer Motion for page transitions, canvas-confetti for celebration effects
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints with strict Zod validation
- **Build System**: Custom esbuild + Vite build process
- **Development**: Vite dev server with HMR integration

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` for type-safe schema definitions
- **Migrations**: Drizzle Kit for database migrations (`drizzle-kit push`)
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Management**: Express sessions with PostgreSQL store
- **User Storage**: Users table with admin flag support
- **Protected Routes**: Middleware-based route protection

### Key Design Patterns
1. **Shared Types**: Schema and route definitions in `shared/` directory for full-stack type safety
2. **Phase-Based Workflow**: Election phases (registration → voting → results) stored in settings table
3. **Gender-Based Voting**: Separate candidate lists and votes for male/female representatives
4. **Admin Controls**: Phase management and candidate approval through admin panel
5. **File Uploads**: Multer-based image upload for candidate photos

### Project Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities
├── server/          # Express backend
│   ├── routes.ts    # API route definitions
│   ├── storage.ts   # Database operations
│   └── replit_integrations/  # Auth integration
├── shared/          # Shared types and schemas
│   ├── schema.ts    # Drizzle table definitions
│   ├── routes.ts    # API contract definitions
│   └── models/      # Auth models
└── migrations/      # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Required Secrets**: SESSION_SECRET, ISSUER_URL (defaults to Replit OIDC)

### File Storage
- **Local Storage**: Candidate photos stored in `client/public/uploads/`
- **Multer**: Multipart form handling for file uploads (5MB limit)

### Third-Party Services
- No external APIs beyond Replit Auth

### Key NPM Packages
- Express + express-session for server
- React + React Query for frontend
- Radix UI + Tailwind for UI components
- Zod for validation across stack
- Framer Motion + canvas-confetti for animations