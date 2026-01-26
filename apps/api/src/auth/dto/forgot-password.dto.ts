import { IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address of the account to reset password',
    example: 'john.doe@university.edu',
  })
  @IsEmail()
  email: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'If an account with that email exists, a password reset link has been sent.',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Reset token (only in development mode for testing)',
    example: 'abc123def456...',
  })
  resetToken?: string;
}
