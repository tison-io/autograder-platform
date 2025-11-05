import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RequestPasswordResetDto } from '../user/dto/request-password-reset.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    
    if (registerUserDto.password !== registerUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    
    const user = await this.usersService.createUser(registerUserDto);


    const { password, ...result } = user;
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;


    const user = await this.usersService.validateUserCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    
    const payload = {
      sub: user._id,
      email: user.email,
    
    };

    const accessToken = this.jwtService.sign(payload);

    
    const { password: userPassword, ...userResult } = user.toObject();
    
    return {
      message: 'Login successful',
      user: userResult,
      accessToken,
    };
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    const { email } = requestPasswordResetDto;
    

    const resetToken = await this.usersService.generatePasswordResetToken(email);
    
    return {
      message: 'Password reset token generated successfully',
      resetToken, 
      expiresIn: '15 minutes',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetToken, newPassword, confirmPassword } = resetPasswordDto;


    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }


    await this.usersService.resetPassword(resetToken, newPassword);

    return {
      message: 'Password reset successfully. You can now login with your new password.',
    };
  }
}