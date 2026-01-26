import { ApiProperty } from '@nestjs/swagger';

export class CourseStatsDto {
  @ApiProperty({ example: 'clx123abc', description: 'Course ID' })
  id: string;

  @ApiProperty({ example: 'Introduction to Programming', description: 'Course name' })
  name: string;

  @ApiProperty({ example: 'CS101', description: 'Course code' })
  code: string;

  @ApiProperty({ example: 25, description: 'Number of enrolled students' })
  studentCount: number;

  @ApiProperty({ example: 5, description: 'Number of assignments' })
  assignmentCount: number;

  @ApiProperty({ example: 42, description: 'Total submissions for this course' })
  submissionCount: number;

  @ApiProperty({ example: 8, description: 'Pending submissions awaiting grading' })
  pendingSubmissions: number;
}

export class ProfessorStatsDto {
  @ApiProperty({ example: 4, description: 'Total courses taught' })
  totalCourses: number;

  @ApiProperty({ example: 3, description: 'Active courses' })
  activeCourses: number;

  @ApiProperty({ example: 87, description: 'Total enrolled students across all courses' })
  totalStudents: number;

  @ApiProperty({ example: 15, description: 'Total assignments created' })
  totalAssignments: number;

  @ApiProperty({ example: 8, description: 'Published assignments' })
  publishedAssignments: number;

  @ApiProperty({ example: 142, description: 'Total submissions received' })
  totalSubmissions: number;

  @ApiProperty({ example: 12, description: 'Submissions pending grading' })
  pendingSubmissions: number;

  @ApiProperty({ example: 85.5, description: 'Average grade across all submissions' })
  averageGrade: number | null;

  @ApiProperty({ type: [CourseStatsDto], description: 'Per-course statistics' })
  courseStats: CourseStatsDto[];
}
