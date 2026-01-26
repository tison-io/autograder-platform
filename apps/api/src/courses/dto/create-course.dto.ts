import { IsString, IsInt, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Course name',
    example: 'Introduction to Computer Science',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Unique course code',
    example: 'CS101',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  code: string;

  @ApiPropertyOptional({
    description: 'Course description',
    example: 'An introductory course covering fundamental programming concepts.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Semester',
    example: 'Fall 2025',
  })
  @IsString()
  semester: string;

  @ApiProperty({
    description: 'Academic year',
    example: 2025,
  })
  @IsInt()
  year: number;

  @ApiPropertyOptional({
    description: 'Whether the course is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
