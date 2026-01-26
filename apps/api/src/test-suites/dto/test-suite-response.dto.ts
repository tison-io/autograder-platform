import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestFileResponseDto {
  @ApiProperty({ description: 'Test file ID' })
  id: string;

  @ApiProperty({ description: 'File name', example: 'users.test.ts' })
  fileName: string;

  @ApiProperty({ description: 'File path', example: 'tests/api/users.test.ts' })
  filePath: string;

  @ApiProperty({ description: 'File content' })
  content: string;

  @ApiProperty({ description: 'Whether file was generated from template' })
  isGenerated: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Linked criterion ID' })
  criterionId?: string;
}

class AssignmentInfoDto {
  @ApiProperty({ description: 'Assignment ID' })
  id: string;

  @ApiProperty({ description: 'Assignment title' })
  title: string;
}

export class TestSuiteResponseDto {
  @ApiProperty({ description: 'Test suite ID', example: 'clxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ description: 'Test suite name', example: 'Backend API Tests' })
  name: string;

  @ApiPropertyOptional({ description: 'Test suite description' })
  description?: string;

  @ApiProperty({ description: 'Whether this is a template-based suite' })
  isTemplate: boolean;

  @ApiPropertyOptional({ description: 'Template type', example: 'BACKEND_API' })
  templateType?: string;

  @ApiPropertyOptional({ description: 'Template parameters' })
  parameters?: Record<string, unknown>;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Assignment information', type: AssignmentInfoDto })
  assignment?: AssignmentInfoDto;

  @ApiPropertyOptional({ description: 'Test files', type: [TestFileResponseDto] })
  testFiles?: TestFileResponseDto[];

  @ApiPropertyOptional({ description: 'Number of test files', example: 5 })
  testFileCount?: number;
}
