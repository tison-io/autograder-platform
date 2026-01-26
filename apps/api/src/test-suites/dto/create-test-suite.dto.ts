import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestTemplateType } from '@autograder/database';

export class CreateTestSuiteDto {
  @ApiProperty({
    description: 'Test suite name',
    example: 'Backend API Tests',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Test suite description',
    example: 'Tests for REST API endpoints',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID of the assignment this test suite belongs to',
    example: 'clxxxxxxxxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  assignmentId: string;

  @ApiPropertyOptional({
    description: 'Whether this is a template-based test suite',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean = false;

  @ApiPropertyOptional({
    description: 'Type of template if template-based',
    enum: TestTemplateType,
    example: 'BACKEND_API',
  })
  @IsEnum(TestTemplateType)
  @IsOptional()
  templateType?: TestTemplateType;

  @ApiPropertyOptional({
    description: 'Parameters for template-based test generation',
    example: { baseUrl: 'http://localhost:3000', endpoints: ['/api/users', '/api/courses'] },
  })
  @IsObject()
  @IsOptional()
  parameters?: Record<string, unknown>;
}
