import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto, SubmissionResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';
import { UserRole } from '@autograder/database';
import { UserResponseDto } from '../users/dto';

@ApiTags('Submissions')
@ApiBearerAuth('JWT-auth')
@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Submit a GitHub repository for grading (Student only)',
    description:
      'Creates a new submission for an assignment. The student must be enrolled in the course, the assignment must be published, and the submission limit must not be exceeded.',
  })
  @ApiBody({ type: CreateSubmissionDto })
  @ApiResponse({
    status: 201,
    description: 'Submission created successfully',
    type: SubmissionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error or submission limit reached' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not enrolled in course or not a student' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  create(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @CurrentUser() user: UserResponseDto,
  ): Promise<SubmissionResponseDto> {
    return this.submissionsService.create(createSubmissionDto, user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get submission by ID',
    description:
      'Retrieves a single submission. Students can only view their own submissions. Professors can view submissions from their courses.',
  })
  @ApiParam({ name: 'id', description: 'Submission ID' })
  @ApiResponse({
    status: 200,
    description: 'Submission found',
    type: SubmissionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not authorized to view this submission' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserResponseDto,
  ): Promise<SubmissionResponseDto> {
    return this.submissionsService.findOne(id, user.id, user.role);
  }

  @Get('my')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Get my submissions (Student only)',
    description:
      'Retrieves all submissions made by the current student. Optionally filter by assignment ID.',
  })
  @ApiQuery({
    name: 'assignmentId',
    required: false,
    description: 'Filter by assignment ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of submissions',
    type: [SubmissionResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Students only' })
  findMySubmissions(
    @CurrentUser() user: UserResponseDto,
    @Query('assignmentId') assignmentId?: string,
  ): Promise<SubmissionResponseDto[]> {
    return this.submissionsService.findByStudent(user.id, assignmentId);
  }

  @Get('assignment/:assignmentId')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({
    summary: 'Get all submissions for an assignment (Professor only)',
    description:
      'Retrieves all submissions for a specific assignment. Only the professor who owns the course can access.',
  })
  @ApiParam({ name: 'assignmentId', description: 'Assignment ID' })
  @ApiResponse({
    status: 200,
    description: 'List of submissions',
    type: [SubmissionResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your course' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  findByAssignment(
    @Param('assignmentId') assignmentId: string,
    @CurrentUser() user: UserResponseDto,
  ): Promise<SubmissionResponseDto[]> {
    return this.submissionsService.findByAssignment(assignmentId, user.id);
  }
}
