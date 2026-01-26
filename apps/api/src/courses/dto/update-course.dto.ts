import { IsString, IsInt, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiPropertyOptional({
    description: 'Course name',
    example: 'Advanced Computer Science',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional({
    description: 'Unique course code',
    example: 'CS201',
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  code?: string;

  @ApiPropertyOptional({
    description: 'Course description',
    example: 'An advanced course covering data structures and algorithms.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Semester',
    example: 'Spring 2026',
  })
  @IsOptional()
  @IsString()
  semester?: string;

  @ApiPropertyOptional({
    description: 'Academic year',
    example: 2026,
  })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({
    description: 'Whether the course is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
