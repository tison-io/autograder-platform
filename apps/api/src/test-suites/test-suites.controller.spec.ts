import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TestSuitesController } from './test-suites.controller';
import { TestSuitesService } from './test-suites.service';
import {
  CreateTestSuiteDto,
  UpdateTestSuiteDto,
  UpdateTestFileDto,
  TestSuiteResponseDto,
  TestFileResponseDto,
} from './dto';
import { UserResponseDto } from '../users/dto';
import { UserRole } from '@autograder/database';

describe('TestSuitesController', () => {
  let controller: TestSuitesController;
  let service: TestSuitesService;

  const mockProfessor: UserResponseDto = {
    id: 'test-professor-id',
    email: 'professor@test.com',
    firstName: 'Test',
    lastName: 'Professor',
    role: UserRole.PROFESSOR,
    githubUsername: null,
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTestSuite: TestSuiteResponseDto = {
    id: 'test-suite-id',
    name: 'Backend API Tests',
    description: 'Tests for backend API endpoints',
    isTemplate: false,
    parameters: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    assignment: {
      id: 'test-assignment-id',
      title: 'Test Assignment',
    },
    testFiles: [],
    testFileCount: 0,
  };

  const mockTestFile: TestFileResponseDto = {
    id: 'test-file-id',
    fileName: 'api-endpoints.test.js',
    filePath: 'tests/api-endpoints.test.js',
    content: 'describe("API Tests", () => {});',
    isGenerated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTestSuitesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByAssignment: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addTestFile: jest.fn(),
    updateTestFile: jest.fn(),
    removeTestFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestSuitesController],
      providers: [
        {
          provide: TestSuitesService,
          useValue: mockTestSuitesService,
        },
      ],
    }).compile();

    controller = module.get<TestSuitesController>(TestSuitesController);
    service = module.get<TestSuitesService>(TestSuitesService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateTestSuiteDto = {
      name: 'Backend API Tests',
      description: 'Tests for backend API endpoints',
      assignmentId: 'test-assignment-id',
      isTemplate: false,
    };

    it('should create a test suite', async () => {
      mockTestSuitesService.create.mockResolvedValue(mockTestSuite);

      const result = await controller.create(mockProfessor, createDto);

      expect(service.create).toHaveBeenCalledWith(mockProfessor.id, createDto);
      expect(result).toEqual(mockTestSuite);
    });
  });

  describe('findAll', () => {
    it('should return all test suites', async () => {
      const mockTestSuites = [mockTestSuite];
      mockTestSuitesService.findAll.mockResolvedValue(mockTestSuites);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTestSuites);
    });

    it('should return empty array when no test suites exist', async () => {
      mockTestSuitesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByAssignment', () => {
    it('should return test suites for a specific assignment', async () => {
      const assignmentId = 'test-assignment-id';
      const mockTestSuites = [mockTestSuite];
      mockTestSuitesService.findByAssignment.mockResolvedValue(mockTestSuites);

      const result = await controller.findByAssignment(assignmentId);

      expect(service.findByAssignment).toHaveBeenCalledWith(assignmentId);
      expect(result).toEqual(mockTestSuites);
    });
  });

  describe('findOne', () => {
    it('should return a test suite by ID', async () => {
      const testSuiteId = 'test-suite-id';
      mockTestSuitesService.findOne.mockResolvedValue(mockTestSuite);

      const result = await controller.findOne(testSuiteId);

      expect(service.findOne).toHaveBeenCalledWith(testSuiteId);
      expect(result).toEqual(mockTestSuite);
    });
  });

  describe('update', () => {
    const updateDto: UpdateTestSuiteDto = {
      name: 'Updated Test Suite Name',
      description: 'Updated description',
    };

    it('should update a test suite', async () => {
      const testSuiteId = 'test-suite-id';
      const updatedTestSuite = { ...mockTestSuite, ...updateDto };
      mockTestSuitesService.update.mockResolvedValue(updatedTestSuite);

      const result = await controller.update(mockProfessor, testSuiteId, updateDto);

      expect(service.update).toHaveBeenCalledWith(testSuiteId, mockProfessor.id, updateDto);
      expect(result).toEqual(updatedTestSuite);
    });
  });

  describe('remove', () => {
    it('should delete a test suite', async () => {
      const testSuiteId = 'test-suite-id';
      const deleteResponse = { message: 'Test suite deleted successfully' };
      mockTestSuitesService.remove.mockResolvedValue(deleteResponse);

      const result = await controller.remove(mockProfessor, testSuiteId);

      expect(service.remove).toHaveBeenCalledWith(testSuiteId, mockProfessor.id);
      expect(result).toEqual(deleteResponse);
    });
  });

  describe('addTestFile', () => {
    it('should upload and add a test file to test suite', async () => {
      const testSuiteId = 'test-suite-id';
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'api-endpoints.test.js',
        encoding: '7bit',
        mimetype: 'application/javascript',
        size: 1024,
        buffer: Buffer.from('describe("API Tests", () => {});'),
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      mockTestSuitesService.addTestFile.mockResolvedValue(mockTestFile);

      const result = await controller.addTestFile(mockProfessor, testSuiteId, mockFile);

      expect(service.addTestFile).toHaveBeenCalledWith(mockProfessor.id, {
        fileName: 'api-endpoints.test.js',
        filePath: 'tests/api-endpoints.test.js',
        content: 'describe("API Tests", () => {});',
        testSuiteId,
        criterionId: undefined,
        isGenerated: false,
      });
      expect(result).toEqual(mockTestFile);
    });

    it('should upload test file with criterion link', async () => {
      const testSuiteId = 'test-suite-id';
      const criterionId = 'test-criterion-id';
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.js',
        encoding: '7bit',
        mimetype: 'application/javascript',
        size: 1024,
        buffer: Buffer.from('test code'),
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      mockTestSuitesService.addTestFile.mockResolvedValue({
        ...mockTestFile,
        criterionId,
      });

      const result = await controller.addTestFile(mockProfessor, testSuiteId, mockFile, {
        criterionId,
      });

      expect(service.addTestFile).toHaveBeenCalledWith(
        mockProfessor.id,
        expect.objectContaining({
          criterionId,
        }),
      );
      expect(result.criterionId).toBe(criterionId);
    });

    it('should throw BadRequestException when no file is uploaded', async () => {
      const testSuiteId = 'test-suite-id';

      await expect(controller.addTestFile(mockProfessor, testSuiteId, null as any)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.addTestFile).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid file type', async () => {
      const testSuiteId = 'test-suite-id';
      const invalidFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'document.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('pdf content'),
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      await expect(controller.addTestFile(mockProfessor, testSuiteId, invalidFile)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.addTestFile).not.toHaveBeenCalled();
    });

    it('should accept TypeScript test files', async () => {
      const testSuiteId = 'test-suite-id';
      const tsFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.ts',
        encoding: '7bit',
        mimetype: 'application/typescript',
        size: 1024,
        buffer: Buffer.from('test code'),
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      mockTestSuitesService.addTestFile.mockResolvedValue(mockTestFile);

      const result = await controller.addTestFile(mockProfessor, testSuiteId, tsFile);

      expect(service.addTestFile).toHaveBeenCalled();
      expect(result).toEqual(mockTestFile);
    });

    it('should accept JSX test files', async () => {
      const testSuiteId = 'test-suite-id';
      const jsxFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'component.test.jsx',
        encoding: '7bit',
        mimetype: 'application/javascript',
        size: 1024,
        buffer: Buffer.from('test code'),
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      mockTestSuitesService.addTestFile.mockResolvedValue(mockTestFile);

      const result = await controller.addTestFile(mockProfessor, testSuiteId, jsxFile);

      expect(service.addTestFile).toHaveBeenCalled();
      expect(result).toEqual(mockTestFile);
    });

    it('should accept TSX test files', async () => {
      const testSuiteId = 'test-suite-id';
      const tsxFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'component.test.tsx',
        encoding: '7bit',
        mimetype: 'application/typescript',
        size: 1024,
        buffer: Buffer.from('test code'),
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      mockTestSuitesService.addTestFile.mockResolvedValue(mockTestFile);

      const result = await controller.addTestFile(mockProfessor, testSuiteId, tsxFile);

      expect(service.addTestFile).toHaveBeenCalled();
      expect(result).toEqual(mockTestFile);
    });
  });

  describe('updateTestFile', () => {
    const updateDto: UpdateTestFileDto = {
      fileName: 'updated-test.js',
      content: 'describe("Updated Test", () => {});',
    };

    it('should update a test file', async () => {
      const fileId = 'test-file-id';
      const updatedTestFile = { ...mockTestFile, ...updateDto };
      mockTestSuitesService.updateTestFile.mockResolvedValue(updatedTestFile);

      const result = await controller.updateTestFile(mockProfessor, fileId, updateDto);

      expect(service.updateTestFile).toHaveBeenCalledWith(fileId, mockProfessor.id, updateDto);
      expect(result).toEqual(updatedTestFile);
    });
  });

  describe('removeTestFile', () => {
    it('should delete a test file', async () => {
      const fileId = 'test-file-id';
      const deleteResponse = { message: 'Test file deleted successfully' };
      mockTestSuitesService.removeTestFile.mockResolvedValue(deleteResponse);

      const result = await controller.removeTestFile(mockProfessor, fileId);

      expect(service.removeTestFile).toHaveBeenCalledWith(fileId, mockProfessor.id);
      expect(result).toEqual(deleteResponse);
    });
  });
});
