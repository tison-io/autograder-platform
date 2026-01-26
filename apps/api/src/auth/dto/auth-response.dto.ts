import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@autograder/database';

export class AuthUserDto {
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
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Seconds until access token expires',
    example: 900,
  })
  expiresIn: number;

  @ApiProperty({ description: 'User information', type: AuthUserDto })
  user: AuthUserDto;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Seconds until access token expires',
    example: 900,
  })
  expiresIn: number;
}
