import { IsString, IsOptional, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchRecipeDto {
  @IsString()
  query!: string;

  @IsOptional()
  @IsString()
  diet?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(180)
  maxReadyTime?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  number?: number;

  @IsOptional()
  @IsString()
  intolerances?: string;

   @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  addRecipeInformation?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  fillIngredients?: boolean;
}
