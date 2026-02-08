import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useEnrollmentRequestsByCourse,
  useApproveEnrollmentRequest,
  useRejectEnrollmentRequest,
} from '@/hooks';
import { EmptyState } from '@/components/shared';
import { Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { format } from 'date-fns';

interface EnrollmentRequestsManagerProps {
  courseId: string;
}

export function EnrollmentRequestsManager({ courseId }: EnrollmentRequestsManagerProps) {
  const { data: requests, isLoading, error } = useEnrollmentRequestsByCourse(courseId);
  const approveMutation = useApproveEnrollmentRequest();
  const rejectMutation = useRejectEnrollmentRequest();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await approveMutation.mutateAsync(requestId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await rejectMutation.mutateAsync(requestId);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Requests</CardTitle>
          <CardDescription>Loading enrollment requests...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Requests</CardTitle>
          <CardDescription className="text-red-600">
            Failed to load enrollment requests
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Enrollment Requests</span>
          {requests && requests.length > 0 && (
            <Badge variant="secondary">{requests.length} pending</Badge>
          )}
        </CardTitle>
        <CardDescription>Review and approve student enrollment requests</CardDescription>
      </CardHeader>
      <CardContent>
        {!requests || requests.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No pending requests"
            description="There are no pending enrollment requests for this course."
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold text-lg">
                          {request.student.firstName} {request.student.lastName}
                        </h4>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Email: {request.student.email}</p>
                        {request.student.githubUsername && (
                          <p>GitHub: @{request.student.githubUsername}</p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            Requested {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      {request.message && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                          <p className="text-gray-700">{request.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="w-24"
                      >
                        {processingId === request.id && approveMutation.isPending ? (
                          'Approving...'
                        ) : (
                          <>
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                        disabled={processingId === request.id}
                        className="w-24"
                      >
                        {processingId === request.id && rejectMutation.isPending ? (
                          'Rejecting...'
                        ) : (
                          <>
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
