# AutoGrader Platform

> Transform GitHub Actions-based grading into a full-featured web platform with real-time grading, APIs, and user interface.

## 🏗️ Monorepo Structure

This project uses **Turborepo** for monorepo management.

```
autograder-platform/
├── apps/
│   ├── web/              # Next.js 14 frontend (App Router)
│   ├── api/              # NestJS backend API
│   └── workers/          # Bull MQ background workers
├── packages/
│   ├── database/         # Prisma schema & database client
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configs (ESLint, TypeScript, etc.)
├── docker/               # Docker configurations
└── tests/                # Test templates
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- PostgreSQL 15+
- Redis 7+
- Docker (optional, for local development)

### Installation

```bash
# Install dependencies for all workspaces
npm install

# Start all apps in development mode
npm run dev

# Build all apps
npm run build

# Run tests across all apps
npm run test

# Lint all code
npm run lint

# Type check all TypeScript
npm run type-check
```

## 📦 Workspace Commands

```bash
# Run command in specific workspace
npm run dev --workspace=apps/web
npm run build --workspace=apps/api

# Or use turbo directly
npx turbo run dev --filter=web
npx turbo run test --filter=api
```

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Socket.io-client (real-time)

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- Redis + Bull MQ
- Socket.io (WebSocket)

### Infrastructure
- AWS ECS Fargate
- AWS RDS PostgreSQL
- AWS ElastiCache Redis
- Docker

### AI & Monitoring
- OpenAI GPT-4o API
- LangSmith SDK

## 📚 Documentation

- [Project Architecture](./project-architecture.txt) - Complete technical specification
- [Implementation Roadmap](./indepth-roadmap.txt) - 12-week sprint plan
- [High-Level Overview](./high-overview.txt) - Quick reference guide

## 🏃 Development Roadmap

**Current Status**: Sprint 0 - Day 1 (Project Initialization)

- [x] Phase 1: Repository setup
- [x] Phase 2: Monorepo structure (Turborepo)
- [ ] Phase 3: Next.js frontend setup
- [ ] Phase 4: NestJS backend setup
- [ ] Phase 5: Workers setup
- [ ] Phase 6: Code quality tools
- [ ] Phase 7: Testing & documentation

## 📄 License

Private - Educational Project

## 👥 Team

Team Lead: TBD
Timeline: 12 weeks (Jan 6 - March 30, 2026)
Target Launch: End of March 2026
