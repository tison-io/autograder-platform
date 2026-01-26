import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestSuitesService } from './test-suites.service';
import {
  CreateTestSuiteDto,
  UpdateTestSuiteDto,
  CreateTestFileDto,
  UpdateTestFileDto,
  TestSuiteResponseDto,
  TestFileResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@autograder/database';
import { UserResponseDto } from '../users/dto';

@ApiTags('Test Suites')
@ApiBearerAuth('JWT-auth')
@Controller('test-suites')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestSuitesController {
  constructor(private readonly testSuitesService: TestSuitesService) {}

  @Post()
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Create a new test suite (Professor only)' })
  @ApiResponse({ status: 201, description: 'Test suite created', type: TestSuiteResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Professor only' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async create(
    @CurrentUser() user: UserResponseDto,
    @Body() createTestSuiteDto: CreateTestSuiteDto,
  ): Promise<TestSuiteResponseDto> {
    return this.testSuitesService.create(user.id, createTestSuiteDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all test suites' })
  @ApiResponse({ status: 200, description: 'List of test suites', type: [TestSuiteResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<TestSuiteResponseDto[]> {
    return this.testSuitesService.findAll();
  }

  @Get('assignment/:assignmentId')
  @ApiOperation({ summary: 'Get test suites for a specific assignment' })
  @ApiParam({ name: 'assignmentId', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment test suites', type: [TestSuiteResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByAssignment(
    @Param('assignmentId') assignmentId: string,
  ): Promise<TestSuiteResponseDto[]> {
    return this.testSuitesService.findByAssignment(assignmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get test suite by ID with test files' })
  @ApiParam({ name: 'id', description: 'Test suite ID' })
  @ApiResponse({ status: 200, description: 'Test suite found', type: TestSuiteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Test suite not found' })
  async findOne(@Param('id') id: string): Promise<TestSuiteResponseDto> {
    return this.testSuitesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Update test suite (Professor only)' })
  @ApiParam({ name: 'id', description: 'Test suite ID' })
  @ApiResponse({ status: 200, description: 'Test suite updated', type: TestSuiteResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Test suite not found' })
  async update(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
    @Body() updateTestSuiteDto: UpdateTestSuiteDto,
  ): Promise<TestSuiteResponseDto> {
    return this.testSuitesService.update(id, user.id, updateTestSuiteDto);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Delete test suite (Professor only)' })
  @ApiParam({ name: 'id', description: 'Test suite ID' })
  @ApiResponse({ status: 200, description: 'Test suite deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Test suite not found' })
  async remove(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.testSuitesService.remove(id, user.id);
  }

  // Test File Operations

  @Post(':id/files')
  @Roles(UserRole.PROFESSOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a test file to a test suite (Professor only)' })
  @ApiParam({ name: 'id', description: 'Test suite ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'JavaScript/TypeScript test file (.js, .ts, .jsx, .tsx)',
        },
        criterionId: {
          type: 'string',
          description: 'Optional criterion ID to link this test file to',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Test file uploaded', type: TestFileResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file type' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Test suite not found' })
  async addTestFile(
    @CurrentUser() user: UserResponseDto,
    @Param('id') testSuiteId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body?: { criterionId?: string },
  ): Promise<TestFileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.match(/\.(js|ts|jsx|tsx)$/i)) {
      throw new BadRequestException('File must be a JavaScript or TypeScript test file');
    }

    const content = file.buffer.toString('utf-8');

    const dto: CreateTestFileDto = {
      fileName: file.originalname,
      filePath: `tests/${file.originalname}`,
      content,
      testSuiteId,
      criterionId: body?.criterionId,
      isGenerated: false,
    };

    return this.testSuitesService.addTestFile(user.id, dto);
  }

  @Patch(':id/files/:fileId')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Update a test file (Professor only)' })
  @ApiParam({ name: 'id', description: 'Test suite ID' })
  @ApiParam({ name: 'fileId', description: 'Test file ID' })
  @ApiResponse({ status: 200, description: 'Test file updated', type: TestFileResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Test file not found' })
  async updateTestFile(
    @CurrentUser() user: UserResponseDto,
    @Param('fileId') fileId: string,
    @Body() updateTestFileDto: UpdateTestFileDto,
  ): Promise<TestFileResponseDto> {
    return this.testSuitesService.updateTestFile(fileId, user.id, updateTestFileDto);
  }

  @Delete(':id/files/:fileId')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Delete a test file (Professor only)' })
  @ApiParam({ name: 'id', description: 'Test suite ID' })
  @ApiParam({ name: 'fileId', description: 'Test file ID' })
  @ApiResponse({ status: 200, description: 'Test file deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Test file not found' })
  async removeTestFile(
    @CurrentUser() user: UserResponseDto,
    @Param('fileId') fileId: string,
  ): Promise<{ message: string }> {
    return this.testSuitesService.removeTestFile(fileId, user.id);
  }
}
