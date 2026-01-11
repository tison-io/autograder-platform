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
import { Type } from 'class-transformer';

export class CreateCriterionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Min(1)
  maxPoints: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number = 1.0;

  @IsString()
  @IsNotEmpty()
  evaluationMethod: string; // "unit_test", "gpt_semantic", "hybrid"

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitTestWeight?: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  gptWeight?: number = 1.0;

  @IsString()
  @IsNotEmpty()
  gptInstructions: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  filesToAnalyze?: string[] = [];

  @IsObject()
  @IsNotEmpty()
  levels: any; // { excellent: string, good: string, fair: string, poor: string }

  @IsInt()
  @IsOptional()
  order?: number = 0;
}

export class CreateRubricDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  totalPoints: number;

  @IsInt()
  @Min(0)
  passingGrade: number;

  @IsObject()
  @IsOptional()
  metadata?: any; // Tech stack, folder structure, etc.
}

export class CreateRubricWithCriteriaDto {
  @ValidateNested()
  @Type(() => CreateRubricDto)
  rubric: CreateRubricDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCriterionDto)
  criteria: CreateCriterionDto[];
}
