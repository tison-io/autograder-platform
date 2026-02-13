import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TestSuitesService } from './test-suites.service';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateTestSuiteDto,
  UpdateTestSuiteDto,
  CreateTestFileDto,
  UpdateTestFileDto,
} from './dto';

describe('TestSuitesService', () => {
  let service: TestSuitesService;
  let prisma: PrismaService;

  // Mock data
  const professorId = 'test-professor-id';
  const courseId = 'test-course-id';
  const assignmentId = 'test-assignment-id';
  const testSuiteId = 'test-suite-id';
  const testFileId = 'test-file-id';
  const criterionId = 'test-criterion-id';

  const mockCourse = {
    id: courseId,
    name: 'Test Course',
    code: 'TEST101',
    professorId,
    description: 'Test description',
    semester: 'Spring',
    year: 2026,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAssignment = {
    id: assignmentId,
    title: 'Test Assignment',
    description: 'Test assignment description',
    courseId,
    course: mockCourse,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTestSuite = {
    id: testSuiteId,
    name: 'Backend API Tests',
    description: 'Tests for backend API endpoints',
    assignmentId,
    isTemplate: false,
    templateType: null,
    parameters: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    assignment: {
      id: assignmentId,
      title: 'Test Assignment',
    },
  };

  const mockTestFile = {
    id: testFileId,
    fileName: 'api-endpoints.test.js',
    filePath: 'tests/api-endpoints.test.js',
    content: 'describe("API Tests", () => { it("should work", () => {}); });',
    isGenerated: false,
    testSuiteId,
    criterionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    testSuite: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    testFile: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    assignment: {
      findUnique: jest.fn(),
    },
    criterion: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestSuitesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TestSuitesService>(TestSuitesService);
    prisma = module.get<PrismaService>(PrismaService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateTestSuiteDto = {
      name: 'Backend API Tests',
      description: 'Tests for backend API endpoints',
      assignmentId,
      isTemplate: false,
    };

    it('should create a test suite successfully', async () => {
      mockPrismaService.assignment.findUnique.mockResolvedValue(mockAssignment);
      mockPrismaService.testSuite.create.mockResolvedValue(mockTestSuite);

      const result = await service.create(professorId, createDto);

      expect(mockPrismaService.assignment.findUnique).toHaveBeenCalledWith({
        where: { id: assignmentId },
        include: { course: true },
      });
      expect(mockPrismaService.testSuite.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id', testSuiteId);
      expect(result).toHaveProperty('name', 'Backend API Tests');
    });

    it('should throw NotFoundException when assignment does not exist', async () => {
      mockPrismaService.assignment.findUnique.mockResolvedValue(null);

      await expect(service.create(professorId, createDto)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.testSuite.create).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when professor does not own the assignment', async () => {
      const assignmentWithDifferentProfessor = {
        ...mockAssignment,
        course: { ...mockCourse, professorId: 'different-professor-id' },
      };
      mockPrismaService.assignment.findUnique.mockResolvedValue(assignmentWithDifferentProfessor);

      await expect(service.create(professorId, createDto)).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.testSuite.create).not.toHaveBeenCalled();
    });

    it('should create test suite with template information', async () => {
      const templateDto: CreateTestSuiteDto = {
        ...createDto,
        isTemplate: true,
        templateType: 'BACKEND_API',
        parameters: { endpoints: ['/api/users', '/api/courses'] },
      };

      mockPrismaService.assignment.findUnique.mockResolvedValue(mockAssignment);
      mockPrismaService.testSuite.create.mockResolvedValue({
        ...mockTestSuite,
        isTemplate: true,
        templateType: 'BACKEND_API',
        parameters: { endpoints: ['/api/users', '/api/courses'] },
      });

      const result = await service.create(professorId, templateDto);

      expect(result.isTemplate).toBe(true);
      expect(result.templateType).toBe('BACKEND_API');
    });
  });

  describe('findAll', () => {
    it('should return all test suites', async () => {
      const mockTestSuites = [
        { ...mockTestSuite, testFiles: [] },
        { ...mockTestSuite, id: 'test-suite-2', name: 'Frontend Tests', testFiles: [] },
      ];
      mockPrismaService.testSuite.findMany.mockResolvedValue(mockTestSuites);

      const result = await service.findAll();

      expect(mockPrismaService.testSuite.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('testFileCount', 0);
    });

    it('should return empty array when no test suites exist', async () => {
      mockPrismaService.testSuite.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findByAssignment', () => {
    it('should return test suites for a specific assignment', async () => {
      const mockTestSuites = [
        { ...mockTestSuite, testFiles: [mockTestFile] },
        { ...mockTestSuite, id: 'test-suite-2', name: 'Integration Tests', testFiles: [] },
      ];
      mockPrismaService.testSuite.findMany.mockResolvedValue(mockTestSuites);

      const result = await service.findByAssignment(assignmentId);

      expect(mockPrismaService.testSuite.findMany).toHaveBeenCalledWith({
        where: { assignmentId },
        include: expect.objectContaining({
          assignment: expect.any(Object),
          testFiles: true,
        }),
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0].testFileCount).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a test suite with test files', async () => {
      const testSuiteWithFiles = {
        ...mockTestSuite,
        assignment: {
          ...mockTestSuite.assignment,
          course: { id: courseId, name: 'Test Course' },
        },
        testFiles: [mockTestFile],
      };
      mockPrismaService.testSuite.findUnique.mockResolvedValue(testSuiteWithFiles);

      const result = await service.findOne(testSuiteId);

      expect(mockPrismaService.testSuite.findUnique).toHaveBeenCalledWith({
        where: { id: testSuiteId },
        include: expect.objectContaining({
          assignment: expect.any(Object),
          testFiles: expect.any(Object),
        }),
      });
      expect(result.id).toBe(testSuiteId);
      expect(result.testFiles).toHaveLength(1);
    });

    it('should throw NotFoundException when test suite does not exist', async () => {
      mockPrismaService.testSuite.findUnique.mockResolvedValue(null);

      await expect(service.findOne(testSuiteId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateTestSuiteDto = {
      name: 'Updated Test Suite Name',
      description: 'Updated description',
    };

    it('should update a test suite successfully', async () => {
      const existingTestSuite = {
        ...mockTestSuite,
        assignment: mockAssignment,
      };
      const updatedTestSuite = {
        ...existingTestSuite,
        ...updateDto,
        testFiles: [],
      };

      mockPrismaService.testSuite.findUnique.mockResolvedValue(existingTestSuite);
      mockPrismaService.testSuite.update.mockResolvedValue(updatedTestSuite);

      const result = await service.update(testSuiteId, professorId, updateDto);

      expect(mockPrismaService.testSuite.update).toHaveBeenCalledWith({
        where: { id: testSuiteId },
        data: expect.objectContaining({
          name: 'Updated Test Suite Name',
          description: 'Updated description',
        }),
        include: expect.any(Object),
      });
      expect(result.name).toBe('Updated Test Suite Name');
    });

    it('should throw NotFoundException when test suite does not exist', async () => {
      mockPrismaService.testSuite.findUnique.mockResolvedValue(null);

      await expect(service.update(testSuiteId, professorId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when professor does not own the test suite', async () => {
      const testSuiteWithDifferentProfessor = {
        ...mockTestSuite,
        assignment: {
          ...mockAssignment,
          course: { ...mockCourse, professorId: 'different-professor-id' },
        },
      };
      mockPrismaService.testSuite.findUnique.mockResolvedValue(testSuiteWithDifferentProfessor);

      await expect(service.update(testSuiteId, professorId, updateDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a test suite successfully', async () => {
      const existingTestSuite = {
        ...mockTestSuite,
        assignment: mockAssignment,
      };
      mockPrismaService.testSuite.findUnique.mockResolvedValue(existingTestSuite);
      mockPrismaService.testSuite.delete.mockResolvedValue(mockTestSuite);

      const result = await service.remove(testSuiteId, professorId);

      expect(mockPrismaService.testSuite.delete).toHaveBeenCalledWith({
        where: { id: testSuiteId },
      });
      expect(result).toHaveProperty('message', 'Test suite deleted successfully');
    });

    it('should throw NotFoundException when test suite does not exist', async () => {
      mockPrismaService.testSuite.findUnique.mockResolvedValue(null);

      await expect(service.remove(testSuiteId, professorId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when professor does not own the test suite', async () => {
      const testSuiteWithDifferentProfessor = {
        ...mockTestSuite,
        assignment: {
          ...mockAssignment,
          course: { ...mockCourse, professorId: 'different-professor-id' },
        },
      };
      mockPrismaService.testSuite.findUnique.mockResolvedValue(testSuiteWithDifferentProfessor);

      await expect(service.remove(testSuiteId, professorId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addTestFile', () => {
    const createTestFileDto: CreateTestFileDto = {
      fileName: 'new-test.js',
      filePath: 'tests/new-test.js',
      content: 'describe("New Test", () => {});',
      testSuiteId,
      isGenerated: false,
    };

    it('should add a test file to test suite successfully', async () => {
      const testSuiteWithAssignment = {
        ...mockTestSuite,
        assignment: mockAssignment,
      };
      mockPrismaService.testSuite.findUnique.mockResolvedValue(testSuiteWithAssignment);
      mockPrismaService.testFile.create.mockResolvedValue(mockTestFile);

      const result = await service.addTestFile(professorId, createTestFileDto);

      expect(mockPrismaService.testFile.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          fileName: createTestFileDto.fileName,
          filePath: createTestFileDto.filePath,
          content: createTestFileDto.content,
          testSuiteId,
        }),
      });
      expect(result.fileName).toBe(mockTestFile.fileName);
    });

    it('should add test file linked to a criterion', async () => {
      const dtoWithCriterion: CreateTestFileDto = {
        ...createTestFileDto,
        criterionId,
      };
      const testSuiteWithAssignment = {
        ...mockTestSuite,
        assignment: mockAssignment,
      };
      const mockCriterion = { id: criterionId, title: 'Test Criterion' };

      mockPrismaService.testSuite.findUnique.mockResolvedValue(testSuiteWithAssignment);
      mockPrismaService.criterion.findUnique.mockResolvedValue(mockCriterion);
      mockPrismaService.testFile.create.mockResolvedValue({
        ...mockTestFile,
        criterionId,
      });

      const result = await service.addTestFile(professorId, dtoWithCriterion);

      expect(mockPrismaService.criterion.findUnique).toHaveBeenCalledWith({
        where: { id: criterionId },
      });
      expect(result.criterionId).toBe(criterionId);
    });

    it('should throw NotFoundException when test suite does not exist', async () => {
      mockPrismaService.testSuite.findUnique.mockResolvedValue(null);

      await expect(service.addTestFile(professorId, createTestFileDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when criterion does not exist', async () => {
      const dtoWithCriterion: CreateTestFileDto = {
        ...createTestFileDto,
        criterionId,
      };
      const testSuiteWithAssignment = {
        ...mockTestSuite,
        assignment: mockAssignment,
      };

      mockPrismaService.testSuite.findUnique.mockResolvedValue(testSuiteWithAssignment);
      mockPrismaService.criterion.findUnique.mockResolvedValue(null);

      await expect(service.addTestFile(professorId, dtoWithCriterion)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when professor does not own the test suite', async () => {
      const testSuiteWithDifferentProfessor = {
        ...mockTestSuite,
        assignment: {
          ...mockAssignment,
          course: { ...mockCourse, professorId: 'different-professor-id' },
        },
      };
      mockPrismaService.testSuite.findUnique.mockResolvedValue(testSuiteWithDifferentProfessor);

      await expect(service.addTestFile(professorId, createTestFileDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateTestFile', () => {
    const updateTestFileDto: UpdateTestFileDto = {
      fileName: 'updated-test.js',
      content: 'describe("Updated Test", () => {});',
    };

    it('should update a test file successfully', async () => {
      const existingTestFile = {
        ...mockTestFile,
        testSuite: {
          ...mockTestSuite,
          assignment: mockAssignment,
        },
      };
      const updatedTestFile = {
        ...mockTestFile,
        ...updateTestFileDto,
      };

      mockPrismaService.testFile.findUnique.mockResolvedValue(existingTestFile);
      mockPrismaService.testFile.update.mockResolvedValue(updatedTestFile);

      const result = await service.updateTestFile(testFileId, professorId, updateTestFileDto);

      expect(mockPrismaService.testFile.update).toHaveBeenCalledWith({
        where: { id: testFileId },
        data: expect.objectContaining({
          fileName: 'updated-test.js',
          content: 'describe("Updated Test", () => {});',
        }),
      });
      expect(result.fileName).toBe('updated-test.js');
    });

    it('should throw NotFoundException when test file does not exist', async () => {
      mockPrismaService.testFile.findUnique.mockResolvedValue(null);

      await expect(
        service.updateTestFile(testFileId, professorId, updateTestFileDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when professor does not own the test file', async () => {
      const testFileWithDifferentProfessor = {
        ...mockTestFile,
        testSuite: {
          ...mockTestSuite,
          assignment: {
            ...mockAssignment,
            course: { ...mockCourse, professorId: 'different-professor-id' },
          },
        },
      };
      mockPrismaService.testFile.findUnique.mockResolvedValue(testFileWithDifferentProfessor);

      await expect(
        service.updateTestFile(testFileId, professorId, updateTestFileDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('removeTestFile', () => {
    it('should delete a test file successfully', async () => {
      const existingTestFile = {
        ...mockTestFile,
        testSuite: {
          ...mockTestSuite,
          assignment: mockAssignment,
        },
      };
      mockPrismaService.testFile.findUnique.mockResolvedValue(existingTestFile);
      mockPrismaService.testFile.delete.mockResolvedValue(mockTestFile);

      const result = await service.removeTestFile(testFileId, professorId);

      expect(mockPrismaService.testFile.delete).toHaveBeenCalledWith({
        where: { id: testFileId },
      });
      expect(result).toHaveProperty('message', 'Test file deleted successfully');
    });

    it('should throw NotFoundException when test file does not exist', async () => {
      mockPrismaService.testFile.findUnique.mockResolvedValue(null);

      await expect(service.removeTestFile(testFileId, professorId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when professor does not own the test file', async () => {
      const testFileWithDifferentProfessor = {
        ...mockTestFile,
        testSuite: {
          ...mockTestSuite,
          assignment: {
            ...mockAssignment,
            course: { ...mockCourse, professorId: 'different-professor-id' },
          },
        },
      };
      mockPrismaService.testFile.findUnique.mockResolvedValue(testFileWithDifferentProfessor);

      await expect(service.removeTestFile(testFileId, professorId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
