import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsEnum, IsObject } from 'class-validator';
import { TestTemplateType } from '@autograder/database';

export class CreateTestSuiteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  assignmentId: string;

  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean = false;

  @IsEnum(TestTemplateType)
  @IsOptional()
  templateType?: TestTemplateType;

  @IsObject()
  @IsOptional()
  parameters?: any; // For template-based tests
}
