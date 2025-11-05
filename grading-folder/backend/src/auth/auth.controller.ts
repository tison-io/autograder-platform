import { Controller, Post, Body, ValidationPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RequestPasswordResetDto } from '../user/dto/request-password-reset.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body(ValidationPipe) requestPasswordResetDto: RequestPasswordResetDto) {
    return await this.authService.requestPasswordReset(requestPasswordResetDto);
  }

  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}