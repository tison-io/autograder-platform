import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { createMockPrismaService } from '../../test/mocks/prisma.mock';
import {
  createMockCourse,
  createMockProfessor,
  createMockStudent,
} from '../../test/factories/test-data.factory';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EnrollStudentsDto } from './dto/enroll-students.dto';

describe('CoursesService', () => {
  let service: CoursesService;
  let prismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const professorId = 'test-professor-id-123';
    const createCourseDto: CreateCourseDto = {
      name: 'Introduction to Computer Science',
      code: 'CS101',
      description: 'An introductory course',
      semester: 'Spring',
      year: 2026,
      isActive: true,
    };

    it('should successfully create a new course', async () => {
      const mockProfessor = createMockProfessor({ id: professorId });
      const mockCourse = createMockCourse({
        ...createCourseDto,
        professorId,
        professor: {
          id: mockProfessor.id,
          email: mockProfessor.email,
          firstName: mockProfessor.firstName,
          lastName: mockProfessor.lastName,
        },
      });

      prismaService.course.findUnique.mockResolvedValue(null);
      prismaService.course.create.mockResolvedValue(mockCourse);

      const result = await service.create(createCourseDto, professorId);

      expect(prismaService.course.findUnique).toHaveBeenCalledWith({
        where: { code: createCourseDto.code },
      });
      expect(prismaService.course.create).toHaveBeenCalledWith({
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
      expect(result.name).toBe(createCourseDto.name);
      expect(result.code).toBe(createCourseDto.code);
      expect(result.professorId).toBe(professorId);
    });

    it('should throw ConflictException if course code already exists', async () => {
      const existingCourse = createMockCourse({ code: createCourseDto.code });
      prismaService.course.findUnique.mockResolvedValue(existingCourse);

      await expect(service.create(createCourseDto, professorId)).rejects.toThrow(ConflictException);
      await expect(service.create(createCourseDto, professorId)).rejects.toThrow(
        'Course with this code already exists',
      );
      expect(prismaService.course.create).not.toHaveBeenCalled();
    });

    it('should default isActive to true if not provided', async () => {
      const dtoWithoutIsActive = { ...createCourseDto };
      delete dtoWithoutIsActive.isActive;

      const mockCourse = createMockCourse({
        ...dtoWithoutIsActive,
        isActive: true,
        professorId,
      });

      prismaService.course.findUnique.mockResolvedValue(null);
      prismaService.course.create.mockResolvedValue(mockCourse);

      await service.create(dtoWithoutIsActive, professorId);

      expect(prismaService.course.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const mockCourses = [
        createMockCourse({
          id: '1',
          professor: {
            id: 'prof1',
            email: 'prof1@test.com',
            firstName: 'Prof',
            lastName: 'One',
          },
          _count: { enrollments: 10 },
        }),
        createMockCourse({
          id: '2',
          professor: {
            id: 'prof2',
            email: 'prof2@test.com',
            firstName: 'Prof',
            lastName: 'Two',
          },
          _count: { enrollments: 5 },
        }),
      ];

      prismaService.course.findMany.mockResolvedValue(mockCourses);

      const result = await service.findAll();

      expect(prismaService.course.findMany).toHaveBeenCalledWith({
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
      expect(result).toHaveLength(2);
      expect(result[0].enrollmentCount).toBe(10);
      expect(result[1].enrollmentCount).toBe(5);
    });

    it('should return empty array when no courses exist', async () => {
      prismaService.course.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    const courseId = 'test-course-id-123';

    it('should return a course if found', async () => {
      const mockCourse = createMockCourse({
        id: courseId,
        professor: {
          id: 'prof1',
          email: 'prof@test.com',
          firstName: 'Prof',
          lastName: 'Smith',
        },
        _count: { enrollments: 15 },
      });

      prismaService.course.findUnique.mockResolvedValue(mockCourse);

      const result = await service.findOne(courseId);

      expect(prismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId },
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
      expect(result.id).toBe(courseId);
      expect(result.enrollmentCount).toBe(15);
    });

    it('should throw NotFoundException if course not found', async () => {
      prismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.findOne(courseId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(courseId)).rejects.toThrow(
        `Course with ID ${courseId} not found`,
      );
    });
  });

  describe('findByProfessor', () => {
    const professorId = 'test-professor-id-123';

    it('should return courses for a specific professor', async () => {
      const mockCourses = [
        createMockCourse({
          id: '1',
          professorId,
          professor: {
            id: professorId,
            email: 'prof@test.com',
            firstName: 'Prof',
            lastName: 'Smith',
          },
          _count: { enrollments: 10 },
        }),
        createMockCourse({
          id: '2',
          professorId,
          professor: {
            id: professorId,
            email: 'prof@test.com',
            firstName: 'Prof',
            lastName: 'Smith',
          },
          _count: { enrollments: 8 },
        }),
      ];

      prismaService.course.findMany.mockResolvedValue(mockCourses);

      const result = await service.findByProfessor(professorId);

      expect(prismaService.course.findMany).toHaveBeenCalledWith({
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
      expect(result).toHaveLength(2);
      expect(result[0].professorId).toBe(professorId);
    });

    it('should return empty array if professor has no courses', async () => {
      prismaService.course.findMany.mockResolvedValue([]);

      const result = await service.findByProfessor(professorId);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    const courseId = 'test-course-id-123';
    const professorId = 'test-professor-id-123';
    const updateCourseDto: UpdateCourseDto = {
      name: 'Updated Course Name',
      description: 'Updated description',
    };

    it('should successfully update a course', async () => {
      const existingCourse = createMockCourse({ id: courseId, professorId });
      const updatedCourse = createMockCourse({
        ...existingCourse,
        ...updateCourseDto,
        professor: {
          id: professorId,
          email: 'prof@test.com',
          firstName: 'Prof',
          lastName: 'Smith',
        },
      });

      prismaService.course.findUnique.mockResolvedValue(existingCourse);
      prismaService.course.update.mockResolvedValue(updatedCourse);

      const result = await service.update(courseId, updateCourseDto, professorId);

      expect(prismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId },
      });
      expect(prismaService.course.update).toHaveBeenCalledWith({
        where: { id: courseId },
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
      expect(result.name).toBe(updateCourseDto.name);
      expect(result.description).toBe(updateCourseDto.description);
    });

    it('should throw NotFoundException if course not found', async () => {
      prismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.update(courseId, updateCourseDto, professorId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the course owner', async () => {
      const existingCourse = createMockCourse({
        id: courseId,
        professorId: 'different-professor-id',
      });
      prismaService.course.findUnique.mockResolvedValue(existingCourse);

      await expect(service.update(courseId, updateCourseDto, professorId)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.update(courseId, updateCourseDto, professorId)).rejects.toThrow(
        'You are not authorized to update this course',
      );
      expect(prismaService.course.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const courseId = 'test-course-id-123';
    const professorId = 'test-professor-id-123';

    it('should successfully delete a course', async () => {
      const existingCourse = createMockCourse({ id: courseId, professorId });

      prismaService.course.findUnique.mockResolvedValue(existingCourse);
      prismaService.course.delete.mockResolvedValue(existingCourse);

      await service.remove(courseId, professorId);

      expect(prismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId },
      });
      expect(prismaService.course.delete).toHaveBeenCalledWith({
        where: { id: courseId },
      });
    });

    it('should throw NotFoundException if course not found', async () => {
      prismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.remove(courseId, professorId)).rejects.toThrow(NotFoundException);
      expect(prismaService.course.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the course owner', async () => {
      const existingCourse = createMockCourse({
        id: courseId,
        professorId: 'different-professor-id',
      });
      prismaService.course.findUnique.mockResolvedValue(existingCourse);

      await expect(service.remove(courseId, professorId)).rejects.toThrow(ForbiddenException);
      await expect(service.remove(courseId, professorId)).rejects.toThrow(
        'You are not authorized to delete this course',
      );
      expect(prismaService.course.delete).not.toHaveBeenCalled();
    });
  });

  describe('enrollStudents', () => {
    const courseId = 'test-course-id-123';
    const professorId = 'test-professor-id-123';
    const enrollStudentsDto: EnrollStudentsDto = {
      studentIds: ['student-1', 'student-2', 'student-3'],
    };

    it('should successfully enroll students in a course', async () => {
      const mockCourse = createMockCourse({ id: courseId, professorId });
      const mockStudents = [
        createMockStudent({ id: 'student-1', email: 'student1@test.com' }),
        createMockStudent({ id: 'student-2', email: 'student2@test.com' }),
        createMockStudent({ id: 'student-3', email: 'student3@test.com' }),
      ];
      const mockEnrollments = [
        { id: 'enroll-1', studentId: 'student-1', courseId },
        { id: 'enroll-2', studentId: 'student-2', courseId },
        { id: 'enroll-3', studentId: 'student-3', courseId },
      ];

      prismaService.course.findUnique.mockResolvedValue(mockCourse);
      prismaService.user.findMany.mockResolvedValue(mockStudents);
      prismaService.enrollment.create
        .mockResolvedValueOnce(mockEnrollments[0])
        .mockResolvedValueOnce(mockEnrollments[1])
        .mockResolvedValueOnce(mockEnrollments[2]);

      const result = await service.enrollStudents(courseId, enrollStudentsDto, professorId);

      expect(prismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId },
      });
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: enrollStudentsDto.studentIds },
          role: 'STUDENT',
        },
      });
      expect(prismaService.enrollment.create).toHaveBeenCalledTimes(3);
      expect(result.enrolledCount).toBe(3);
      expect(result.message).toContain('Successfully enrolled 3 students');
    });

    it('should throw NotFoundException if course not found', async () => {
      prismaService.course.findUnique.mockResolvedValue(null);

      await expect(
        service.enrollStudents(courseId, enrollStudentsDto, professorId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the course owner', async () => {
      const mockCourse = createMockCourse({
        id: courseId,
        professorId: 'different-professor-id',
      });
      prismaService.course.findUnique.mockResolvedValue(mockCourse);

      await expect(
        service.enrollStudents(courseId, enrollStudentsDto, professorId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if some student IDs are invalid', async () => {
      const mockCourse = createMockCourse({ id: courseId, professorId });
      const mockStudents = [
        createMockStudent({ id: 'student-1' }),
        // Only 1 student found instead of 3
      ];

      prismaService.course.findUnique.mockResolvedValue(mockCourse);
      prismaService.user.findMany.mockResolvedValue(mockStudents);

      await expect(
        service.enrollStudents(courseId, enrollStudentsDto, professorId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.enrollStudents(courseId, enrollStudentsDto, professorId),
      ).rejects.toThrow('One or more student IDs are invalid');
    });

    it('should skip already enrolled students', async () => {
      const mockCourse = createMockCourse({ id: courseId, professorId });
      const mockStudents = [
        createMockStudent({ id: 'student-1' }),
        createMockStudent({ id: 'student-2' }),
      ];

      prismaService.course.findUnique.mockResolvedValue(mockCourse);
      prismaService.user.findMany.mockResolvedValue(mockStudents);
      prismaService.enrollment.create
        .mockResolvedValueOnce({ id: 'enroll-1', studentId: 'student-1', courseId })
        .mockRejectedValueOnce(new Error('Already enrolled')); // Second one fails

      const result = await service.enrollStudents(
        courseId,
        { studentIds: ['student-1', 'student-2'] },
        professorId,
      );

      expect(result.enrolledCount).toBe(1);
      expect(result.message).toContain('Successfully enrolled 1 students');
    });
  });

  describe('getEnrolledStudents', () => {
    const courseId = 'test-course-id-123';
    const professorId = 'test-professor-id-123';

    it('should return list of enrolled students', async () => {
      const mockCourse = createMockCourse({ id: courseId, professorId });
      const mockEnrollments = [
        {
          id: 'enroll-1',
          courseId,
          studentId: 'student-1',
          enrolledAt: new Date('2026-01-15'),
          student: {
            id: 'student-1',
            email: 'student1@test.com',
            firstName: 'Student',
            lastName: 'One',
            githubUsername: 'student1',
            avatarUrl: null,
          },
        },
        {
          id: 'enroll-2',
          courseId,
          studentId: 'student-2',
          enrolledAt: new Date('2026-01-16'),
          student: {
            id: 'student-2',
            email: 'student2@test.com',
            firstName: 'Student',
            lastName: 'Two',
            githubUsername: 'student2',
            avatarUrl: null,
          },
        },
      ];

      prismaService.course.findUnique.mockResolvedValue(mockCourse);
      prismaService.enrollment.findMany.mockResolvedValue(mockEnrollments);

      const result = await service.getEnrolledStudents(courseId, professorId);

      expect(prismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId },
      });
      expect(prismaService.enrollment.findMany).toHaveBeenCalledWith({
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
      expect(result).toHaveLength(2);
      expect(result[0].student.email).toBe('student1@test.com');
    });

    it('should throw NotFoundException if course not found', async () => {
      prismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.getEnrolledStudents(courseId, professorId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the course owner', async () => {
      const mockCourse = createMockCourse({
        id: courseId,
        professorId: 'different-professor-id',
      });
      prismaService.course.findUnique.mockResolvedValue(mockCourse);

      await expect(service.getEnrolledStudents(courseId, professorId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('removeStudent', () => {
    const courseId = 'test-course-id-123';
    const studentId = 'student-id-123';
    const professorId = 'test-professor-id-123';

    it('should successfully remove a student from course', async () => {
      const mockCourse = createMockCourse({ id: courseId, professorId });
      const mockEnrollment = {
        id: 'enroll-1',
        courseId,
        studentId,
        enrolledAt: new Date(),
      };

      prismaService.course.findUnique.mockResolvedValue(mockCourse);
      prismaService.enrollment.findFirst.mockResolvedValue(mockEnrollment);
      prismaService.enrollment.delete.mockResolvedValue(mockEnrollment);

      const result = await service.removeStudent(courseId, studentId, professorId);

      expect(prismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: courseId },
      });
      expect(prismaService.enrollment.findFirst).toHaveBeenCalledWith({
        where: {
          courseId,
          studentId,
        },
      });
      expect(prismaService.enrollment.delete).toHaveBeenCalledWith({
        where: { id: mockEnrollment.id },
      });
      expect(result.message).toBe('Student removed from course successfully');
    });

    it('should throw NotFoundException if course not found', async () => {
      prismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.removeStudent(courseId, studentId, professorId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the course owner', async () => {
      const mockCourse = createMockCourse({
        id: courseId,
        professorId: 'different-professor-id',
      });
      prismaService.course.findUnique.mockResolvedValue(mockCourse);

      await expect(service.removeStudent(courseId, studentId, professorId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if student is not enrolled', async () => {
      const mockCourse = createMockCourse({ id: courseId, professorId });

      prismaService.course.findUnique.mockResolvedValue(mockCourse);
      prismaService.enrollment.findFirst.mockResolvedValue(null);

      await expect(service.removeStudent(courseId, studentId, professorId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.removeStudent(courseId, studentId, professorId)).rejects.toThrow(
        'Student is not enrolled in this course',
      );
      expect(prismaService.enrollment.delete).not.toHaveBeenCalled();
    });
  });
});
