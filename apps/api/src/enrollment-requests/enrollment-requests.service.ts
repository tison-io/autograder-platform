import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEnrollmentRequestDto, EnrollmentRequestResponseDto } from './dto';
import { EnrollmentRequestStatus } from '@autograder/database';

@Injectable()
export class EnrollmentRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    courseId: string,
    studentId: string,
    createDto: CreateEnrollmentRequestDto,
  ): Promise<EnrollmentRequestResponseDto> {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        courseId,
        studentId,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('You are already enrolled in this course');
    }

    // Check if request already exists
    const existingRequest = await this.prisma.enrollmentRequest.findFirst({
      where: {
        courseId,
        studentId,
        status: EnrollmentRequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new ConflictException('You already have a pending enrollment request for this course');
    }

    const request = await this.prisma.enrollmentRequest.create({
      data: {
        courseId,
        studentId,
        message: createDto.message,
      },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            githubUsername: true,
          },
        },
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return this.toResponseDto(request);
  }

  async findByCourse(
    courseId: string,
    professorId: string,
  ): Promise<EnrollmentRequestResponseDto[]> {
    // Verify professor owns this course
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    if (course.professorId !== professorId) {
      throw new ForbiddenException('You are not authorized to view requests for this course');
    }

    const requests = await this.prisma.enrollmentRequest.findMany({
      where: {
        courseId,
        status: EnrollmentRequestStatus.PENDING,
      },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            githubUsername: true,
          },
        },
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return requests.map((request) => this.toResponseDto(request));
  }

  async approve(requestId: string, professorId: string): Promise<{ message: string }> {
    const request = await this.prisma.enrollmentRequest.findUnique({
      where: { id: requestId },
      include: {
        course: true,
      },
    });

    if (!request) {
      throw new NotFoundException(`Enrollment request with ID ${requestId} not found`);
    }

    // Verify professor owns the course
    if (request.course.professorId !== professorId) {
      throw new ForbiddenException('You are not authorized to approve this request');
    }

    if (request.status !== EnrollmentRequestStatus.PENDING) {
      throw new BadRequestException('This request has already been processed');
    }

    // Check if already enrolled (edge case)
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        courseId: request.courseId,
        studentId: request.studentId,
      },
    });

    if (existingEnrollment) {
      // Update request status but don't create enrollment
      await this.prisma.enrollmentRequest.update({
        where: { id: requestId },
        data: { status: EnrollmentRequestStatus.APPROVED },
      });
      return { message: 'Request marked as approved (student already enrolled)' };
    }

    // Create enrollment and update request status in a transaction
    await this.prisma.$transaction([
      this.prisma.enrollment.create({
        data: {
          courseId: request.courseId,
          studentId: request.studentId,
        },
      }),
      this.prisma.enrollmentRequest.update({
        where: { id: requestId },
        data: { status: EnrollmentRequestStatus.APPROVED },
      }),
    ]);

    return { message: 'Enrollment request approved and student enrolled successfully' };
  }

  async reject(requestId: string, professorId: string): Promise<{ message: string }> {
    const request = await this.prisma.enrollmentRequest.findUnique({
      where: { id: requestId },
      include: {
        course: true,
      },
    });

    if (!request) {
      throw new NotFoundException(`Enrollment request with ID ${requestId} not found`);
    }

    // Verify professor owns the course
    if (request.course.professorId !== professorId) {
      throw new ForbiddenException('You are not authorized to reject this request');
    }

    if (request.status !== EnrollmentRequestStatus.PENDING) {
      throw new BadRequestException('This request has already been processed');
    }

    await this.prisma.enrollmentRequest.update({
      where: { id: requestId },
      data: { status: EnrollmentRequestStatus.REJECTED },
    });

    return { message: 'Enrollment request rejected' };
  }

  private toResponseDto(request: Record<string, unknown>): EnrollmentRequestResponseDto {
    return {
      id: request.id as string,
      status: request.status as EnrollmentRequestStatus,
      message: request.message as string | undefined,
      studentId: request.studentId as string,
      student: request.student as {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        githubUsername?: string;
      },
      courseId: request.courseId as string,
      course: request.course as {
        id: string;
        code: string;
        name: string;
      },
      createdAt: request.createdAt as Date,
      updatedAt: request.updatedAt as Date,
    };
  }
}
