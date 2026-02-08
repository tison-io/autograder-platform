import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, EnrollStudentsDto } from './dto';
import { createMockCourse, createMockProfessor } from '../../test/factories/test-data.factory';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockCoursesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByProfessor: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    enrollStudents: jest.fn(),
    getEnrolledStudents: jest.fn(),
    removeStudent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'An introductory course',
        semester: 'Spring',
        year: 2026,
        isActive: true,
      };
      const mockUser = createMockProfessor();
      const mockCourse = createMockCourse({
        ...createCourseDto,
        professorId: mockUser.id,
      });

      mockCoursesService.create.mockResolvedValue(mockCourse);

      const result = await controller.create(createCourseDto, mockUser as any);

      expect(service.create).toHaveBeenCalledWith(createCourseDto, mockUser.id);
      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const mockCourses = [
        createMockCourse({ id: '1', code: 'CS101' }),
        createMockCourse({ id: '2', code: 'CS102' }),
      ];

      mockCoursesService.findAll.mockResolvedValue(mockCourses);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCourses);
      expect(result).toHaveLength(2);
    });
  });

  describe('findMyCourses', () => {
    it('should return courses for the current professor', async () => {
      const mockUser = createMockProfessor();
      const mockCourses = [
        createMockCourse({ professorId: mockUser.id }),
        createMockCourse({ professorId: mockUser.id }),
      ];

      mockCoursesService.findByProfessor.mockResolvedValue(mockCourses);

      const result = await controller.findMyCourses(mockUser as any);

      expect(service.findByProfessor).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockCourses);
    });
  });

  describe('findOne', () => {
    it('should return a single course by id', async () => {
      const courseId = 'test-course-id';
      const mockCourse = createMockCourse({ id: courseId });

      mockCoursesService.findOne.mockResolvedValue(mockCourse);

      const result = await controller.findOne(courseId);

      expect(service.findOne).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(mockCourse);
      expect(result.id).toBe(courseId);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const courseId = 'test-course-id';
      const updateCourseDto: UpdateCourseDto = {
        name: 'Updated Course Name',
        description: 'Updated description',
      };
      const mockUser = createMockProfessor();
      const mockUpdatedCourse = createMockCourse({
        id: courseId,
        ...updateCourseDto,
        professorId: mockUser.id,
      });

      mockCoursesService.update.mockResolvedValue(mockUpdatedCourse);

      const result = await controller.update(courseId, updateCourseDto, mockUser as any);

      expect(service.update).toHaveBeenCalledWith(courseId, updateCourseDto, mockUser.id);
      expect(result).toEqual(mockUpdatedCourse);
      expect(result.name).toBe(updateCourseDto.name);
    });
  });

  describe('remove', () => {
    it('should delete a course', async () => {
      const courseId = 'test-course-id';
      const mockUser = createMockProfessor();

      mockCoursesService.remove.mockResolvedValue(undefined);

      await controller.remove(courseId, mockUser as any);

      expect(service.remove).toHaveBeenCalledWith(courseId, mockUser.id);
    });
  });

  describe('enrollStudents', () => {
    it('should enroll students in a course', async () => {
      const courseId = 'test-course-id';
      const enrollStudentsDto: EnrollStudentsDto = {
        studentIds: ['student-1', 'student-2', 'student-3'],
      };
      const mockUser = createMockProfessor();
      const mockResult = {
        message: 'Successfully enrolled 3 students',
        enrolledCount: 3,
      };

      mockCoursesService.enrollStudents.mockResolvedValue(mockResult);

      const result = await controller.enrollStudents(courseId, enrollStudentsDto, mockUser as any);

      expect(service.enrollStudents).toHaveBeenCalledWith(courseId, enrollStudentsDto, mockUser.id);
      expect(result).toEqual(mockResult);
      expect(result.enrolledCount).toBe(3);
    });
  });

  describe('getEnrolledStudents', () => {
    it('should return list of enrolled students', async () => {
      const courseId = 'test-course-id';
      const mockUser = createMockProfessor();
      const mockEnrollments = [
        {
          id: 'enroll-1',
          enrolledAt: new Date(),
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
          enrolledAt: new Date(),
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

      mockCoursesService.getEnrolledStudents.mockResolvedValue(mockEnrollments);

      const result = await controller.getEnrolledStudents(courseId, mockUser as any);

      expect(service.getEnrolledStudents).toHaveBeenCalledWith(courseId, mockUser.id);
      expect(result).toEqual(mockEnrollments);
      expect(result).toHaveLength(2);
    });
  });

  describe('removeStudent', () => {
    it('should remove a student from course', async () => {
      const courseId = 'test-course-id';
      const studentId = 'student-id';
      const mockUser = createMockProfessor();
      const mockResult = {
        message: 'Student removed from course successfully',
      };

      mockCoursesService.removeStudent.mockResolvedValue(mockResult);

      const result = await controller.removeStudent(courseId, studentId, mockUser as any);

      expect(service.removeStudent).toHaveBeenCalledWith(courseId, studentId, mockUser.id);
      expect(result).toEqual(mockResult);
    });
  });
});
