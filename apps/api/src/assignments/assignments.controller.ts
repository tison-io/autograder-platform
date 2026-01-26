import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, UpdateAssignmentDto, AssignmentResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@autograder/database';
import { UserResponseDto } from '../users/dto';

@ApiTags('Assignments')
@ApiBearerAuth('JWT-auth')
@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Create a new assignment (Professor only)' })
  @ApiResponse({ status: 201, description: 'Assignment created', type: AssignmentResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Professor only' })
  @ApiResponse({ status: 404, description: 'Course or rubric not found' })
  async create(
    @CurrentUser() user: UserResponseDto,
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentsService.create(user.id, createAssignmentDto);
  }

  @Get()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'List all assignments (Professor/Admin only)' })
  @ApiResponse({ status: 200, description: 'List of assignments', type: [AssignmentResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(): Promise<AssignmentResponseDto[]> {
    return this.assignmentsService.findAll();
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get assignments for a specific course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course assignments', type: [AssignmentResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async findByCourse(@Param('courseId') courseId: string): Promise<AssignmentResponseDto[]> {
    return this.assignmentsService.findByCourse(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by ID' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment found', type: AssignmentResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async findOne(@Param('id') id: string): Promise<AssignmentResponseDto> {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Update assignment (Professor owner only)' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment updated', type: AssignmentResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async update(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentsService.update(id, user.id, updateAssignmentDto);
  }

  @Post(':id/publish')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Publish assignment to students (Professor owner only)' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment published', type: AssignmentResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async publish(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentsService.publish(id, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Delete assignment (Professor owner only)' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async remove(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.assignmentsService.remove(id, user.id);
  }
}
