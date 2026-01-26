'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useProfessorStats, useRecentSubmissions } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared';
import { Plus, BookOpen, FileText, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ProfessorDashboard() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading, error: statsError } = useProfessorStats();
  const { data: recentSubmissions, isLoading: submissionsLoading } = useRecentSubmissions(5);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
    > = {
      PENDING: { variant: 'secondary', label: 'Pending' },
      CLONING: { variant: 'outline', label: 'Cloning' },
      TESTING: { variant: 'outline', label: 'Testing' },
      ANALYZING: { variant: 'outline', label: 'Analyzing' },
      GRADING: { variant: 'outline', label: 'Grading' },
      COMPLETED: { variant: 'default', label: 'Completed' },
      FAILED: { variant: 'destructive', label: 'Failed' },
    };
    const config = statusConfig[status] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Professor Dashboard</h1>
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
                Courses
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
                  <p className="text-3xl font-bold">{stats?.publishedAssignments ?? 0}</p>
                  <p className="text-sm text-gray-600 mt-1">{stats?.totalAssignments ?? 0} total</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{stats?.totalStudents ?? 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Enrolled total</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{stats?.pendingSubmissions ?? 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Pending review</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Average Grade Card */}
        {stats?.averageGrade !== null && stats?.averageGrade !== undefined && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">{stats.averageGrade}%</p>
                <p className="text-sm text-gray-600">average grade across all submissions</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/professor/courses/new" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Course
                </Button>
              </Link>
              <Link href="/professor/assignments/new" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Assignment
                </Button>
              </Link>
              <Link href="/professor/courses" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View All Courses
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Latest student submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {submissionsLoading ? (
                <LoadingSpinner size="sm" />
              ) : recentSubmissions?.submissions && recentSubmissions.submissions.length > 0 ? (
                <div className="space-y-3">
                  {recentSubmissions.submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{submission.studentName}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {submission.assignmentTitle} • {submission.courseCode}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusBadge(submission.status)}
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(submission.submittedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {recentSubmissions.total > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      +{recentSubmissions.total - 5} more submissions
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No submissions yet. Students will appear here once they submit assignments.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Course Stats Table */}
        {stats?.courseStats && stats.courseStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>Statistics for each of your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Course</th>
                      <th className="text-center py-3 px-2 font-medium">Students</th>
                      <th className="text-center py-3 px-2 font-medium">Assignments</th>
                      <th className="text-center py-3 px-2 font-medium">Submissions</th>
                      <th className="text-center py-3 px-2 font-medium">Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.courseStats.map((course) => (
                      <tr key={course.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <Link
                            href={`/professor/courses/${course.id}`}
                            className="hover:underline"
                          >
                            <div className="font-medium">{course.code}</div>
                            <div className="text-gray-500 text-xs">{course.name}</div>
                          </Link>
                        </td>
                        <td className="text-center py-3 px-2">{course.studentCount}</td>
                        <td className="text-center py-3 px-2">{course.assignmentCount}</td>
                        <td className="text-center py-3 px-2">{course.submissionCount}</td>
                        <td className="text-center py-3 px-2">
                          {course.pendingSubmissions > 0 ? (
                            <Badge variant="secondary">{course.pendingSubmissions}</Badge>
                          ) : (
                            <span className="text-gray-400">0</span>
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
