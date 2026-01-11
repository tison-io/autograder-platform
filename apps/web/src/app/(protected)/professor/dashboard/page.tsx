'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useMyCourses } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared';
import { Plus, BookOpen, FileText, Users, Clock } from 'lucide-react';

export default function ProfessorDashboard() {
  const { user } = useAuthStore();
  const { data: courses, isLoading } = useMyCourses();

  const courseCount = courses?.length || 0;
  const activeCourses = courses?.filter((c) => c.isActive).length || 0;
  const totalAssignments = courses?.reduce((sum, c) => sum + (c.assignmentCount || 0), 0) || 0;
  const totalStudents = courses?.reduce((sum, c) => sum + (c.studentCount || 0), 0) || 0;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Professor Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{activeCourses}</p>
                  <p className="text-sm text-gray-600 mt-1">{courseCount} total</p>
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
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{totalAssignments}</p>
                  <p className="text-sm text-gray-600 mt-1">Total created</p>
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
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <p className="text-3xl font-bold">{totalStudents}</p>
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
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-gray-600 mt-1">Pending review</p>
            </CardContent>
          </Card>
        </div>

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
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates in your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                No recent activity. Create your first course to get started.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>✅ Phase 7 Complete: Professor Dashboard</CardTitle>
            <CardDescription>Full course management interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>View all courses with stats</li>
              <li>Create and edit courses</li>
              <li>Course detail pages with tabs</li>
              <li>Assignment management pages</li>
              <li>Quick action buttons</li>
            </ul>
            <p className="text-sm text-gray-600 pt-4 border-t">
              <strong>Next:</strong> Phase 8 - Student Dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
