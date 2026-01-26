import { ApiProperty } from '@nestjs/swagger';

export class UpcomingDeadlineDto {
  @ApiProperty({ example: 'clx123abc', description: 'Assignment ID' })
  assignmentId: string;

  @ApiProperty({ example: 'Assignment 3: REST API', description: 'Assignment title' })
  title: string;

  @ApiProperty({ example: 'CS101', description: 'Course code' })
  courseCode: string;

  @ApiProperty({ example: 'Introduction to Programming', description: 'Course name' })
  courseName: string;

  @ApiProperty({ example: '2024-01-20T23:59:00Z', description: 'Due date' })
  dueDate: Date;

  @ApiProperty({ example: 3, description: 'Days until deadline (negative if overdue)' })
  daysRemaining: number;

  @ApiProperty({ example: true, description: 'Whether student has submitted' })
  hasSubmitted: boolean;

  @ApiProperty({ example: 2, description: 'Number of submissions made' })
  submissionCount: number;

  @ApiProperty({ example: 5, description: 'Maximum allowed submissions' })
  maxSubmissions: number;

  @ApiProperty({ example: 85.5, description: 'Best score if submitted' })
  bestScore: number | null;
}

export class UpcomingDeadlinesResponseDto {
  @ApiProperty({ type: [UpcomingDeadlineDto], description: 'List of upcoming deadlines' })
  deadlines: UpcomingDeadlineDto[];

  @ApiProperty({ example: 5, description: 'Total upcoming assignments' })
  total: number;
}
