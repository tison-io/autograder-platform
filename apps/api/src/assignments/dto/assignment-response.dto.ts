export class AssignmentResponseDto {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  maxSubmissions: number;
  allowLateSubmissions: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  course?: {
    id: string;
    name: string;
    code: string;
  };

  rubric?: {
    id: string;
    name: string;
    totalPoints: number;
  };

  // Stats
  submissionCount?: number;
  studentCount?: number;
}
