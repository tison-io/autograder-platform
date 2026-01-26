import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
  IsArray,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCriterionDto {
  @ApiProperty({
    description: 'Criterion title',
    example: 'Code Quality',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Maximum points for this criterion',
    example: 20,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  maxPoints: number;

  @ApiPropertyOptional({
    description: 'Weight multiplier for this criterion',
    example: 1.0,
    default: 1.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number = 1.0;

  @ApiProperty({
    description: 'Evaluation method',
    example: 'hybrid',
    enum: ['unit_test', 'gpt_semantic', 'hybrid'],
  })
  @IsString()
  @IsNotEmpty()
  evaluationMethod: string;

  @ApiPropertyOptional({
    description: 'Weight for unit test score (0-1)',
    example: 0.5,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  unitTestWeight?: number = 0;

  @ApiPropertyOptional({
    description: 'Weight for GPT evaluation score (0-1)',
    example: 0.5,
    default: 1.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  gptWeight?: number = 1.0;

  @ApiProperty({
    description: 'Instructions for GPT evaluator',
    example: 'Evaluate code quality based on readability, naming conventions, and modularity.',
  })
  @IsString()
  @IsNotEmpty()
  gptInstructions: string;

  @ApiPropertyOptional({
    description: 'File patterns to analyze',
    example: ['src/**/*.ts', 'src/**/*.tsx'],
    default: [],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  filesToAnalyze?: string[] = [];

  @ApiProperty({
    description: 'Achievement level descriptions',
    example: {
      excellent: 'Clean, well-structured code with proper naming',
      good: 'Mostly clean code with minor issues',
      fair: 'Some code quality issues present',
      poor: 'Significant code quality problems',
    },
  })
  @IsObject()
  @IsNotEmpty()
  levels: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Display order of this criterion',
    example: 0,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order?: number = 0;
}

export class CreateRubricDto {
  @ApiProperty({
    description: 'Rubric name',
    example: 'Full-Stack Web Application Rubric',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Rubric description',
    example: 'Comprehensive rubric for evaluating full-stack web applications.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Total points for this rubric',
    example: 100,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  totalPoints: number;

  @ApiProperty({
    description: 'Minimum points to pass',
    example: 60,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  passingGrade: number;

  @ApiPropertyOptional({
    description: 'Additional metadata (tech stack, requirements, etc.)',
    example: { techStack: ['React', 'NestJS', 'PostgreSQL'], projectType: 'full-stack' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class CreateRubricWithCriteriaDto {
  @ApiProperty({
    description: 'Rubric information',
    type: CreateRubricDto,
  })
  @ValidateNested()
  @Type(() => CreateRubricDto)
  rubric: CreateRubricDto;

  @ApiProperty({
    description: 'List of grading criteria',
    type: [CreateCriterionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCriterionDto)
  criteria: CreateCriterionDto[];
}
