import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'Assignment title',
    example: 'Homework 1 - Data Structures',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Assignment description with instructions',
    example: 'Implement a binary search tree with insert, delete, and search operations.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Assignment due date (ISO 8601 format)',
    example: '2026-02-15T23:59:59.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiPropertyOptional({
    description: 'Maximum number of submission attempts',
    example: 5,
    default: 5,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxSubmissions?: number = 5;

  @ApiPropertyOptional({
    description: 'Whether late submissions are allowed',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  allowLateSubmissions?: boolean = false;

  @ApiProperty({
    description: 'ID of the course this assignment belongs to',
    example: 'clxxxxxxxxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'ID of the rubric to use for grading',
    example: 'clxxxxxxxxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  rubricId: string;
}
