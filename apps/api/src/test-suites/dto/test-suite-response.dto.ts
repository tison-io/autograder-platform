export class TestFileResponseDto {
  id: string;
  fileName: string;
  filePath: string;
  content: string;
  isGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  criterionId?: string;
}

export class TestSuiteResponseDto {
  id: string;
  name: string;
  description?: string;
  isTemplate: boolean;
  templateType?: string;
  parameters?: any;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  assignment?: {
    id: string;
    title: string;
  };

  testFiles?: TestFileResponseDto[];
  testFileCount?: number;
}
