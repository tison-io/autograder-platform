'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>Your active courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-gray-600 mt-2">Courses this semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>Pending work</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-gray-600 mt-2">Due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Grade</CardTitle>
              <CardDescription>Overall performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">--</p>
              <p className="text-sm text-gray-600 mt-2">No submissions yet</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Coming in Phase 8</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-gray-600">
              ✅ Phase 1-5 Complete: Backend APIs, Frontend Setup, Authentication
            </p>
            <p className="text-gray-600">
              🚧 Next: Shared Components → Professor Dashboard → Student Dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
