import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentsDto {
  @ApiProperty({
    description: 'Array of student IDs to enroll',
    example: ['clxxx1', 'clxxx2', 'clxxx3'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  studentIds: string[];
}
