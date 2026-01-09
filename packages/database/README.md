# @autograder/database

Database package for the AutoGrader Platform using Prisma ORM with PostgreSQL.

## Overview

This package contains:

- **Prisma Schema**: Complete database schema with 14 models and relationships
- **Prisma Client**: Singleton client for database access
- **Migrations**: Database migration history
- **Seed Data**: Initial development data including users, courses, and assignments

## Database Schema

### Core Models (14 total)

1. **User** - System users (Admin, Professor, Student)
2. **Course** - Academic courses
3. **Enrollment** - Student-Course relationships
4. **Assignment** - Course assignments
5. **Rubric** - Grading rubrics with criteria
6. **Criterion** - Individual evaluation criteria
7. **TestSuite** - Test collections
8. **TestFile** - Individual test files
9. **Submission** - Student submissions
10. **GradingJob** - Background grading jobs
11. **CriterionScore** - Scores per criterion
12. **TestResult** - Test execution results
13. **Artifact** - Generated files (reports, logs)
14. **LangSmithTrace** - LLM observability traces

### Enums

- `UserRole`: PROFESSOR, STUDENT, ADMIN
- `SubmissionStatus`: PENDING, CLONING, TESTING, ANALYZING, GRADING, COMPLETED, FAILED
- `TestTemplateType`: BACKEND_API, FRONTEND_COMPONENTS, DATABASE, etc.

## Setup

### 1. Environment Variables

Create a `.env` file:

```bash
DATABASE_URL="postgresql://autograder:autograder_dev_password@localhost:5432/autograder_dev?schema=public"
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Run Migrations

```bash
npm run db:migrate
```

### 4. Seed Database

```bash
npm run db:seed
```

## Available Scripts

| Script              | Description                            |
| ------------------- | -------------------------------------- |
| `db:generate`       | Generate Prisma Client                 |
| `db:migrate`        | Run migrations (dev)                   |
| `db:migrate:deploy` | Deploy migrations (production)         |
| `db:push`           | Push schema changes without migration  |
| `db:seed`           | Seed database with initial data        |
| `db:studio`         | Open Prisma Studio GUI                 |
| `db:reset`          | Reset database (drop + migrate + seed) |
| `db:format`         | Format schema file                     |
| `db:validate`       | Validate schema                        |

## Usage in Applications

### Import Prisma Client

```typescript
import { prisma } from '@autograder/database';

// Query users
const users = await prisma.user.findMany({
  where: { role: 'STUDENT' },
});

// Create submission
const submission = await prisma.submission.create({
  data: {
    githubRepoUrl: 'https://github.com/user/repo',
    status: 'PENDING',
    studentId: 'user_id',
    assignmentId: 'assignment_id',
    attemptNumber: 1,
  },
});
```

### Relationships Example

```typescript
// Get assignment with rubric and criteria
const assignment = await prisma.assignment.findUnique({
  where: { id: 'assignment_id' },
  include: {
    rubric: {
      include: {
        criteria: true,
      },
    },
    testSuites: {
      include: {
        testFiles: true,
      },
    },
  },
});
```

## Seeded Data

Default credentials after seeding:

| Role      | Email                    | Password     |
| --------- | ------------------------ | ------------ |
| Admin     | admin@autograder.dev     | admin123     |
| Professor | professor@autograder.dev | professor123 |
| Student 1 | student1@autograder.dev  | student123   |
| Student 2 | student2@autograder.dev  | student123   |
| Student 3 | student3@autograder.dev  | student123   |

**Sample Course**: CS401 - Full-Stack Web Development (Spring 2025)
**Sample Assignment**: REST API with Database Integration

## Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

Opens at http://localhost:5555

## Migration Workflow

### Create Migration

```bash
npm run db:migrate
```

### Deploy Migration (Production)

```bash
npm run db:migrate:deploy
```

### Reset Database

```bash
npm run db:reset
# Drops DB → Runs migrations → Runs seed
```

## Key Features

### 1. Hybrid Grading System

Criteria support three evaluation methods:

- **unit_test**: Pure test-based scoring
- **gpt_semantic**: LLM-based evaluation
- **hybrid**: Combination of both

### 2. Submission Tracking

Complete audit trail:

- Submission status lifecycle
- Grading job progress
- Test results with details
- Criterion scores with justification
- Artifacts (reports, logs)

### 3. LangSmith Integration

`LangSmithTrace` model tracks:

- LLM API calls
- Token usage
- Latency metrics
- Cost tracking

### 4. Flexible Test System

- Template-based test generation
- Custom test files per criterion
- Multiple test suites per assignment

## Database Relations

```
User (Professor) → Course → Assignment → Rubric → Criterion
                     ↓         ↓
                  Enrollment  TestSuite → TestFile
                     ↓
User (Student) → Submission → GradingJob
                     ↓
                  CriterionScore
                  TestResult
                  Artifact
                  LangSmithTrace
```

## Best Practices

### 1. Use Transactions

```typescript
await prisma.$transaction(async (tx) => {
  const submission = await tx.submission.create({ ... });
  const job = await tx.gradingJob.create({ ... });
  return { submission, job };
});
```

### 2. Optimize Queries

```typescript
// ✅ Good: Select specific fields
const users = await prisma.user.findMany({
  select: { id: true, email: true, firstName: true },
});

// ❌ Avoid: Fetching all fields
const users = await prisma.user.findMany();
```

### 3. Handle Relations Efficiently

```typescript
// Use include for needed relations only
const submission = await prisma.submission.findUnique({
  where: { id },
  include: {
    student: { select: { firstName: true, lastName: true } },
    criteriaScores: true,
  },
});
```

## Troubleshooting

### Reset Database

If migrations are out of sync:

```bash
npm run db:reset
```

### Generate Client

After schema changes:

```bash
npm run db:generate
```

### Validate Schema

Check for errors:

```bash
npm run db:validate
```

## Development

### Adding New Models

1. Edit `prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Update seed script if needed
4. Regenerate client: `npm run db:generate`

### Schema Format

```bash
npm run db:format
```

## Production Deployment

1. Set `DATABASE_URL` environment variable
2. Run migrations: `npm run db:migrate:deploy`
3. Generate client: `npm run db:generate`
4. (Optional) Seed: `npm run db:seed`

## Dependencies

- `@prisma/client`: ^5.22.0
- `prisma`: ^5.22.0 (dev)
- `bcryptjs`: ^3.0.3 (password hashing)
- `tsx`: ^4.21.0 (TypeScript execution)

## License

Private - Internal use only
