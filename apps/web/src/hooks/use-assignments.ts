import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  assignmentsService,
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from '@/services/assignments.service';
import { showToast } from './use-toast';

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: assignmentsService.getAll,
  });
}

export function useAssignmentsByCourse(courseId: string) {
  return useQuery({
    queryKey: ['assignments', 'course', courseId],
    queryFn: () => assignmentsService.getByCourse(courseId),
    enabled: !!courseId,
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ['assignments', id],
    queryFn: () => assignmentsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssignmentDto) => assignmentsService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignments', 'course', data.course?.id] });
      showToast.success('Assignment created', `"${data.title}" has been created successfully`);
    },
    onError: (error: Error) => {
      showToast.error('Failed to create assignment', error.message);
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentDto }) =>
      assignmentsService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignments', id] });
      queryClient.invalidateQueries({ queryKey: ['assignments', 'course', data.course?.id] });
      showToast.success('Assignment updated', `"${data.title}" has been updated successfully`);
    },
    onError: (error: Error) => {
      showToast.error('Failed to update assignment', error.message);
    },
  });
}

export function usePublishAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentsService.publish(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignments', data.id] });
      queryClient.invalidateQueries({ queryKey: ['assignments', 'course', data.course?.id] });
      showToast.success('Assignment published', `"${data.title}" is now visible to students`);
    },
    onError: (error: Error) => {
      showToast.error('Failed to publish assignment', error.message);
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      showToast.success('Assignment deleted', 'The assignment has been removed');
    },
    onError: (error: Error) => {
      showToast.error('Failed to delete assignment', error.message);
    },
  });
}
