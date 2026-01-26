import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@autograder/database';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 'clxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@university.edu' })
  email: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'User role', enum: UserRole, example: 'STUDENT' })
  role: UserRole;

  @ApiPropertyOptional({ description: 'GitHub username', example: 'johndoe', nullable: true })
  githubUsername: string | null;

  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: '/uploads/avatars/abc123.jpg',
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
