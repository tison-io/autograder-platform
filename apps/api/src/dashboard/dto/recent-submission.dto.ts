import { ApiProperty } from '@nestjs/swagger';

export class RecentSubmissionDto {
  @ApiProperty({ example: 'clx123abc', description: 'Submission ID' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Student full name' })
  studentName: string;

  @ApiProperty({ example: 'johndoe@university.edu', description: 'Student email' })
  studentEmail: string;

  @ApiProperty({ example: 'Assignment 1: Hello World', description: 'Assignment title' })
  assignmentTitle: string;

  @ApiProperty({ example: 'CS101', description: 'Course code' })
  courseCode: string;

  @ApiProperty({ example: 'COMPLETED', description: 'Submission status' })
  status: string;

  @ApiProperty({ example: 85.5, description: 'Score received' })
  score: number | null;

  @ApiProperty({ example: 100, description: 'Maximum possible score' })
  maxScore: number | null;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Submission timestamp' })
  submittedAt: Date;

  @ApiProperty({ example: 2, description: 'Attempt number' })
  attemptNumber: number;
}

export class RecentSubmissionsResponseDto {
  @ApiProperty({ type: [RecentSubmissionDto], description: 'List of recent submissions' })
  submissions: RecentSubmissionDto[];

  @ApiProperty({ example: 142, description: 'Total submissions count' })
  total: number;
}
