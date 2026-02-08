import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto, EnrollStudentsDto, CourseResponseDto } from './dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, professorId: string): Promise<CourseResponseDto> {
    // Check if course code already exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { code: createCourseDto.code },
    });

    if (existingCourse) {
      throw new ConflictException('Course with this code already exists');
    }

    const course = await this.prisma.course.create({
      data: {
        ...createCourseDto,
        professorId,
      },
      include: {
        professor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.toResponseDto(course);
  }

  async findAll(): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      include: {
        professor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map((course) => ({
      ...this.toResponseDto(course),
      enrollmentCount: course._count.enrollments,
    }));
  }

  async findOne(id: string): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        professor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return {
      ...this.toResponseDto(course),
      enrollmentCount: course._count.enrollments,
    };
  }

  async findByProfessor(professorId: string): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { professorId },
      include: {
        professor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map((course) => ({
      ...this.toResponseDto(course),
      enrollmentCount: course._count.enrollments,
    }));
  }

  async findEnrolledByStudent(studentId: string): Promise<CourseResponseDto[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            professor: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                enrollments: true,
                assignments: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return enrollments.map((enrollment) => ({
      ...this.toResponseDto(enrollment.course),
      enrollmentCount: enrollment.course._count.enrollments,
      assignmentCount: enrollment.course._count.assignments,
      enrolledAt: enrollment.enrolledAt,
    }));
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    userId: string,
  ): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Verify user is the professor of this course
    if (course.professorId !== userId) {
      throw new ForbiddenException('You are not authorized to update this course');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        professor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.toResponseDto(updatedCourse);
  }

  async remove(id: string, userId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Verify user is the professor of this course
    if (course.professorId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this course');
    }

    await this.prisma.course.delete({
      where: { id },
    });
  }

  async enrollStudents(
    courseId: string,
    enrollStudentsDto: EnrollStudentsDto,
    professorId: string,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Verify user is the professor of this course
    if (course.professorId !== professorId) {
      throw new ForbiddenException('You are not authorized to enroll students in this course');
    }

    // Verify all student IDs exist and are actually students
    const students = await this.prisma.user.findMany({
      where: {
        id: { in: enrollStudentsDto.studentIds },
        role: 'STUDENT',
      },
    });

    if (students.length !== enrollStudentsDto.studentIds.length) {
      throw new NotFoundException('One or more student IDs are invalid');
    }

    // Create enrollments (skip existing ones)
    const enrollments = await Promise.all(
      enrollStudentsDto.studentIds.map(async (studentId) => {
        try {
          return await this.prisma.enrollment.create({
            data: {
              studentId,
              courseId,
            },
          });
        } catch {
          // Skip if already enrolled
          return null;
        }
      }),
    );

    const successfulEnrollments = enrollments.filter((e) => e !== null);

    return {
      message: `Successfully enrolled ${successfulEnrollments.length} students`,
      enrolledCount: successfulEnrollments.length,
    };
  }

  async getEnrolledStudents(courseId: string, professorId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Verify user is the professor of this course
    if (course.professorId !== professorId) {
      throw new ForbiddenException('You are not authorized to view students in this course');
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            githubUsername: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    return enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      student: enrollment.student,
    }));
  }

  async removeStudent(courseId: string, studentId: string, professorId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Verify user is the professor of this course
    if (course.professorId !== professorId) {
      throw new ForbiddenException('You are not authorized to remove students from this course');
    }

    // Find the enrollment
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        courseId,
        studentId,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Student is not enrolled in this course');
    }

    await this.prisma.enrollment.delete({
      where: { id: enrollment.id },
    });

    return { message: 'Student removed from course successfully' };
  }

  private toResponseDto(course: Record<string, unknown>): CourseResponseDto {
    return {
      id: course.id as string,
      name: course.name as string,
      code: course.code as string,
      description: course.description as string | null,
      semester: course.semester as string,
      year: course.year as number,
      isActive: course.isActive as boolean,
      professorId: course.professorId as string,
      professor: course.professor as
        | { id: string; email: string; firstName: string; lastName: string }
        | undefined,
      createdAt: course.createdAt as Date,
      updatedAt: course.updatedAt as Date,
    };
  }
}
