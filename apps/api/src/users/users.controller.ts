import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { UserRole } from '@autograder/database';
import { CurrentUser } from '../auth/decorators';
import { avatarUploadOptions } from '../common/config/upload.config';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', avatarUploadOptions))
  async uploadAvatar(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Construct the avatar URL (relative path for serving)
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    return this.usersService.updateAvatar(user.id, avatarUrl);
  }

  @Delete('avatar')
  async removeAvatar(@CurrentUser() user: any) {
    return this.usersService.removeAvatar(user.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
