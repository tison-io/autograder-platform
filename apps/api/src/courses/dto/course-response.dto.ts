import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProfessorInfoDto {
  @ApiProperty({ description: 'Professor ID' })
  id: string;

  @ApiProperty({ description: 'Professor email' })
  email: string;

  @ApiProperty({ description: 'Professor first name' })
  firstName: string;

  @ApiProperty({ description: 'Professor last name' })
  lastName: string;
}

export class CourseResponseDto {
  @ApiProperty({ description: 'Course ID', example: 'clxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ description: 'Course name', example: 'Introduction to Computer Science' })
  name: string;

  @ApiProperty({ description: 'Course code', example: 'CS101' })
  code: string;

  @ApiPropertyOptional({ description: 'Course description', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Semester', example: 'Fall 2025' })
  semester: string;

  @ApiProperty({ description: 'Academic year', example: 2025 })
  year: number;

  @ApiProperty({ description: 'Whether course is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Professor ID' })
  professorId: string;

  @ApiPropertyOptional({ description: 'Professor information', type: ProfessorInfoDto })
  professor?: ProfessorInfoDto;

  @ApiPropertyOptional({ description: 'Number of enrolled students', example: 25 })
  enrollmentCount?: number;

  @ApiProperty({ description: 'Course creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
