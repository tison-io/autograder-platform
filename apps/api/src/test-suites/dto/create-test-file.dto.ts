import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateTestFileDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string; // Relative path in test structure

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  testSuiteId: string;

  @IsString()
  @IsOptional()
  criterionId?: string;

  @IsBoolean()
  @IsOptional()
  isGenerated?: boolean = false;
}

export class UpdateTestFileDto {
  @IsString()
  @IsOptional()
  fileName?: string;

  @IsString()
  @IsOptional()
  filePath?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
