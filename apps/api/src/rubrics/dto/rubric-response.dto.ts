import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriterionResponseDto {
  @ApiProperty({ description: 'Criterion ID' })
  id: string;

  @ApiProperty({ description: 'Criterion title', example: 'Code Quality' })
  title: string;

  @ApiProperty({ description: 'Maximum points', example: 20 })
  maxPoints: number;

  @ApiProperty({ description: 'Weight multiplier', example: 1.0 })
  weight: number;

  @ApiProperty({ description: 'Evaluation method', example: 'hybrid' })
  evaluationMethod: string;

  @ApiProperty({ description: 'Unit test weight', example: 0.5 })
  unitTestWeight: number;

  @ApiProperty({ description: 'GPT evaluation weight', example: 0.5 })
  gptWeight: number;

  @ApiProperty({ description: 'GPT evaluation instructions' })
  gptInstructions: string;

  @ApiProperty({ description: 'Files to analyze', type: [String] })
  filesToAnalyze: string[];

  @ApiProperty({ description: 'Achievement level descriptions' })
  levels: Record<string, string>;

  @ApiProperty({ description: 'Display order', example: 0 })
  order: number;
}

class AssignmentInfoDto {
  @ApiProperty({ description: 'Assignment ID' })
  id: string;

  @ApiProperty({ description: 'Assignment title' })
  title: string;
}

export class RubricResponseDto {
  @ApiProperty({ description: 'Rubric ID', example: 'clxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ description: 'Rubric name', example: 'Full-Stack Web Application Rubric' })
  name: string;

  @ApiPropertyOptional({ description: 'Rubric description' })
  description?: string;

  @ApiProperty({ description: 'Total points', example: 100 })
  totalPoints: number;

  @ApiProperty({ description: 'Passing grade', example: 60 })
  passingGrade: number;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, unknown>;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Grading criteria', type: [CriterionResponseDto] })
  criteria?: CriterionResponseDto[];

  @ApiPropertyOptional({ description: 'Linked assignment', type: AssignmentInfoDto })
  assignment?: AssignmentInfoDto;
}
