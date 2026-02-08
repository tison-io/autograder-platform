import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  enrollmentRequestsService,
  CreateEnrollmentRequestDto,
} from '@/services/enrollment-requests.service';
import { showToast } from './use-toast';

export function useEnrollmentRequestsByCourse(courseId: string) {
  return useQuery({
    queryKey: ['enrollment-requests', 'course', courseId],
    queryFn: () => enrollmentRequestsService.getByCourse(courseId),
    enabled: !!courseId,
  });
}

export function useCreateEnrollmentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: CreateEnrollmentRequestDto }) =>
      enrollmentRequestsService.create(courseId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-requests'] });
      queryClient.invalidateQueries({
        queryKey: ['enrollment-requests', 'course', data.courseId],
      });
      showToast.success(
        'Enrollment request sent',
        `Your request to enroll in ${data.course.name} has been submitted`,
      );
    },
    onError: (error: Error) => {
      showToast.error('Failed to send enrollment request', error.message);
    },
  });
}

export function useApproveEnrollmentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => enrollmentRequestsService.approve(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-requests'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      showToast.success('Request approved', 'Student has been enrolled in the course');
    },
    onError: (error: Error) => {
      showToast.error('Failed to approve request', error.message);
    },
  });
}

export function useRejectEnrollmentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => enrollmentRequestsService.reject(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-requests'] });
      showToast.success('Request rejected', 'The enrollment request has been rejected');
    },
    onError: (error: Error) => {
      showToast.error('Failed to reject request', error.message);
    },
  });
}
