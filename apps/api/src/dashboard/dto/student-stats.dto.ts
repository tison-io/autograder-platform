import { ApiProperty } from '@nestjs/swagger';

export class EnrolledCourseStatsDto {
  @ApiProperty({ example: 'clx123abc', description: 'Course ID' })
  id: string;

  @ApiProperty({ example: 'Introduction to Programming', description: 'Course name' })
  name: string;

  @ApiProperty({ example: 'CS101', description: 'Course code' })
  code: string;

  @ApiProperty({ example: 'Dr. Smith', description: 'Professor name' })
  professorName: string;

  @ApiProperty({ example: 5, description: 'Total assignments in course' })
  totalAssignments: number;

  @ApiProperty({ example: 3, description: 'Completed assignments' })
  completedAssignments: number;

  @ApiProperty({ example: 85.5, description: 'Average grade in this course' })
  averageGrade: number | null;
}

export class StudentStatsDto {
  @ApiProperty({ example: 4, description: 'Total enrolled courses' })
  totalCourses: number;

  @ApiProperty({ example: 3, description: 'Active courses' })
  activeCourses: number;

  @ApiProperty({ example: 12, description: 'Total assignments across all courses' })
  totalAssignments: number;

  @ApiProperty({ example: 8, description: 'Completed assignments' })
  completedAssignments: number;

  @ApiProperty({ example: 2, description: 'Assignments due in the next 7 days' })
  dueSoon: number;

  @ApiProperty({ example: 1, description: 'Overdue assignments' })
  overdueAssignments: number;

  @ApiProperty({ example: 15, description: 'Total submissions made' })
  totalSubmissions: number;

  @ApiProperty({ example: 87.3, description: 'Overall average grade' })
  averageGrade: number | null;

  @ApiProperty({ type: [EnrolledCourseStatsDto], description: 'Per-course statistics' })
  courseStats: EnrolledCourseStatsDto[];
}
