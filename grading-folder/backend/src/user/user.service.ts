import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { fullname, email, password } = registerUserDto;

    
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    const newUser = new this.userModel({
      fullname,
      email,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  async validateUserCredentials(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);


    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');


    await this.userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: resetExpires,
    });


    return resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    
    const user = await this.userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }


    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }
}