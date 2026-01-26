import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestFileDto {
  @ApiProperty({
    description: 'Test file name',
    example: 'users.test.ts',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'Relative path in test structure',
    example: 'tests/api/users.test.ts',
  })
  @IsString()
  @IsNotEmpty()
  filePath: string;

  @ApiProperty({
    description: 'Test file content',
    example: "describe('Users API', () => { ... });",
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID of the test suite this file belongs to',
    example: 'clxxxxxxxxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  testSuiteId: string;

  @ApiPropertyOptional({
    description: 'ID of the criterion this test file is linked to',
    example: 'clxxxxxxxxxxxxxxxxxx',
  })
  @IsString()
  @IsOptional()
  criterionId?: string;

  @ApiPropertyOptional({
    description: 'Whether this file was generated from a template',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isGenerated?: boolean = false;
}

export class UpdateTestFileDto {
  @ApiPropertyOptional({
    description: 'Test file name',
    example: 'users.test.ts',
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({
    description: 'Relative path in test structure',
    example: 'tests/api/users.test.ts',
  })
  @IsString()
  @IsOptional()
  filePath?: string;

  @ApiPropertyOptional({
    description: 'Test file content',
    example: "describe('Users API', () => { ... });",
  })
  @IsString()
  @IsOptional()
  content?: string;
}
