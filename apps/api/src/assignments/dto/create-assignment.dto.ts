import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxSubmissions?: number = 5;

  @IsBoolean()
  @IsOptional()
  allowLateSubmissions?: boolean = false;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  rubricId: string; // Must link to existing rubric
}
