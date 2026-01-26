'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useStudentStats, useUpcomingDeadlines } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared';
import {
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  Search,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading, error: statsError } = useStudentStats();
  const { data: upcomingData, isLoading: deadlinesLoading } = useUpcomingDeadlines(5);

  const getDeadlineBadge = (daysRemaining: number, hasSubmitted: boolean) => {
    if (hasSubmitted) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" /> Submitted
        </Badge>
      );
    }
    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" /> Overdue
        </Badge>
      );
    }
    if (daysRemaining <= 1) {
      return <Badge variant="destructive">Due Today</Badge>;
    }
    if (daysRemaining <= 3) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          {daysRemaining} days left
        </Badge>
      );
    }
    return <Badge variant="outline">{daysRemaining} days left</Badge>;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>

        {statsError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load dashboard statistics. Please try again later.</span>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{stats?.activeCourses ?? 0}</p>
                  <p className="text-sm text-gray-600 mt-1">{stats?.totalCourses ?? 0} total</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{stats?.completedAssignments ?? 0}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    of {stats?.totalAssignments ?? 0} completed
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{stats?.dueSoon ?? 0}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats?.overdueAssignments
                      ? `${stats.overdueAssignments} overdue`
                      : 'Next 7 days'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Average Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <p className="text-3xl font-bold">
                    {stats?.averageGrade !== null && stats?.averageGrade !== undefined
                      ? `${stats.averageGrade}%`
                      : '--'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats?.totalSubmissions
                      ? `${stats.totalSubmissions} submissions`
                      : 'No grades yet'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and navigation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/student/courses/browse" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Available Courses
                </Button>
              </Link>
              <Link href="/student/courses" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Courses
                </Button>
              </Link>
              <Link href="/student/assignments" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Assignments
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Assignments due soon</CardDescription>
            </CardHeader>
            <CardContent>
              {deadlinesLoading ? (
                <LoadingSpinner size="sm" />
              ) : upcomingData?.deadlines && upcomingData.deadlines.length > 0 ? (
                <div className="space-y-3">
                  {upcomingData.deadlines.map((deadline) => (
                    <div
                      key={deadline.assignmentId}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{deadline.title}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {deadline.courseCode} • Due{' '}
                          {format(new Date(deadline.dueDate), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      <div className="ml-2">
                        {getDeadlineBadge(deadline.daysRemaining, deadline.hasSubmitted)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No upcoming deadlines. Enroll in courses to see assignments.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        {stats?.courseStats && stats.courseStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Your performance across enrolled courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Course</th>
                      <th className="text-left py-3 px-2 font-medium">Professor</th>
                      <th className="text-center py-3 px-2 font-medium">Completed</th>
                      <th className="text-center py-3 px-2 font-medium">Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.courseStats.map((course) => (
                      <tr key={course.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <Link href={`/student/courses/${course.id}`} className="hover:underline">
                            <div className="font-medium">{course.code}</div>
                            <div className="text-gray-500 text-xs">{course.name}</div>
                          </Link>
                        </td>
                        <td className="py-3 px-2 text-gray-600">{course.professorName}</td>
                        <td className="text-center py-3 px-2">
                          <span className="font-medium">{course.completedAssignments}</span>
                          <span className="text-gray-400">/{course.totalAssignments}</span>
                        </td>
                        <td className="text-center py-3 px-2">
                          {course.averageGrade !== null ? (
                            <Badge
                              variant={course.averageGrade >= 70 ? 'default' : 'destructive'}
                              className={
                                course.averageGrade >= 90
                                  ? 'bg-green-500'
                                  : course.averageGrade >= 70
                                    ? 'bg-blue-500'
                                    : ''
                              }
                            >
                              {course.averageGrade}%
                            </Badge>
                          ) : (
                            <span className="text-gray-400">--</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
