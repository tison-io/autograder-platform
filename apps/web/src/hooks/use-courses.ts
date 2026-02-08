import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesService, CreateCourseDto, UpdateCourseDto, EnrollStudentsDto } from '@/services';
import { showToast } from './use-toast';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: coursesService.getAll,
  });
}

export function useMyCourses() {
  return useQuery({
    queryKey: ['courses', 'my-courses'],
    queryFn: coursesService.getMyCourses,
  });
}

export function useEnrolledCourses() {
  return useQuery({
    queryKey: ['courses', 'enrolled'],
    queryFn: coursesService.getEnrolledCourses,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => coursesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseDto) => coursesService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showToast.success('Course created', `"${data.name}" has been created successfully`);
    },
    onError: (error: Error) => {
      showToast.error('Failed to create course', error.message);
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseDto }) =>
      coursesService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', id] });
      showToast.success('Course updated', `"${data.name}" has been updated`);
    },
    onError: (error: Error) => {
      showToast.error('Failed to update course', error.message);
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coursesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showToast.success('Course deleted', 'The course has been removed');
    },
    onError: (error: Error) => {
      showToast.error('Failed to delete course', error.message);
    },
  });
}

// Enrollment hooks
export function useEnrolledStudents(courseId: string) {
  return useQuery({
    queryKey: ['courses', courseId, 'students'],
    queryFn: () => coursesService.getEnrolledStudents(courseId),
    enabled: !!courseId,
  });
}

export function useEnrollStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: EnrollStudentsDto }) =>
      coursesService.enrollStudents(courseId, data),
    onSuccess: (result, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId, 'students'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showToast.success('Students enrolled', result.message);
    },
    onError: (error: Error) => {
      showToast.error('Failed to enroll students', error.message);
    },
  });
}

export function useRemoveStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, studentId }: { courseId: string; studentId: string }) =>
      coursesService.removeStudent(courseId, studentId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId, 'students'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showToast.success('Student removed', 'The student has been removed from the course');
    },
    onError: (error: Error) => {
      showToast.error('Failed to remove student', error.message);
    },
  });
}

// Legacy hook - kept for backward compatibility
export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => coursesService.enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showToast.success('Enrolled successfully', 'You have been enrolled in the course');
    },
    onError: (error: Error) => {
      showToast.error('Enrollment failed', error.message);
    },
  });
}
