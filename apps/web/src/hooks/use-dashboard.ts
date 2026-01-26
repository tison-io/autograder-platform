import { useQuery } from '@tanstack/react-query';
import {
  dashboardService,
  ProfessorStats,
  RecentSubmissionsResponse,
  StudentStats,
  UpcomingDeadlinesResponse,
} from '@/services/dashboard.service';

// =====================================================
// PROFESSOR HOOKS
// =====================================================

/**
 * Hook to fetch professor dashboard statistics
 */
export function useProfessorStats() {
  return useQuery<ProfessorStats, Error>({
    queryKey: ['dashboard', 'professor', 'stats'],
    queryFn: () => dashboardService.getProfessorStats(),
    staleTime: 30 * 1000, // Consider stale after 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Hook to fetch recent submissions for professor
 */
export function useRecentSubmissions(limit?: number) {
  return useQuery<RecentSubmissionsResponse, Error>({
    queryKey: ['dashboard', 'professor', 'recent-submissions', limit],
    queryFn: () => dashboardService.getRecentSubmissions(limit),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Refetch more frequently for submissions
  });
}

// =====================================================
// STUDENT HOOKS
// =====================================================

/**
 * Hook to fetch student dashboard statistics
 */
export function useStudentStats() {
  return useQuery<StudentStats, Error>({
    queryKey: ['dashboard', 'student', 'stats'],
    queryFn: () => dashboardService.getStudentStats(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

/**
 * Hook to fetch upcoming assignment deadlines
 */
export function useUpcomingDeadlines(limit?: number) {
  return useQuery<UpcomingDeadlinesResponse, Error>({
    queryKey: ['dashboard', 'student', 'upcoming', limit],
    queryFn: () => dashboardService.getUpcomingDeadlines(limit),
    staleTime: 60 * 1000, // Deadlines don't change as frequently
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
