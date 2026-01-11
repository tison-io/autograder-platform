import apiClient from '@/lib/api-client';

export interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  semester: string;
  year: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  professor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignmentCount?: number;
  studentCount?: number;
}

export interface CreateCourseDto {
  code: string;
  name: string;
  description?: string;
  semester: string;
  year: number;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
  isActive?: boolean;
}

export const coursesService = {
  async getAll(): Promise<Course[]> {
    const response = await apiClient.get<Course[]>('/courses');
    return response.data;
  },

  async getMyCourses(): Promise<Course[]> {
    const response = await apiClient.get<Course[]>('/courses/my-courses');
    return response.data;
  },

  async getById(id: string): Promise<Course> {
    const response = await apiClient.get<Course>(`/courses/${id}`);
    return response.data;
  },

  async create(data: CreateCourseDto): Promise<Course> {
    const response = await apiClient.post<Course>('/courses', data);
    return response.data;
  },

  async update(id: string, data: UpdateCourseDto): Promise<Course> {
    const response = await apiClient.patch<Course>(`/courses/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/courses/${id}`);
    return response.data;
  },

  async enroll(courseId: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(`/courses/${courseId}/enrollments`);
    return response.data;
  },
};
