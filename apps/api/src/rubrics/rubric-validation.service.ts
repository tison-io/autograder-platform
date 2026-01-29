import { Injectable, BadRequestException } from '@nestjs/common';

interface RubricJson {
  rubric: {
    name: string;
    description?: string;
    totalPoints: number;
    passingGrade: number;
    metadata?: Record<string, unknown>;
  };
  criteria: Array<{
    title: string;
    maxPoints: number;
    weight?: number;
    evaluationMethod: string;
    unitTestWeight?: number;
    gptWeight?: number;
    gptInstructions: string;
    filesToAnalyze?: string[];
    levels: Record<string, unknown>;
    order?: number;
  }>;
}

@Injectable()
export class RubricValidationService {
  validateRubricJson(json: Record<string, unknown>): RubricJson {
    // Check top-level structure
    if (!json.rubric || !json.criteria) {
      throw new BadRequestException(
        'Invalid rubric JSON: must have "rubric" and "criteria" properties',
      );
    }

    // Validate rubric object
    this.validateRubricFormat(json.rubric as Record<string, unknown>);

    // Validate criteria array
    this.validateCriteriaFormat(json.criteria as Record<string, unknown>[]);

    // Validate evaluation methods
    this.validateEvaluationMethods(json.criteria as Record<string, unknown>[]);

    // Validate point totals
    this.validatePointTotals(
      (json.rubric as { totalPoints: number }).totalPoints,
      json.criteria as Array<{ maxPoints: number }>,
    );

    return json as unknown as RubricJson;
  }

  private validateRubricFormat(rubric: Record<string, unknown>): void {
    if (!rubric.name || typeof rubric.name !== 'string') {
      throw new BadRequestException('Rubric must have a valid "name" string');
    }

    if (typeof rubric.totalPoints !== 'number' || rubric.totalPoints <= 0) {
      throw new BadRequestException('Rubric must have a valid "totalPoints" number greater than 0');
    }

    if (typeof rubric.passingGrade !== 'number' || rubric.passingGrade < 0) {
      throw new BadRequestException('Rubric must have a valid "passingGrade" number');
    }

    if (rubric.passingGrade > rubric.totalPoints) {
      throw new BadRequestException('Passing grade cannot exceed total points');
    }
  }

  private validateCriteriaFormat(criteria: Record<string, unknown>[]): void {
    if (!Array.isArray(criteria) || criteria.length === 0) {
      throw new BadRequestException('Criteria must be a non-empty array');
    }

    criteria.forEach((criterion, index) => {
      if (!criterion.title || typeof criterion.title !== 'string') {
        throw new BadRequestException(
          `Criterion at index ${index} must have a valid "title" string`,
        );
      }

      if (typeof criterion.maxPoints !== 'number' || criterion.maxPoints <= 0) {
        throw new BadRequestException(
          `Criterion "${criterion.title}" must have a valid "maxPoints" number greater than 0`,
        );
      }

      if (!criterion.evaluationMethod || typeof criterion.evaluationMethod !== 'string') {
        throw new BadRequestException(
          `Criterion "${criterion.title}" must have a valid "evaluationMethod" string`,
        );
      }

      if (!criterion.gptInstructions || typeof criterion.gptInstructions !== 'string') {
        throw new BadRequestException(
          `Criterion "${criterion.title}" must have "gptInstructions" string`,
        );
      }

      if (!criterion.levels || typeof criterion.levels !== 'object') {
        throw new BadRequestException(`Criterion "${criterion.title}" must have "levels" object`);
      }
    });
  }

  private validateEvaluationMethods(criteria: Record<string, unknown>[]): void {
    const validMethods = ['unit_test', 'gpt_semantic', 'hybrid'];

    criteria.forEach((criterion) => {
      const evalMethod = criterion.evaluationMethod as string;
      if (!validMethods.includes(evalMethod)) {
        throw new BadRequestException(
          `Criterion "${criterion.title}" has invalid evaluationMethod. Must be one of: ${validMethods.join(', ')}`,
        );
      }

      // Validate weights for hybrid method
      if (evalMethod === 'hybrid') {
        const unitTestWeight = (criterion.unitTestWeight as number) ?? 0;
        const gptWeight = (criterion.gptWeight as number) ?? 0;

        if (unitTestWeight + gptWeight !== 1.0) {
          throw new BadRequestException(
            `Criterion "${criterion.title}" has invalid weights. unitTestWeight + gptWeight must equal 1.0`,
          );
        }
      }
    });
  }

  private validatePointTotals(totalPoints: number, criteria: Array<{ maxPoints: number }>): void {
    const sumOfMaxPoints = criteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0);

    if (sumOfMaxPoints !== totalPoints) {
      throw new BadRequestException(
        `Sum of criteria maxPoints (${sumOfMaxPoints}) does not equal rubric totalPoints (${totalPoints})`,
      );
    }
  }
}
