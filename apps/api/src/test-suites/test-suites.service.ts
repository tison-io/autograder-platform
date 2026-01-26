import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateTestSuiteDto,
  UpdateTestSuiteDto,
  CreateTestFileDto,
  UpdateTestFileDto,
  TestSuiteResponseDto,
  TestFileResponseDto,
} from './dto';

@Injectable()
export class TestSuitesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(professorId: string, dto: CreateTestSuiteDto): Promise<TestSuiteResponseDto> {
    // Verify assignment exists and professor owns it
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: dto.assignmentId },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.course.professorId !== professorId) {
      throw new ForbiddenException('You can only create test suites for your own assignments');
    }

    const testSuite = await this.prisma.testSuite.create({
      data: {
        name: dto.name,
        description: dto.description,
        assignmentId: dto.assignmentId,
        isTemplate: dto.isTemplate || false,
        templateType: dto.templateType,
        parameters: (dto.parameters || {}) as Prisma.InputJsonValue,
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return this.toResponseDto(testSuite);
  }

  async findAll(): Promise<TestSuiteResponseDto[]> {
    const testSuites = await this.prisma.testSuite.findMany({
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
          },
        },
        testFiles: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return testSuites.map((suite) =>
      this.toResponseDto({
        ...suite,
        testFileCount: suite.testFiles.length,
      }),
    );
  }

  async findByAssignment(assignmentId: string): Promise<TestSuiteResponseDto[]> {
    const testSuites = await this.prisma.testSuite.findMany({
      where: { assignmentId },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
          },
        },
        testFiles: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return testSuites.map((suite) =>
      this.toResponseDto({
        ...suite,
        testFileCount: suite.testFiles.length,
      }),
    );
  }

  async findOne(id: string): Promise<TestSuiteResponseDto> {
    const testSuite = await this.prisma.testSuite.findUnique({
      where: { id },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        testFiles: {
          orderBy: {
            fileName: 'asc',
          },
        },
      },
    });

    if (!testSuite) {
      throw new NotFoundException('Test suite not found');
    }

    return this.toResponseDto({
      ...testSuite,
      testFileCount: testSuite.testFiles.length,
    });
  }

  async update(
    id: string,
    professorId: string,
    dto: UpdateTestSuiteDto,
  ): Promise<TestSuiteResponseDto> {
    // Verify test suite exists and professor owns it
    const testSuite = await this.prisma.testSuite.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!testSuite) {
      throw new NotFoundException('Test suite not found');
    }

    if (testSuite.assignment.course.professorId !== professorId) {
      throw new ForbiddenException('You can only update your own test suites');
    }

    const updated = await this.prisma.testSuite.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isTemplate !== undefined && { isTemplate: dto.isTemplate }),
        ...(dto.templateType && { templateType: dto.templateType }),
        ...(dto.parameters && { parameters: dto.parameters as Prisma.InputJsonValue }),
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
          },
        },
        testFiles: true,
      },
    });

    return this.toResponseDto({
      ...updated,
      testFileCount: updated.testFiles.length,
    });
  }

  async remove(id: string, professorId: string): Promise<{ message: string }> {
    // Verify test suite exists and professor owns it
    const testSuite = await this.prisma.testSuite.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!testSuite) {
      throw new NotFoundException('Test suite not found');
    }

    if (testSuite.assignment.course.professorId !== professorId) {
      throw new ForbiddenException('You can only delete your own test suites');
    }

    await this.prisma.testSuite.delete({
      where: { id },
    });

    return { message: 'Test suite deleted successfully' };
  }

  // Test File Operations

  async addTestFile(professorId: string, dto: CreateTestFileDto): Promise<TestFileResponseDto> {
    // Verify test suite exists and professor owns it
    const testSuite = await this.prisma.testSuite.findUnique({
      where: { id: dto.testSuiteId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!testSuite) {
      throw new NotFoundException('Test suite not found');
    }

    if (testSuite.assignment.course.professorId !== professorId) {
      throw new ForbiddenException('You can only add test files to your own test suites');
    }

    // Verify criterion exists if provided
    if (dto.criterionId) {
      const criterion = await this.prisma.criterion.findUnique({
        where: { id: dto.criterionId },
      });

      if (!criterion) {
        throw new NotFoundException('Criterion not found');
      }
    }

    const testFile = await this.prisma.testFile.create({
      data: {
        fileName: dto.fileName,
        filePath: dto.filePath,
        content: dto.content,
        testSuiteId: dto.testSuiteId,
        criterionId: dto.criterionId,
        isGenerated: dto.isGenerated || false,
      },
    });

    return this.toTestFileResponseDto(testFile);
  }

  async updateTestFile(
    fileId: string,
    professorId: string,
    dto: UpdateTestFileDto,
  ): Promise<TestFileResponseDto> {
    // Verify test file exists and professor owns it
    const testFile = await this.prisma.testFile.findUnique({
      where: { id: fileId },
      include: {
        testSuite: {
          include: {
            assignment: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!testFile) {
      throw new NotFoundException('Test file not found');
    }

    if (testFile.testSuite.assignment.course.professorId !== professorId) {
      throw new ForbiddenException('You can only update your own test files');
    }

    const updated = await this.prisma.testFile.update({
      where: { id: fileId },
      data: {
        ...(dto.fileName && { fileName: dto.fileName }),
        ...(dto.filePath && { filePath: dto.filePath }),
        ...(dto.content && { content: dto.content }),
      },
    });

    return this.toTestFileResponseDto(updated);
  }

  async removeTestFile(fileId: string, professorId: string): Promise<{ message: string }> {
    // Verify test file exists and professor owns it
    const testFile = await this.prisma.testFile.findUnique({
      where: { id: fileId },
      include: {
        testSuite: {
          include: {
            assignment: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!testFile) {
      throw new NotFoundException('Test file not found');
    }

    if (testFile.testSuite.assignment.course.professorId !== professorId) {
      throw new ForbiddenException('You can only delete your own test files');
    }

    await this.prisma.testFile.delete({
      where: { id: fileId },
    });

    return { message: 'Test file deleted successfully' };
  }

  private toResponseDto(testSuite: Record<string, unknown>): TestSuiteResponseDto {
    return {
      id: testSuite.id as string,
      name: testSuite.name as string,
      description: testSuite.description as string | null,
      isTemplate: testSuite.isTemplate as boolean,
      templateType: testSuite.templateType as string | null,
      parameters: testSuite.parameters as Record<string, unknown>,
      createdAt: testSuite.createdAt as Date,
      updatedAt: testSuite.updatedAt as Date,
      assignment: testSuite.assignment as { id: string; title: string } | undefined,
      testFiles: (testSuite.testFiles as Array<Record<string, unknown>>)?.map((file) =>
        this.toTestFileResponseDto(file),
      ),
      testFileCount: testSuite.testFileCount as number | undefined,
    };
  }

  private toTestFileResponseDto(testFile: Record<string, unknown>): TestFileResponseDto {
    return {
      id: testFile.id as string,
      fileName: testFile.fileName as string,
      filePath: testFile.filePath as string,
      content: testFile.content as string,
      isGenerated: testFile.isGenerated as boolean,
      createdAt: testFile.createdAt as Date,
      updatedAt: testFile.updatedAt as Date,
      criterionId: testFile.criterionId as string | null,
    };
  }
}
