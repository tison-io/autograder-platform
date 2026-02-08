import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateEnrollmentRequestDto {
  @ApiPropertyOptional({ description: 'Optional message from student' })
  @IsOptional()
  @IsString()
  message?: string;
}
