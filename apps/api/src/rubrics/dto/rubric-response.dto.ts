export class CriterionResponseDto {
  id: string;
  title: string;
  maxPoints: number;
  weight: number;
  evaluationMethod: string;
  unitTestWeight: number;
  gptWeight: number;
  gptInstructions: string;
  filesToAnalyze: string[];
  levels: any;
  order: number;
}

export class RubricResponseDto {
  id: string;
  name: string;
  description?: string;
  totalPoints: number;
  passingGrade: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  criteria?: CriterionResponseDto[];
  assignment?: {
    id: string;
    title: string;
  };
}
