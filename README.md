# Cities Monorepo

A Turborepo-based monorepo containing a Next.js cities application and a Hono CRUD API.

## Project Structure

```
.
├── apps/
│   └── cities/          # Next.js application (flowbite-react-template-nextjs)
├── api/
│   └── crud-api/        # Hono API with Drizzle ORM and SQLite
└── package.json         # Root package.json with workspace config
```

### Apps and Packages

- **`apps/cities`**: A [Next.js](https://nextjs.org/) application with [Flowbite React](https://flowbite-react.com/) UI components
  - React 19, Next.js 15, TypeScript
  - Tailwind CSS 4, Flowbite React 0.12.4
  - Vitest for testing
  - Uses `crud-api` workspace package

- **`api/crud-api`**: A [Hono](https://hono.dev/) API server
  - Hono 4.x with Node.js adapter
  - Drizzle ORM with better-sqlite3
  - Zod for validation
  - TypeScript with tsx for development

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (recommended: 20+)
- [pnpm](https://pnpm.io/) (package manager)

## Installation

1. Clone the repository and navigate to the project root
2. Install dependencies:

```sh
pnpm install
```

## Configuration

Each project includes a `.env.example` file for quick setup.

### API Environment Variables

```sh
cd api/crud-api
cp .env.example .env
```

**`api/crud-api/.env`:**

```env
DATABASE_URL=sqlite.db
WEATHER_API_KEY=your_weather_api_key_here
```

The API uses SQLite by default. If you need weather data functionality, obtain an API key from your weather service provider.

### Database Setup

```sh
cd api/crud-api
pnpm db:generate
pnpm db:push
```

### App Environment Variables

```sh
cd apps/cities
cp .env.example .env.local
```

**`apps/cities/.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **Note:** The default API port in the `.env.example` is `8080`

## Database Setup

The API uses Drizzle ORM with SQLite. Run the following commands from `api/crud-api/`:

```sh
cd api/crud-api

# Generate migrations
pnpm db:generate

# Push schema to database
pnpm db:push

# Open Drizzle Studio (optional)
pnpm db:studio
```

## Development

### Run Everything

Start all apps and packages in development mode:

```sh
# From root directory
pnpm dev
# or with turbo
pnpm dev
```

### Run Specific Apps

**API only:**

```sh
# Filter by package name
pnpm dev --filter=crud-api
# or
cd api/crud-api && pnpm dev
```

**Cities app only:**

```sh
# Filter by directory
pnpm dev --filter=./apps/cities
# or
cd apps/cities && pnpm dev
```

The applications will be available at:

- Cities App: http://localhost:3000
- API: http://localhost:3001

## Available Scripts

### Root Level

```sh
pnpm dev       # Start all packages in dev mode
pnpm build     # Build all packages
pnpm lint      # Lint all packages
pnpm format    # Format all code with Prettier
```

### API (`api/crud-api`)

```sh
pnpm dev          # Start development server with hot reload
pnpm build        # Compile TypeScript to dist/
pnpm start        # Run production build
pnpm db:generate  # Generate Drizzle migrations
pnpm db:push      # Push migrations to database
pnpm db:studio    # Open Drizzle Studio
pnpm test         # Run tests with Vitest
pnpm test:run     # Run tests once
```

### Cities App (`apps/cities`)

```sh
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting without fixing
pnpm test         # Run tests with Vitest
pnpm test:run     # Run tests once
```

## Build for Production

```sh
# Build all packages
pnpm build

# Build specific package
pnpm build --filter=crud-api
pnpm build --filter=./apps/cities
```

## Testing

```sh
# Run all tests
pnpm test
```

## Utilities

This monorepo uses:

- [Turborepo](https://turbo.build/) - Build system with caching
- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io) - Code formatting
- [pnpm workspaces](https://pnpm.io/workspaces) - Package management