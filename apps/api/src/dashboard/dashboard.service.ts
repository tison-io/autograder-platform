import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  ProfessorStatsDto,
  CourseStatsDto,
  StudentStatsDto,
  EnrolledCourseStatsDto,
  RecentSubmissionDto,
  RecentSubmissionsResponseDto,
  UpcomingDeadlineDto,
  UpcomingDeadlinesResponseDto,
} from './dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get comprehensive statistics for a professor
   */
  async getProfessorStats(professorId: string): Promise<ProfessorStatsDto> {
    // Get all courses for this professor with counts
    const courses = await this.prisma.course.findMany({
      where: { professorId },
      include: {
        _count: {
          select: {
            enrollments: true,
            assignments: true,
          },
        },
        assignments: {
          include: {
            _count: {
              select: {
                submissions: true,
              },
            },
            submissions: {
              select: {
                status: true,
                percentage: true,
              },
            },
          },
        },
      },
    });

    const totalCourses = courses.length;
    const activeCourses = courses.filter((c) => c.isActive).length;

    let totalStudents = 0;
    let totalAssignments = 0;
    let publishedAssignments = 0;
    let totalSubmissions = 0;
    let pendingSubmissions = 0;
    const allGrades: number[] = [];

    const courseStats: CourseStatsDto[] = courses.map((course) => {
      const studentCount = course._count.enrollments;
      const assignmentCount = course._count.assignments;

      let courseSubmissions = 0;
      let coursePending = 0;

      course.assignments.forEach((assignment) => {
        if (assignment.isPublished) {
          publishedAssignments++;
        }
        totalAssignments++;

        courseSubmissions += assignment._count.submissions;
        assignment.submissions.forEach((sub) => {
          if (
            sub.status === 'PENDING' ||
            sub.status === 'CLONING' ||
            sub.status === 'TESTING' ||
            sub.status === 'ANALYZING' ||
            sub.status === 'GRADING'
          ) {
            coursePending++;
          }
          if (sub.percentage !== null) {
            allGrades.push(sub.percentage);
          }
        });
      });

      totalStudents += studentCount;
      totalSubmissions += courseSubmissions;
      pendingSubmissions += coursePending;

      return {
        id: course.id,
        name: course.name,
        code: course.code,
        studentCount,
        assignmentCount,
        submissionCount: courseSubmissions,
        pendingSubmissions: coursePending,
      };
    });

    const averageGrade =
      allGrades.length > 0
        ? Math.round((allGrades.reduce((a, b) => a + b, 0) / allGrades.length) * 10) / 10
        : null;

    return {
      totalCourses,
      activeCourses,
      totalStudents,
      totalAssignments,
      publishedAssignments,
      totalSubmissions,
      pendingSubmissions,
      averageGrade,
      courseStats,
    };
  }

  /**
   * Get recent submissions for a professor's courses
   */
  async getRecentSubmissions(
    professorId: string,
    limit: number = 10,
  ): Promise<RecentSubmissionsResponseDto> {
    // Get professor's course IDs
    const courses = await this.prisma.course.findMany({
      where: { professorId },
      select: { id: true },
    });
    const courseIds = courses.map((c) => c.id);

    // Get recent submissions
    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where: {
          assignment: {
            courseId: { in: courseIds },
          },
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignment: {
            select: {
              title: true,
              course: {
                select: {
                  code: true,
                },
              },
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
        take: limit,
      }),
      this.prisma.submission.count({
        where: {
          assignment: {
            courseId: { in: courseIds },
          },
        },
      }),
    ]);

    const recentSubmissions: RecentSubmissionDto[] = submissions.map((sub) => ({
      id: sub.id,
      studentName: `${sub.student.firstName} ${sub.student.lastName}`,
      studentEmail: sub.student.email,
      assignmentTitle: sub.assignment.title,
      courseCode: sub.assignment.course.code,
      status: sub.status,
      score: sub.totalScore,
      maxScore: sub.maxScore,
      submittedAt: sub.submittedAt,
      attemptNumber: sub.attemptNumber,
    }));

    return {
      submissions: recentSubmissions,
      total,
    };
  }

  /**
   * Get comprehensive statistics for a student
   */
  async getStudentStats(studentId: string): Promise<StudentStatsDto> {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Get enrolled courses with assignments
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            professor: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            assignments: {
              where: { isPublished: true },
              include: {
                submissions: {
                  where: { studentId },
                  select: {
                    status: true,
                    percentage: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const totalCourses = enrollments.length;
    const activeCourses = enrollments.filter((e) => e.course.isActive).length;

    let totalAssignments = 0;
    let completedAssignments = 0;
    let dueSoon = 0;
    let overdueAssignments = 0;
    let totalSubmissions = 0;
    const allGrades: number[] = [];

    const courseStats: EnrolledCourseStatsDto[] = enrollments.map((enrollment) => {
      const course = enrollment.course;
      const courseAssignments = course.assignments.length;
      let courseCompleted = 0;
      const courseGrades: number[] = [];

      course.assignments.forEach((assignment) => {
        totalAssignments++;

        const hasCompletedSubmission = assignment.submissions.some((s) => s.status === 'COMPLETED');

        if (hasCompletedSubmission) {
          completedAssignments++;
          courseCompleted++;
        }

        // Check if due soon or overdue
        if (assignment.dueDate > now && assignment.dueDate <= sevenDaysFromNow) {
          if (!hasCompletedSubmission) {
            dueSoon++;
          }
        } else if (assignment.dueDate < now && !hasCompletedSubmission) {
          if (assignment.allowLateSubmissions) {
            dueSoon++; // Can still submit
          } else {
            overdueAssignments++;
          }
        }

        // Collect grades
        assignment.submissions.forEach((sub) => {
          totalSubmissions++;
          if (sub.percentage !== null) {
            allGrades.push(sub.percentage);
            courseGrades.push(sub.percentage);
          }
        });
      });

      const courseAverage =
        courseGrades.length > 0
          ? Math.round((courseGrades.reduce((a, b) => a + b, 0) / courseGrades.length) * 10) / 10
          : null;

      return {
        id: course.id,
        name: course.name,
        code: course.code,
        professorName: `${course.professor.firstName} ${course.professor.lastName}`,
        totalAssignments: courseAssignments,
        completedAssignments: courseCompleted,
        averageGrade: courseAverage,
      };
    });

    const averageGrade =
      allGrades.length > 0
        ? Math.round((allGrades.reduce((a, b) => a + b, 0) / allGrades.length) * 10) / 10
        : null;

    return {
      totalCourses,
      activeCourses,
      totalAssignments,
      completedAssignments,
      dueSoon,
      overdueAssignments,
      totalSubmissions,
      averageGrade,
      courseStats,
    };
  }

  /**
   * Get upcoming assignment deadlines for a student
   */
  async getUpcomingDeadlines(
    studentId: string,
    limit: number = 10,
  ): Promise<UpcomingDeadlinesResponseDto> {
    const now = new Date();

    // Get enrolled course IDs
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      select: { courseId: true },
    });
    const courseIds = enrollments.map((e) => e.courseId);

    // Get upcoming assignments
    const assignments = await this.prisma.assignment.findMany({
      where: {
        courseId: { in: courseIds },
        isPublished: true,
        OR: [{ dueDate: { gte: now } }, { allowLateSubmissions: true }],
      },
      include: {
        course: {
          select: {
            code: true,
            name: true,
          },
        },
        submissions: {
          where: { studentId },
          select: {
            status: true,
            percentage: true,
          },
          orderBy: { percentage: 'desc' },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: limit,
    });

    const deadlines: UpcomingDeadlineDto[] = assignments.map((assignment) => {
      const daysRemaining = Math.ceil(
        (assignment.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      const bestSubmission = assignment.submissions.find((s) => s.percentage !== null);

      return {
        assignmentId: assignment.id,
        title: assignment.title,
        courseCode: assignment.course.code,
        courseName: assignment.course.name,
        dueDate: assignment.dueDate,
        daysRemaining,
        hasSubmitted: assignment.submissions.length > 0,
        submissionCount: assignment.submissions.length,
        maxSubmissions: assignment.maxSubmissions,
        bestScore: bestSubmission?.percentage ?? null,
      };
    });

    return {
      deadlines,
      total: deadlines.length,
    };
  }
}
