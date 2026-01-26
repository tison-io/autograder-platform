import apiClient from '@/lib/api-client';

// =====================================================
// PROFESSOR TYPES
// =====================================================

export interface CourseStats {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  assignmentCount: number;
  submissionCount: number;
  pendingSubmissions: number;
}

export interface ProfessorStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalAssignments: number;
  publishedAssignments: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  averageGrade: number | null;
  courseStats: CourseStats[];
}

export interface RecentSubmission {
  id: string;
  studentName: string;
  studentEmail: string;
  assignmentTitle: string;
  courseCode: string;
  status: string;
  score: number | null;
  maxScore: number | null;
  submittedAt: string;
  attemptNumber: number;
}

export interface RecentSubmissionsResponse {
  submissions: RecentSubmission[];
  total: number;
}

// =====================================================
// STUDENT TYPES
// =====================================================

export interface EnrolledCourseStats {
  id: string;
  name: string;
  code: string;
  professorName: string;
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number | null;
}

export interface StudentStats {
  totalCourses: number;
  activeCourses: number;
  totalAssignments: number;
  completedAssignments: number;
  dueSoon: number;
  overdueAssignments: number;
  totalSubmissions: number;
  averageGrade: number | null;
  courseStats: EnrolledCourseStats[];
}

export interface UpcomingDeadline {
  assignmentId: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string;
  daysRemaining: number;
  hasSubmitted: boolean;
  submissionCount: number;
  maxSubmissions: number;
  bestScore: number | null;
}

export interface UpcomingDeadlinesResponse {
  deadlines: UpcomingDeadline[];
  total: number;
}

// =====================================================
// API SERVICE
// =====================================================

export const dashboardService = {
  // Professor endpoints
  getProfessorStats: async (): Promise<ProfessorStats> => {
    const response = await apiClient.get<ProfessorStats>('/dashboard/professor/stats');
    return response.data;
  },

  getRecentSubmissions: async (limit?: number): Promise<RecentSubmissionsResponse> => {
    const params = limit ? { limit } : {};
    const response = await apiClient.get<RecentSubmissionsResponse>(
      '/dashboard/professor/recent-submissions',
      { params },
    );
    return response.data;
  },

  // Student endpoints
  getStudentStats: async (): Promise<StudentStats> => {
    const response = await apiClient.get<StudentStats>('/dashboard/student/stats');
    return response.data;
  },

  getUpcomingDeadlines: async (limit?: number): Promise<UpcomingDeadlinesResponse> => {
    const params = limit ? { limit } : {};
    const response = await apiClient.get<UpcomingDeadlinesResponse>('/dashboard/student/upcoming', {
      params,
    });
    return response.data;
  },
};
