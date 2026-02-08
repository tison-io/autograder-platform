import apiClient from '@/lib/api-client';

export enum EnrollmentRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface EnrollmentRequest {
  id: string;
  status: EnrollmentRequestStatus;
  message?: string;
  studentId: string;
  student: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    githubUsername?: string;
  };
  courseId: string;
  course: {
    id: string;
    code: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentRequestDto {
  message?: string;
}

export const enrollmentRequestsService = {
  async create(courseId: string, data: CreateEnrollmentRequestDto): Promise<EnrollmentRequest> {
    const response = await apiClient.post<EnrollmentRequest>(
      `/courses/${courseId}/enrollment-requests`,
      data,
    );
    return response.data;
  },

  async getByCourse(courseId: string): Promise<EnrollmentRequest[]> {
    const response = await apiClient.get<EnrollmentRequest[]>(
      `/courses/${courseId}/enrollment-requests`,
    );
    return response.data;
  },

  async approve(requestId: string): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(
      `/enrollment-requests/${requestId}/approve`,
    );
    return response.data;
  },

  async reject(requestId: string): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(
      `/enrollment-requests/${requestId}/reject`,
    );
    return response.data;
  },
};
