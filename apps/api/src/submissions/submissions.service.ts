import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateSubmissionDto, SubmissionResponseDto } from './dto';
import { SubmissionStatus } from '@autograder/database';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new submission
   * - Validates student enrollment
   * - Checks assignment is published and not past due
   * - Enforces max submission limit
   */
  async create(
    createSubmissionDto: CreateSubmissionDto,
    studentId: string,
  ): Promise<SubmissionResponseDto> {
    const { githubRepoUrl, assignmentId } = createSubmissionDto;

    // 1. Get assignment with course info
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${assignmentId} not found`);
    }

    // 2. Check if assignment is published
    if (!assignment.isPublished) {
      throw new BadRequestException('This assignment is not yet published');
    }

    // 3. Check if assignment is past due date (unless late submissions allowed)
    const now = new Date();
    if (now > assignment.dueDate && !assignment.allowLateSubmissions) {
      throw new BadRequestException(
        'This assignment is past the due date and does not accept late submissions',
      );
    }

    // 4. Verify student is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: assignment.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this course');
    }

    // 5. Count existing submissions for this student/assignment
    const existingSubmissions = await this.prisma.submission.count({
      where: {
        studentId,
        assignmentId,
      },
    });

    if (existingSubmissions >= assignment.maxSubmissions) {
      throw new BadRequestException(
        `Maximum submission limit reached (${assignment.maxSubmissions} attempts)`,
      );
    }

    // 6. Create the submission
    const attemptNumber = existingSubmissions + 1;

    const submission = await this.prisma.submission.create({
      data: {
        githubRepoUrl,
        status: SubmissionStatus.PENDING,
        attemptNumber,
        studentId,
        assignmentId,
      },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            maxSubmissions: true,
          },
        },
      },
    });

    return this.toResponseDto(submission);
  }

  /**
   * Convert Prisma submission to response DTO
   */
  private toResponseDto(submission: any): SubmissionResponseDto {
    return {
      id: submission.id,
      githubRepoUrl: submission.githubRepoUrl,
      commitHash: submission.commitHash,
      status: submission.status,
      attemptNumber: submission.attemptNumber,
      submittedAt: submission.submittedAt,
      gradingStartedAt: submission.gradingStartedAt,
      gradingCompletedAt: submission.gradingCompletedAt,
      totalScore: submission.totalScore,
      maxScore: submission.maxScore,
      percentage: submission.percentage,
      letterGrade: submission.letterGrade,
      buildSuccess: submission.buildSuccess,
      errorMessage: submission.errorMessage,
      student: submission.student,
      assignment: submission.assignment,
    };
  }

  /**
   * Get a single submission by ID
   * - Students can only view their own submissions
   * - Professors can view any submission in their courses
   */
  async findOne(id: string, userId: string, userRole: string): Promise<SubmissionResponseDto> {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            maxSubmissions: true,
            course: {
              select: {
                id: true,
                professorId: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    // Authorization check
    const isStudent = userRole === 'STUDENT';
    const isProfessor = userRole === 'PROFESSOR';
    const isAdmin = userRole === 'ADMIN';

    if (isStudent && submission.studentId !== userId) {
      throw new ForbiddenException('You can only view your own submissions');
    }

    if (isProfessor && submission.assignment.course.professorId !== userId) {
      throw new ForbiddenException('You can only view submissions from your courses');
    }

    // Remove nested course from response
    const { course, ...assignmentData } = submission.assignment as any;

    return this.toResponseDto({
      ...submission,
      assignment: assignmentData,
    });
  }

  /**
   * Get all submissions for a student
   * Optionally filter by assignment
   */
  async findByStudent(studentId: string, assignmentId?: string): Promise<SubmissionResponseDto[]> {
    const whereClause: any = { studentId };

    if (assignmentId) {
      whereClause.assignmentId = assignmentId;
    }

    const submissions = await this.prisma.submission.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            maxSubmissions: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return submissions.map((submission) => this.toResponseDto(submission));
  }

  /**
   * Get all submissions for an assignment
   * Only the professor who owns the course can access
   */
  async findByAssignment(
    assignmentId: string,
    professorId: string,
  ): Promise<SubmissionResponseDto[]> {
    // 1. Get assignment and verify ownership
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          select: {
            id: true,
            professorId: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${assignmentId} not found`);
    }

    // 2. Verify professor owns this course
    if (assignment.course.professorId !== professorId) {
      throw new ForbiddenException('You can only view submissions from your own courses');
    }

    // 3. Get all submissions for this assignment
    const submissions = await this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            maxSubmissions: true,
          },
        },
      },
      orderBy: [{ student: { lastName: 'asc' } }, { attemptNumber: 'desc' }],
    });

    return submissions.map((submission) => this.toResponseDto(submission));
  }
}
