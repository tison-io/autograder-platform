import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { EnrollmentRequestsService } from './enrollment-requests.service';
import { CreateEnrollmentRequestDto, EnrollmentRequestResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';
import { UserRole } from '@autograder/database';
import { UserResponseDto } from '../users/dto';

@ApiTags('Enrollment Requests')
@ApiBearerAuth('JWT-auth')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentRequestsController {
  constructor(private readonly enrollmentRequestsService: EnrollmentRequestsService) {}

  @Post('courses/:courseId/enrollment-requests')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Request enrollment in a course (Student only)' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 201,
    description: 'Enrollment request created',
    type: EnrollmentRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Student only' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 409, description: 'Already enrolled or request already exists' })
  create(
    @Param('courseId') courseId: string,
    @Body() createDto: CreateEnrollmentRequestDto,
    @CurrentUser() user: UserResponseDto,
  ): Promise<EnrollmentRequestResponseDto> {
    return this.enrollmentRequestsService.create(courseId, user.id, createDto);
  }

  @Get('courses/:courseId/enrollment-requests')
  @Roles(UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get pending enrollment requests for a course (Professor only)' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'List of pending requests',
    type: [EnrollmentRequestResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findByCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() user: UserResponseDto,
  ): Promise<EnrollmentRequestResponseDto[]> {
    return this.enrollmentRequestsService.findByCourse(courseId, user.id);
  }

  @Patch('enrollment-requests/:id/approve')
  @Roles(UserRole.PROFESSOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve an enrollment request (Professor only)' })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiResponse({ status: 200, description: 'Request approved and student enrolled' })
  @ApiResponse({ status: 400, description: 'Request already processed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  approve(
    @Param('id') id: string,
    @CurrentUser() user: UserResponseDto,
  ): Promise<{ message: string }> {
    return this.enrollmentRequestsService.approve(id, user.id);
  }

  @Patch('enrollment-requests/:id/reject')
  @Roles(UserRole.PROFESSOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject an enrollment request (Professor only)' })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiResponse({ status: 200, description: 'Request rejected' })
  @ApiResponse({ status: 400, description: 'Request already processed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not course owner' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  reject(
    @Param('id') id: string,
    @CurrentUser() user: UserResponseDto,
  ): Promise<{ message: string }> {
    return this.enrollmentRequestsService.reject(id, user.id);
  }
}
