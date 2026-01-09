import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@autograder.dev' },
    update: {},
    create: {
      email: 'admin@autograder.dev',
      passwordHash: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
    },
  });
  console.log('✓ Created admin user');

  // Create Professor User
  const professorPassword = await bcrypt.hash('professor123', 10);
  const professor = await prisma.user.upsert({
    where: { email: 'professor@autograder.dev' },
    update: {},
    create: {
      email: 'professor@autograder.dev',
      passwordHash: professorPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.PROFESSOR,
      githubUsername: 'prof-jsmith',
    },
  });
  console.log('✓ Created professor user');

  // Create Student Users
  const studentPassword = await bcrypt.hash('student123', 10);
  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student1@autograder.dev' },
      update: {},
      create: {
        email: 'student1@autograder.dev',
        passwordHash: studentPassword,
        firstName: 'Alice',
        lastName: 'Johnson',
        role: UserRole.STUDENT,
        githubUsername: 'alice-j',
      },
    }),
    prisma.user.upsert({
      where: { email: 'student2@autograder.dev' },
      update: {},
      create: {
        email: 'student2@autograder.dev',
        passwordHash: studentPassword,
        firstName: 'Bob',
        lastName: 'Williams',
        role: UserRole.STUDENT,
        githubUsername: 'bob-w',
      },
    }),
    prisma.user.upsert({
      where: { email: 'student3@autograder.dev' },
      update: {},
      create: {
        email: 'student3@autograder.dev',
        passwordHash: studentPassword,
        firstName: 'Charlie',
        lastName: 'Davis',
        role: UserRole.STUDENT,
        githubUsername: 'charlie-d',
      },
    }),
  ]);
  console.log('✓ Created 3 student users');

  // Create Course
  const course = await prisma.course.upsert({
    where: { code: 'CS401' },
    update: {},
    create: {
      name: 'Full-Stack Web Development',
      code: 'CS401',
      description: 'Advanced course covering modern web development with React, Node.js, and PostgreSQL',
      semester: 'Spring',
      year: 2025,
      isActive: true,
      professorId: professor.id,
    },
  });
  console.log('✓ Created course: CS401');

  // Enroll Students
  await Promise.all(
    students.map((student) =>
      prisma.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId: student.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          studentId: student.id,
          courseId: course.id,
        },
      })
    )
  );
  console.log('✓ Enrolled 3 students in CS401');

  // Create Rubric
  const rubric = await prisma.rubric.create({
    data: {
      name: 'REST API Assignment Rubric',
      description: 'Rubric for evaluating NestJS REST API projects',
      totalPoints: 100,
      passingGrade: 70,
      metadata: {
        techStack: ['NestJS', 'TypeScript', 'PostgreSQL', 'Prisma'],
        requiredFiles: ['src/app.module.ts', 'src/main.ts'],
        folderStructure: ['src', 'test', 'prisma'],
      },
    },
  });
  console.log('✓ Created rubric');

  // Create Assignment
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // Due in 2 weeks

  const assignment = await prisma.assignment.create({
    data: {
      title: 'REST API with Database Integration',
      description: `Build a RESTful API using NestJS with the following requirements:
- User authentication with JWT
- CRUD operations for Users and Posts
- Database integration with Prisma
- Unit and integration tests
- Proper error handling and validation`,
      dueDate,
      maxSubmissions: 5,
      allowLateSubmissions: true,
      isPublished: true,
      courseId: course.id,
      rubricId: rubric.id,
    },
  });
  console.log('✓ Created assignment');

  // Create Criteria
  const criteria = await Promise.all([
    prisma.criterion.create({
      data: {
        title: 'API Endpoints Implementation',
        maxPoints: 30,
        weight: 1.5,
        evaluationMethod: 'hybrid',
        unitTestWeight: 0.6,
        gptWeight: 0.4,
        gptInstructions: 'Evaluate the quality of REST API endpoints, including proper HTTP methods, status codes, and response structures.',
        filesToAnalyze: ['src/**/*.controller.ts', 'src/**/*.service.ts'],
        levels: {
          excellent: 'All CRUD endpoints implemented with proper HTTP methods and status codes',
          good: 'Most endpoints implemented correctly with minor issues',
          fair: 'Basic endpoints present but missing features or improper status codes',
          poor: 'Incomplete or incorrect API implementation',
        },
        order: 1,
        rubricId: rubric.id,
      },
    }),
    prisma.criterion.create({
      data: {
        title: 'Database Schema & Migrations',
        maxPoints: 20,
        weight: 1.0,
        evaluationMethod: 'gpt_semantic',
        unitTestWeight: 0,
        gptWeight: 1.0,
        gptInstructions: 'Assess the database schema design, including table relationships, constraints, and proper use of Prisma migrations.',
        filesToAnalyze: ['prisma/schema.prisma', 'prisma/migrations/**'],
        levels: {
          excellent: 'Well-designed schema with proper relationships and constraints',
          good: 'Good schema design with minor improvements needed',
          fair: 'Basic schema present but missing key relationships',
          poor: 'Poorly designed or incomplete schema',
        },
        order: 2,
        rubricId: rubric.id,
      },
    }),
    prisma.criterion.create({
      data: {
        title: 'Unit & Integration Tests',
        maxPoints: 25,
        weight: 1.2,
        evaluationMethod: 'unit_test',
        unitTestWeight: 1.0,
        gptWeight: 0,
        gptInstructions: 'Verify test coverage and quality',
        filesToAnalyze: ['test/**/*.spec.ts', 'src/**/*.spec.ts'],
        levels: {
          excellent: '90%+ test coverage with comprehensive test cases',
          good: '70-89% coverage with good test quality',
          fair: '50-69% coverage with basic tests',
          poor: 'Below 50% coverage or poor test quality',
        },
        order: 3,
        rubricId: rubric.id,
      },
    }),
    prisma.criterion.create({
      data: {
        title: 'Authentication & Authorization',
        maxPoints: 15,
        weight: 1.0,
        evaluationMethod: 'hybrid',
        unitTestWeight: 0.5,
        gptWeight: 0.5,
        gptInstructions: 'Evaluate JWT implementation, password hashing, and route protection',
        filesToAnalyze: ['src/auth/**/*.ts', 'src/**/guards/**/*.ts'],
        levels: {
          excellent: 'Secure JWT auth with proper password hashing and guards',
          good: 'JWT auth implemented with minor security considerations',
          fair: 'Basic auth present but security concerns exist',
          poor: 'Insecure or incomplete authentication',
        },
        order: 4,
        rubricId: rubric.id,
      },
    }),
    prisma.criterion.create({
      data: {
        title: 'Code Quality & TypeScript',
        maxPoints: 10,
        weight: 0.8,
        evaluationMethod: 'gpt_semantic',
        unitTestWeight: 0,
        gptWeight: 1.0,
        gptInstructions: 'Assess code organization, TypeScript usage, naming conventions, and overall code quality',
        filesToAnalyze: ['src/**/*.ts'],
        levels: {
          excellent: 'Clean, well-organized code with proper TypeScript types',
          good: 'Good code quality with minor improvements needed',
          fair: 'Acceptable code but lacks organization or proper types',
          poor: 'Poor code quality or TypeScript misuse',
        },
        order: 5,
        rubricId: rubric.id,
      },
    }),
  ]);
  console.log('✓ Created 5 evaluation criteria');

  // Create Test Suite
  const testSuite = await prisma.testSuite.create({
    data: {
      name: 'Backend API Test Suite',
      description: 'Comprehensive tests for REST API endpoints',
      isTemplate: false,
      assignmentId: assignment.id,
    },
  });
  console.log('✓ Created test suite');

  // Create Test Files
  await Promise.all([
    prisma.testFile.create({
      data: {
        fileName: 'api-endpoints.test.ts',
        filePath: 'test/api-endpoints.test.ts',
        content: `import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('API Endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});`,
        isGenerated: false,
        testSuiteId: testSuite.id,
        criterionId: criteria[0].id, // API Endpoints criterion
      },
    }),
    prisma.testFile.create({
      data: {
        fileName: 'auth.test.ts',
        filePath: 'test/auth.test.ts',
        content: `import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});`,
        isGenerated: false,
        testSuiteId: testSuite.id,
        criterionId: criteria[3].id, // Authentication criterion
      },
    }),
  ]);
  console.log('✓ Created test files');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📝 Default credentials:');
  console.log('   Admin:     admin@autograder.dev / admin123');
  console.log('   Professor: professor@autograder.dev / professor123');
  console.log('   Students:  student1@autograder.dev / student123');
  console.log('              student2@autograder.dev / student123');
  console.log('              student3@autograder.dev / student123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
