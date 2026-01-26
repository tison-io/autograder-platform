import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, EnrollStudentsDto, CourseResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';
import { UserRole } from '@autograder/database';
import { UserResponseDto } from '../users/dto';

@ApiTags('Courses')
@ApiBearerAuth('JWT-auth')
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Create a new course (Professor only)' })
  @ApiResponse({ status: 201, description: 'Course created', type: CourseResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Professor only' })
  @ApiResponse({ status: 409, description: 'Course code already exists' })
  create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: UserResponseDto,
  ): Promise<CourseResponseDto> {
    return this.coursesService.create(createCourseDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all courses' })
  @ApiResponse({ status: 200, description: 'List of courses', type: [CourseResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(): Promise<CourseResponseDto[]> {
    return this.coursesService.findAll();
  }

  @Get('my-courses')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get courses taught by current professor' })
  @ApiResponse({ status: 200, description: 'Professor courses', type: [CourseResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Professor only' })
  findMyCourses(@CurrentUser() user: UserResponseDto): Promise<CourseResponseDto[]> {
    return this.coursesService.findByProfessor(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course found', type: CourseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id') id: string): Promise<CourseResponseDto> {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Update course (Professor owner only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course updated', type: CourseResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: UserResponseDto,
  ): Promise<CourseResponseDto> {
    return this.coursesService.update(id, updateCourseDto, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Delete course (Professor owner only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: UserResponseDto): Promise<void> {
    return this.coursesService.remove(id, user.id);
  }

  @Post(':id/enrollments')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Enroll students in course (Professor owner only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 201, description: 'Students enrolled successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  enrollStudents(
    @Param('id') id: string,
    @Body() enrollStudentsDto: EnrollStudentsDto,
    @CurrentUser() user: UserResponseDto,
  ) {
    return this.coursesService.enrollStudents(id, enrollStudentsDto, user.id);
  }

  @Get(':id/students')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'List enrolled students (Professor owner only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'List of enrolled students' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  getEnrolledStudents(@Param('id') id: string, @CurrentUser() user: UserResponseDto) {
    return this.coursesService.getEnrolledStudents(id, user.id);
  }

  @Delete(':id/enrollments/:studentId')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Remove student from course (Professor owner only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID to remove' })
  @ApiResponse({ status: 200, description: 'Student removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Course or enrollment not found' })
  removeStudent(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
    @CurrentUser() user: UserResponseDto,
  ) {
    return this.coursesService.removeStudent(id, studentId, user.id);
  }
}
