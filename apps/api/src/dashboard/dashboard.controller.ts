import { Controller, Get, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import {
  ProfessorStatsDto,
  StudentStatsDto,
  RecentSubmissionsResponseDto,
  UpcomingDeadlinesResponseDto,
} from './dto';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // =====================================================
  // PROFESSOR ENDPOINTS
  // =====================================================

  @Get('professor/stats')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get professor dashboard statistics',
    description:
      'Returns comprehensive statistics including courses, students, assignments, and submissions for the authenticated professor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Professor statistics retrieved successfully',
    type: ProfessorStatsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a professor' })
  async getProfessorStats(@CurrentUser() user: AuthenticatedUser): Promise<ProfessorStatsDto> {
    return this.dashboardService.getProfessorStats(user.id);
  }

  @Get('professor/recent-submissions')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get recent submissions for professor',
    description: "Returns the most recent submissions across all of the professor's courses.",
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of submissions to return (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent submissions retrieved successfully',
    type: RecentSubmissionsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a professor' })
  async getRecentSubmissions(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<RecentSubmissionsResponseDto> {
    return this.dashboardService.getRecentSubmissions(user.id, limit);
  }

  // =====================================================
  // STUDENT ENDPOINTS
  // =====================================================

  @Get('student/stats')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get student dashboard statistics',
    description:
      'Returns comprehensive statistics including enrolled courses, assignments, grades, and progress for the authenticated student.',
  })
  @ApiResponse({
    status: 200,
    description: 'Student statistics retrieved successfully',
    type: StudentStatsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a student' })
  async getStudentStats(@CurrentUser() user: AuthenticatedUser): Promise<StudentStatsDto> {
    return this.dashboardService.getStudentStats(user.id);
  }

  @Get('student/upcoming')
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get upcoming assignment deadlines',
    description:
      "Returns upcoming assignment deadlines for the authenticated student's enrolled courses.",
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of deadlines to return (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming deadlines retrieved successfully',
    type: UpcomingDeadlinesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a student' })
  async getUpcomingDeadlines(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<UpcomingDeadlinesResponseDto> {
    return this.dashboardService.getUpcomingDeadlines(user.id, limit);
  }
}
