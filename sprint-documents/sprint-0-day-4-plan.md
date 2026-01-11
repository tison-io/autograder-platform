# Sprint 0 Day 4 - Work Plan

**Date**: January 11, 2026  
**Objective**: Complete Backend Modules & Build Frontend Foundation  
**Estimated Duration**: 8 hours  
**Status**: 🚀 READY TO START

---

## 📋 Overview

Day 4 will complete the remaining critical backend modules that were deferred on Day 3 and build the frontend user interface to connect with our working API. This creates a fully functional end-to-end system for professors and students.

### Current State

✅ **Backend**: Auth, Users, Courses modules complete  
✅ **Database**: Prisma schema, migrations, seed data  
✅ **Frontend**: Next.js setup, shadcn/ui, Tailwind CSS  
⚠️ **Missing**: Assignments, Rubrics, Submissions, TestSuites modules  
⚠️ **Missing**: Frontend pages and API integration

### Day 4 Goals

1. Complete remaining backend modules (Assignments, Rubrics, TestSuites)
2. Build authentication UI (login, register)
3. Create dashboards for professors and students
4. Implement API client with React Query
5. Build course management interface

---

## 🎯 Phase Breakdown

### **Phase 1: Backend - Assignments Module** (60 minutes)

_Complete assignment creation, management, and publishing_

#### 1.1 Create DTOs (15 mins)

- [ ] `CreateAssignmentDto`
  - title, description, dueDate, maxSubmissions, allowLateSubmissions
  - courseId, rubricId (will link after rubric creation)
- [ ] `UpdateAssignmentDto` (Partial of Create)
- [ ] `AssignmentResponseDto` (includes course info, rubric summary)
- [ ] Add validation decorators (@IsNotEmpty, @IsDate, @IsBoolean, etc.)

#### 1.2 Implement AssignmentsService (25 mins)

- [ ] `create(professorId, dto)` - Create assignment (validate professor owns course)
- [ ] `findAll()` - List all assignments
- [ ] `findByCourse(courseId)` - Get assignments for a course
- [ ] `findOne(id)` - Get assignment details with relations
- [ ] `update(id, professorId, dto)` - Update assignment (ownership check)
- [ ] `publish(id, professorId)` - Set `isPublished = true`
- [ ] `remove(id, professorId)` - Delete assignment (ownership check)

#### 1.3 Create AssignmentsController (15 mins)

- [ ] `POST /assignments` - @Roles(PROFESSOR)
- [ ] `GET /assignments` - @Roles(PROFESSOR, ADMIN)
- [ ] `GET /assignments/course/:courseId` - All authenticated
- [ ] `GET /assignments/:id` - All authenticated
- [ ] `PATCH /assignments/:id` - @Roles(PROFESSOR)
- [ ] `POST /assignments/:id/publish` - @Roles(PROFESSOR)
- [ ] `DELETE /assignments/:id` - @Roles(PROFESSOR)

#### 1.4 Testing (5 mins)

- [ ] Test creating assignment for CS401 course
- [ ] Test publishing assignment
- [ ] Test professor ownership validation
- [ ] Test student cannot create/edit assignments

**Deliverable**: Fully functional Assignments CRUD API

---

### **Phase 2: Backend - Rubrics Module** (60 minutes)

_Complete rubric creation, criteria management, and JSON upload_

#### 2.1 Create DTOs (15 mins)

- [ ] `CreateRubricDto`
  - name, description, totalPoints, passingGrade, metadata (JSON)
- [ ] `CreateCriterionDto`
  - title, maxPoints, weight, evaluationMethod, gptInstructions
  - unitTestWeight, gptWeight, filesToAnalyze, levels (JSON)
- [ ] `CreateRubricWithCriteriaDto`
  - rubric + criteria[] (for batch creation)
- [ ] `UploadRubricJsonDto` (validates uploaded JSON structure)
- [ ] `RubricResponseDto` (includes criteria array)

#### 2.2 Create JSON Validation Service (10 mins)

- [ ] `RubricValidationService`
- [ ] `validateRubricJson(json)` - Validate structure
- [ ] `validateCriteriaFormat(criteria[])` - Check fields
- [ ] `validateEvaluationMethods()` - Ensure valid methods
- [ ] `validatePointTotals()` - Sum equals totalPoints

#### 2.3 Implement RubricsService (20 mins)

- [ ] `create(dto)` - Create rubric with criteria (transaction)
- [ ] `uploadFromJson(file, assignmentId)` - Parse and validate JSON
- [ ] `findAll()` - List all rubrics
- [ ] `findOne(id)` - Get rubric with criteria
- [ ] `update(id, dto)` - Update rubric
- [ ] `remove(id)` - Delete rubric (check not linked to assignment)

#### 2.4 Create RubricsController (10 mins)

- [ ] `POST /rubrics` - @Roles(PROFESSOR)
- [ ] `POST /rubrics/upload` - @Roles(PROFESSOR) - File upload
- [ ] `GET /rubrics/:id` - All authenticated
- [ ] `PATCH /rubrics/:id` - @Roles(PROFESSOR)
- [ ] `DELETE /rubrics/:id` - @Roles(PROFESSOR)

#### 2.5 Testing (5 mins)

- [ ] Test creating rubric with 3 criteria
- [ ] Test JSON upload functionality
- [ ] Test validation errors
- [ ] Verify point totals match

**Deliverable**: Rubric creation and upload system

---

### **Phase 3: Backend - Test Suites Module** (45 minutes)

_Complete test file management and template system_

#### 3.1 Create DTOs (10 mins)

- [ ] `CreateTestSuiteDto`
  - name, description, assignmentId, isTemplate, templateType, parameters (JSON)
- [ ] `CreateTestFileDto`
  - fileName, filePath, content, testSuiteId, criterionId (optional)
- [ ] `UploadTestFileDto` - File upload validation
- [ ] `TestSuiteResponseDto` - Include test files count

#### 3.2 Implement TestSuitesService (20 mins)

- [ ] `create(dto)` - Create test suite
- [ ] `findAll()` - List all test suites
- [ ] `findByAssignment(assignmentId)` - Get suites for assignment
- [ ] `findOne(id)` - Get suite with test files
- [ ] `addTestFile(suiteId, dto)` - Add test file to suite
- [ ] `updateTestFile(fileId, dto)` - Update test file content
- [ ] `removeTestFile(fileId)` - Delete test file
- [ ] `remove(id)` - Delete test suite

#### 3.3 Create TestSuitesController (10 mins)

- [ ] `POST /test-suites` - @Roles(PROFESSOR)
- [ ] `GET /test-suites/:id` - All authenticated
- [ ] `GET /test-suites/assignment/:assignmentId` - All authenticated
- [ ] `POST /test-suites/:id/files` - @Roles(PROFESSOR) - Upload file
- [ ] `PATCH /test-suites/:id/files/:fileId` - @Roles(PROFESSOR)
- [ ] `DELETE /test-suites/:id/files/:fileId` - @Roles(PROFESSOR)
- [ ] `DELETE /test-suites/:id` - @Roles(PROFESSOR)

#### 3.4 Testing (5 mins)

- [ ] Create test suite for CS401 assignment
- [ ] Upload sample test file (Jest test)
- [ ] Verify file storage in database
- [ ] Test file CRUD operations

**Deliverable**: Test suite and file management system

---

### **Phase 4: Frontend - API Client Setup** (30 minutes)

_Set up React Query, Axios, and API utilities_

#### 4.1 Install Dependencies (5 mins)

```bash
cd apps/web
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install axios
npm install zustand
npm install zod
npm install react-hook-form @hookform/resolvers
```

#### 4.2 Create API Client (10 mins)

- [ ] `src/lib/api/client.ts` - Axios instance with interceptors
- [ ] Base URL: `http://localhost:3001/api`
- [ ] JWT token injection from localStorage
- [ ] Response/Error interceptors
- [ ] Type-safe request wrapper

#### 4.3 Setup React Query (10 mins)

- [ ] `src/lib/query/provider.tsx` - QueryClientProvider wrapper
- [ ] Configure defaults (staleTime, cacheTime)
- [ ] Add devtools for development
- [ ] Wrap app in layout.tsx

#### 4.4 Create Auth Store (5 mins)

- [ ] `src/lib/store/auth.ts` - Zustand store
- [ ] State: user, token, isAuthenticated
- [ ] Actions: login, logout, setUser
- [ ] Persist token to localStorage

**Deliverable**: API infrastructure ready for frontend

---

### **Phase 5: Frontend - Authentication Pages** (45 minutes)

_Build login and register pages with forms_

#### 5.1 Create Auth API Hooks (10 mins)

- [ ] `src/lib/api/auth.ts`
- [ ] `useRegister()` - POST /auth/register mutation
- [ ] `useLogin()` - POST /auth/login mutation
- [ ] `useCurrentUser()` - GET /auth/me query
- [ ] `useLogout()` - Logout mutation (clear token)

#### 5.2 Build Register Page (15 mins)

- [ ] `app/(auth)/register/page.tsx`
- [ ] Form fields: email, password, firstName, lastName, role
- [ ] Validation with Zod schema
- [ ] Use shadcn/ui Form components
- [ ] Handle errors and success states
- [ ] Redirect to dashboard on success

#### 5.3 Build Login Page (15 mins)

- [ ] `app/(auth)/login/page.tsx`
- [ ] Form fields: email, password
- [ ] Validation with Zod
- [ ] Use shadcn/ui Form components
- [ ] Store JWT token in auth store
- [ ] Redirect based on role (professor → /professor/dashboard)

#### 5.4 Create Auth Layout (5 mins)

- [ ] `app/(auth)/layout.tsx`
- [ ] Centered form container
- [ ] Logo and title
- [ ] Links between login/register

**Deliverable**: Working authentication flow

---

### **Phase 6: Frontend - Shared Components** (30 minutes)

_Build reusable UI components_

#### 6.1 Navigation Components (10 mins)

- [ ] `src/components/layout/navbar.tsx`
- [ ] User menu dropdown (logout, profile)
- [ ] Logo and app title
- [ ] Role-based navigation links
- [ ] Mobile responsive

#### 6.2 Protected Route Component (10 mins)

- [ ] `src/components/auth/protected-route.tsx`
- [ ] Check authentication status
- [ ] Redirect to login if not authenticated
- [ ] Show loading state while checking
- [ ] Role-based access control

#### 6.3 Utility Components (10 mins)

- [ ] `src/components/ui/loading-spinner.tsx` - Full page loader
- [ ] `src/components/ui/empty-state.tsx` - No data placeholder
- [ ] `src/components/ui/error-message.tsx` - Error display
- [ ] `src/components/ui/page-header.tsx` - Consistent page titles

**Deliverable**: Reusable UI component library

---

### **Phase 7: Frontend - Professor Dashboard** (45 minutes)

_Build professor course management interface_

#### 7.1 Create Course API Hooks (10 mins)

- [ ] `src/lib/api/courses.ts`
- [ ] `useCourses()` - GET /courses query
- [ ] `useMyCourses()` - GET /courses/my-courses query
- [ ] `useCourse(id)` - GET /courses/:id query
- [ ] `useCreateCourse()` - POST /courses mutation
- [ ] `useUpdateCourse()` - PATCH /courses/:id mutation
- [ ] `useDeleteCourse()` - DELETE /courses/:id mutation

#### 7.2 Build Dashboard Home (10 mins)

- [ ] `app/(professor)/dashboard/page.tsx`
- [ ] Stats cards: Total Courses, Total Assignments, Total Students
- [ ] Recent activity feed
- [ ] Quick actions (Create Course, Create Assignment)
- [ ] Use shadcn/ui Card components

#### 7.3 Build Courses List Page (15 mins)

- [ ] `app/(professor)/courses/page.tsx`
- [ ] Grid of course cards
- [ ] Each card: name, code, semester, student count
- [ ] "Create Course" button
- [ ] Click card → course details

#### 7.4 Build Create Course Modal (10 mins)

- [ ] `src/components/courses/create-course-dialog.tsx`
- [ ] Form: name, code, description, semester, year
- [ ] Validation with Zod
- [ ] Use shadcn/ui Dialog component
- [ ] Success toast on creation

**Deliverable**: Professor course management UI

---

### **Phase 8: Frontend - Student Dashboard** (30 minutes)

_Build student course viewing interface_

#### 8.1 Build Student Dashboard (10 mins)

- [ ] `app/(student)/dashboard/page.tsx`
- [ ] Enrolled courses grid
- [ ] Upcoming assignments list
- [ ] Recent submissions
- [ ] Stats: Courses, Assignments, Average Grade

#### 8.2 Build Student Courses Page (10 mins)

- [ ] `app/(student)/courses/page.tsx`
- [ ] List enrolled courses
- [ ] Show course details (professor, semester)
- [ ] Click → view assignments

#### 8.3 Build Course Detail View (10 mins)

- [ ] `app/(student)/courses/[id]/page.tsx`
- [ ] Course information
- [ ] List of assignments (published only)
- [ ] Assignment cards with due dates
- [ ] Submit button (link to submission page)

**Deliverable**: Student course viewing interface

---

### **Phase 9: Testing & Integration** (30 minutes)

_End-to-end testing of all features_

#### 9.1 Backend API Testing (10 mins)

- [ ] Test all new endpoints with Postman/cURL
- [ ] Assignments CRUD
- [ ] Rubrics with criteria
- [ ] Test suites with files
- [ ] Verify RBAC on all endpoints

#### 9.2 Frontend Flow Testing (15 mins)

- [ ] Register new professor account
- [ ] Login as professor
- [ ] Create new course
- [ ] View courses list
- [ ] Register student account
- [ ] Login as student
- [ ] View enrolled courses
- [ ] Test logout flow

#### 9.3 Bug Fixes & Polish (5 mins)

- [ ] Fix any TypeScript errors
- [ ] Improve loading states
- [ ] Add proper error messages
- [ ] Test responsive design

**Deliverable**: Fully tested system

---

### **Phase 10: Documentation** (15 minutes)

_Document the day's work_

#### 10.1 Update README Files (5 mins)

- [ ] Update `apps/api/README.md` with new endpoints
- [ ] Update `apps/web/README.md` with new pages
- [ ] Add environment variables to documentation

#### 10.2 Create Sprint 0 Day 4 Report (10 mins)

- [ ] `sprint-documents/sprint-0-day-4-completion-report.md`
- [ ] Document all phases completed
- [ ] List API endpoints created
- [ ] Show frontend pages built
- [ ] Include screenshots (optional)
- [ ] Note any issues encountered

**Deliverable**: Complete documentation

---

## 📊 Expected Outcomes

### Backend Modules Completed

✅ Assignments Module (7 endpoints)  
✅ Rubrics Module (5 endpoints)  
✅ TestSuites Module (7 endpoints)  
✅ 19 new API endpoints total

### Frontend Pages Built

✅ Login & Register pages  
✅ Professor Dashboard  
✅ Professor Courses List  
✅ Student Dashboard  
✅ Student Courses List  
✅ Course Detail View  
✅ 6 new pages total

### Infrastructure

✅ React Query setup with devtools  
✅ Axios API client with interceptors  
✅ Zustand auth store  
✅ Protected route components  
✅ Reusable UI components

---

## 🎯 Success Criteria

By end of day, you should be able to:

- [ ] Register as professor via web UI
- [ ] Login and see professor dashboard
- [ ] Create a new course via UI
- [ ] View created course in list
- [ ] Register as student via web UI
- [ ] Login and see student dashboard
- [ ] View enrolled courses
- [ ] All API endpoints responding correctly
- [ ] No TypeScript compilation errors
- [ ] All tests passing (manual)

---

## 🛠️ Commands Quick Reference

### Development

```bash
# Start all services
npm run dev

# Start frontend only
npm run dev --workspace=apps/web

# Start backend only
npm run dev --workspace=apps/api

# Database
npm run db:studio --workspace=packages/database
```

### Testing

```bash
# Test API endpoint
curl -X POST http://localhost:3001/api/assignments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Assignment",...}'

# Open frontend
open http://localhost:3000
```

---

## 📝 Notes

### Important Considerations

1. **Schema Alignment**: Review Prisma schema carefully before creating DTOs
2. **RBAC**: Every endpoint needs proper @Roles() decorator
3. **Validation**: Use class-validator decorators on all DTOs
4. **Error Handling**: Wrap mutations in try-catch blocks
5. **Loading States**: Add loading spinners for all async operations

### Potential Challenges

- Rubric JSON structure validation (complex nested objects)
- File upload for test files (use Multer interceptor)
- React Query cache invalidation after mutations
- TypeScript types alignment between backend DTOs and frontend

### Time Management

- If running behind, defer Phase 8 (Student Dashboard) to Day 5
- Priority: Complete backend modules first (Phases 1-3)
- Frontend can be polished incrementally

---

## 🚀 Ready to Begin?

1. ✅ Ensure Docker containers running (postgres, redis)
2. ✅ Verify API running on http://localhost:3001
3. ✅ Verify frontend running on http://localhost:3000
4. ✅ Open Prisma Studio for database inspection
5. ✅ Have Postman/Thunder Client ready for API testing

**Let's build! 💪**

---

**Document Created**: January 11, 2026  
**Estimated Completion Time**: 8 hours  
**Sprint**: 0 (Setup & Foundation)  
**Day**: 4 of 5
