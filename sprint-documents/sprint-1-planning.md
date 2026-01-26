# Sprint 1 Planning Document

**Sprint Duration**: January 27 - February 9, 2026 (2 weeks)  
**Focus**: Submission System & Grading Pipeline  
**Status**: 📋 PLANNING

---

## Sprint 1 Objectives

Since Sprint 0 completed all Course & Assignment management work, Sprint 1 can focus entirely on the grading engine:

### Primary Goals

1. **Submission System** - Accept GitHub repository URLs from students
2. **Job Queue** - Bull MQ for asynchronous grading jobs
3. **Docker Sandbox** - Secure test execution environment
4. **Grading Pipeline** - Clone → Test → Analyze → Report
5. **Real-time Updates** - WebSocket progress tracking

### Secondary Goals

1. Fix pre-existing TypeScript errors
2. Improve test coverage
3. Performance optimization

---

## Week 1: Submission & Job Queue

### Day 1 (Monday) - TypeScript Cleanup & Submission Backend

**Morning: Fix Pre-existing Issues**

- [ ] Fix type mismatches in `assignments.service.ts`
- [ ] Fix type mismatches in `courses.service.ts`
- [ ] Fix type mismatches in `rubrics.service.ts`
- [ ] Fix type mismatches in `test-suites.service.ts`
- [ ] Fix unused variable in `auth.service.spec.ts`

**Afternoon: Submission Module**

- [ ] Create SubmissionsModule scaffold
- [ ] Implement `POST /submissions` endpoint
  - Accept GitHub URL
  - Validate URL format
  - Check submission limits (max 5 per student per assignment)
  - Create submission record with PENDING status
- [ ] Implement `GET /submissions/:id` endpoint
- [ ] Implement `GET /submissions/my` endpoint (student's submissions)
- [ ] Add Swagger documentation
- [ ] Write unit tests

**Files to Create:**

```
apps/api/src/submissions/
├── submissions.module.ts
├── submissions.controller.ts
├── submissions.service.ts
└── dto/
    ├── create-submission.dto.ts
    ├── submission-response.dto.ts
    └── index.ts
```

---

### Day 2 (Tuesday) - Bull MQ Job Queue Setup

**Tasks:**

- [ ] Install Bull MQ dependencies in workers app
- [ ] Configure Redis connection for Bull
- [ ] Create GradingModule with queue configuration
- [ ] Create job processors:
  - `grading.processor.ts` - Main orchestrator
  - `clone.processor.ts` - Git repository cloning
- [ ] Implement job creation when submission is made
- [ ] Add job status tracking in database (GradingJob model)
- [ ] Test job creation and processing locally

**Files to Create:**

```
apps/workers/src/
├── grading/
│   ├── grading.module.ts
│   ├── grading.processor.ts
│   ├── processors/
│   │   ├── clone.processor.ts
│   │   ├── test.processor.ts (stub)
│   │   └── report.processor.ts (stub)
│   └── interfaces/
│       └── grading-job.interface.ts
└── queue/
    ├── queue.module.ts
    └── queue.service.ts
```

---

### Day 3 (Wednesday) - Git Clone & Repository Analysis

**Tasks:**

- [ ] Implement secure git clone service
  - Clone to temporary directory
  - Validate repository structure
  - Extract commit hash
- [ ] Create repository analyzer
  - Count files by type
  - Check for required files (package.json, etc.)
  - Detect tech stack
- [ ] Update submission with clone results
- [ ] Handle clone errors gracefully
- [ ] Test with sample repositories

**Security Considerations:**

- Clone timeout (max 5 minutes)
- Repository size limit (100MB)
- Private repository handling
- Cleanup after processing

---

### Day 4 (Thursday) - Docker Sandbox Foundation

**Tasks:**

- [ ] Complete `docker/Dockerfile.sandbox`
  - Node.js 20 Alpine base
  - Install test dependencies (jest, vitest)
  - Security hardening (non-root user)
- [ ] Create sandbox execution service
  - Mount student code read-only
  - Mount test files read-only
  - Capture stdout/stderr
- [ ] Implement resource limits
  - Memory: 512MB max
  - CPU: 1 core
  - Time: 5 minutes max
- [ ] Test sandbox with sample project

**Files to Create:**

```
docker/
├── Dockerfile.sandbox (complete)
└── scripts/
    └── run-tests.sh

apps/workers/src/sandbox/
├── sandbox.module.ts
├── sandbox.service.ts
└── interfaces/
    └── sandbox-result.interface.ts
```

---

### Day 5 (Friday) - Test Execution Pipeline

**Tasks:**

- [ ] Implement test.processor.ts
  - Copy test files to sandbox
  - Execute Jest/Vitest tests
  - Parse test results
  - Calculate scores
- [ ] Create TestResult records in database
- [ ] Handle test timeouts and failures
- [ ] Implement test result parsing
  - Jest JSON reporter
  - Vitest JSON reporter
- [ ] Week 1 review and bug fixes

---

## Week 2: GPT Evaluation & Real-time Updates

### Day 6 (Monday) - GPT Integration Setup

**Tasks:**

- [ ] Configure OpenAI/Anthropic client
- [ ] Create GPTService for semantic analysis
- [ ] Implement code analysis prompts
- [ ] Create criterion evaluation logic
  - Read files specified in criterion
  - Generate evaluation prompt
  - Parse GPT response
  - Calculate scores
- [ ] Add LangSmith integration for tracing
- [ ] Implement token usage tracking

**Files to Create:**

```
apps/workers/src/gpt/
├── gpt.module.ts
├── gpt.service.ts
├── prompts/
│   ├── code-analysis.prompt.ts
│   └── criterion-evaluation.prompt.ts
└── interfaces/
    └── gpt-response.interface.ts
```

---

### Day 7 (Tuesday) - Grading Report Generation

**Tasks:**

- [ ] Implement report.processor.ts
- [ ] Create CriterionScore records
- [ ] Generate final grade calculation
  - Weight by criterion
  - Combine unit test + GPT scores
- [ ] Create grading report
  - Summary with letter grade
  - Per-criterion breakdown
  - Strengths & weaknesses
  - Improvement suggestions
- [ ] Store report as Artifact
- [ ] Update submission status to COMPLETED

---

### Day 8 (Wednesday) - WebSocket Real-time Updates

**Tasks:**

- [ ] Create WebSocket gateway (NestJS)
- [ ] Implement Socket.IO integration
- [ ] Create events:
  - `submission:status` - Status changes
  - `submission:progress` - Step progress
  - `submission:complete` - Final results
- [ ] Add client-side socket connection
- [ ] Create progress UI component
- [ ] Test real-time updates end-to-end

**Files to Create:**

```
apps/api/src/websockets/
├── websockets.module.ts
├── websockets.gateway.ts
└── interfaces/
    └── socket-events.interface.ts

apps/web/src/hooks/
└── use-submission-progress.ts
```

---

### Day 9 (Thursday) - Submission Frontend

**Tasks:**

- [ ] Create submission page for students
  - GitHub URL input
  - Assignment selection
  - Submission history
- [ ] Create submission progress component
  - Real-time status updates
  - Progress bar
  - Step indicators
- [ ] Create submission results page
  - Grade display
  - Criterion breakdown
  - Feedback sections
- [ ] Create submission list for professors
  - Filter by student/assignment
  - Status indicators
  - Quick view

---

### Day 10 (Friday) - Sprint Review & Testing

**Tasks:**

- [ ] End-to-end testing:
  - Submit repository → View progress → See results
- [ ] Performance testing
  - Queue throughput
  - Sandbox execution time
- [ ] Bug fixes and polish
- [ ] Update documentation
- [ ] Sprint 1 demo
- [ ] Sprint 2 planning

---

## Technical Requirements

### Environment Variables to Add

```env
# Redis (Bull MQ)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# OpenAI/Anthropic
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# LangSmith
LANGSMITH_API_KEY=
LANGSMITH_PROJECT=autograder

# Sandbox
SANDBOX_IMAGE=autograder-sandbox:latest
SANDBOX_TIMEOUT=300
SANDBOX_MEMORY_LIMIT=512m

# S3 (Artifacts)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=autograder-artifacts
AWS_REGION=us-east-1
```

### Dependencies to Install

**Workers App:**

```json
{
  "@nestjs/bull": "^10.0.0",
  "bull": "^4.12.0",
  "simple-git": "^3.22.0",
  "dockerode": "^4.0.0",
  "@langchain/openai": "^0.3.0",
  "@langchain/anthropic": "^0.3.0",
  "langsmith": "^0.2.0"
}
```

**API App:**

```json
{
  "@nestjs/websockets": "^10.0.0",
  "@nestjs/platform-socket.io": "^10.0.0",
  "socket.io": "^4.7.0"
}
```

**Web App:**

```json
{
  "socket.io-client": "^4.7.0"
}
```

---

## Database Changes

### New Tables (Already in Schema)

- `Submission` - Already exists
- `GradingJob` - Already exists
- `CriterionScore` - Already exists
- `TestResult` - Already exists
- `Artifact` - Already exists
- `LangSmithTrace` - Already exists

### Potential Migrations

- None required - schema is complete

---

## Risk Assessment

| Risk                       | Likelihood | Impact | Mitigation                   |
| -------------------------- | ---------- | ------ | ---------------------------- |
| Docker sandbox security    | Medium     | High   | Use gVisor/runc with seccomp |
| GPT rate limits            | Medium     | Medium | Implement retry with backoff |
| Large repository handling  | Low        | Medium | Size limits, streaming       |
| WebSocket connection drops | Low        | Low    | Reconnection logic           |
| Test timeout issues        | Medium     | Low    | Configurable timeouts        |

---

## Success Criteria

### Sprint 1 Definition of Done

- [ ] Students can submit GitHub repository URLs
- [ ] Submissions are queued and processed asynchronously
- [ ] Tests run in isolated Docker containers
- [ ] GPT evaluates code against rubric criteria
- [ ] Real-time progress updates via WebSocket
- [ ] Final grade and report generated
- [ ] Professor can view all submissions

### Metrics to Track

| Metric                     | Target      |
| -------------------------- | ----------- |
| Submission → Complete time | < 5 minutes |
| Concurrent submissions     | 10+         |
| Test coverage              | > 70%       |
| API response time          | < 200ms     |
| WebSocket latency          | < 100ms     |

---

## Sprint 1 Review Checklist

At end of Sprint 1, verify:

- [ ] Complete submission flow works
- [ ] Grading pipeline processes all steps
- [ ] Real-time updates show progress
- [ ] Reports are accurate and helpful
- [ ] No security vulnerabilities
- [ ] Documentation updated
- [ ] All tests passing
- [ ] Ready for Sprint 2 (advanced features)
