import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsNotEmpty, Matches } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'GitHub repository URL (must be a valid public GitHub repo)',
    example: 'https://github.com/username/project-repo',
  })
  @IsString()
  @IsNotEmpty({ message: 'GitHub repository URL is required' })
  @IsUrl({}, { message: 'Must be a valid URL' })
  @Matches(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/, {
    message: 'Must be a valid GitHub repository URL (e.g., https://github.com/username/repo)',
  })
  githubRepoUrl: string;

  @ApiProperty({
    description: 'Assignment ID to submit for',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty({ message: 'Assignment ID is required' })
  assignmentId: string;
}
