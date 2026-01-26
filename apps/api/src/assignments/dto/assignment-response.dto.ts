import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CourseInfoDto {
  @ApiProperty({ description: 'Course ID' })
  id: string;

  @ApiProperty({ description: 'Course name' })
  name: string;

  @ApiProperty({ description: 'Course code' })
  code: string;
}

class RubricInfoDto {
  @ApiProperty({ description: 'Rubric ID' })
  id: string;

  @ApiProperty({ description: 'Rubric name' })
  name: string;

  @ApiProperty({ description: 'Total points' })
  totalPoints: number;
}

export class AssignmentResponseDto {
  @ApiProperty({ description: 'Assignment ID', example: 'clxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ description: 'Assignment title', example: 'Homework 1 - Data Structures' })
  title: string;

  @ApiProperty({ description: 'Assignment description' })
  description: string;

  @ApiProperty({ description: 'Due date' })
  dueDate: Date;

  @ApiProperty({ description: 'Maximum submission attempts', example: 5 })
  maxSubmissions: number;

  @ApiProperty({ description: 'Whether late submissions are allowed' })
  allowLateSubmissions: boolean;

  @ApiProperty({ description: 'Whether assignment is published to students' })
  isPublished: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Course information', type: CourseInfoDto })
  course?: CourseInfoDto;

  @ApiPropertyOptional({ description: 'Rubric information', type: RubricInfoDto })
  rubric?: RubricInfoDto;

  @ApiPropertyOptional({ description: 'Number of submissions', example: 15 })
  submissionCount?: number;

  @ApiPropertyOptional({ description: 'Number of students in course', example: 30 })
  studentCount?: number;
}
