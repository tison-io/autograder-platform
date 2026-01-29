import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubmissionStatus } from '@autograder/database';

export class SubmissionStudentDto {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'john.doe@university.edu' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;
}

export class SubmissionAssignmentDto {
  @ApiProperty({ example: 'clx1234567890' })
  id: string;

  @ApiProperty({ example: 'Project 1: REST API' })
  title: string;

  @ApiProperty({ example: '2026-02-15T23:59:59.000Z' })
  dueDate: Date;

  @ApiProperty({ example: 5 })
  maxSubmissions: number;
}

export class SubmissionResponseDto {
  @ApiProperty({
    description: 'Unique submission ID',
    example: 'clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'GitHub repository URL',
    example: 'https://github.com/student/project-repo',
  })
  githubRepoUrl: string;

  @ApiPropertyOptional({
    description: 'Git commit hash being graded',
    example: 'abc123def456',
  })
  commitHash?: string;

  @ApiProperty({
    description: 'Current submission status',
    enum: SubmissionStatus,
    example: 'PENDING',
  })
  status: SubmissionStatus;

  @ApiProperty({
    description: 'Attempt number (1-5)',
    example: 1,
  })
  attemptNumber: number;

  @ApiProperty({
    description: 'When the submission was made',
    example: '2026-01-28T10:30:00.000Z',
  })
  submittedAt: Date;

  @ApiPropertyOptional({
    description: 'When grading started',
    example: '2026-01-28T10:31:00.000Z',
  })
  gradingStartedAt?: Date;

  @ApiPropertyOptional({
    description: 'When grading completed',
    example: '2026-01-28T10:35:00.000Z',
  })
  gradingCompletedAt?: Date;

  // Grading Results
  @ApiPropertyOptional({
    description: 'Total score achieved',
    example: 85.5,
  })
  totalScore?: number;

  @ApiPropertyOptional({
    description: 'Maximum possible score',
    example: 100,
  })
  maxScore?: number;

  @ApiPropertyOptional({
    description: 'Percentage score',
    example: 85.5,
  })
  percentage?: number;

  @ApiPropertyOptional({
    description: 'Letter grade',
    example: 'B+',
  })
  letterGrade?: string;

  @ApiPropertyOptional({
    description: 'Whether the build succeeded',
    example: true,
  })
  buildSuccess?: boolean;

  @ApiPropertyOptional({
    description: 'Error message if submission failed',
    example: null,
  })
  errorMessage?: string;

  // Related entities
  @ApiProperty({
    description: 'Student who made the submission',
    type: SubmissionStudentDto,
  })
  student: SubmissionStudentDto;

  @ApiProperty({
    description: 'Assignment submitted for',
    type: SubmissionAssignmentDto,
  })
  assignment: SubmissionAssignmentDto;
}

export class SubmissionListResponseDto {
  @ApiProperty({
    description: 'List of submissions',
    type: [SubmissionResponseDto],
  })
  submissions: SubmissionResponseDto[];

  @ApiProperty({
    description: 'Total count of submissions',
    example: 10,
  })
  total: number;
}
