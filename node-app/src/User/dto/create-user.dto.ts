import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  passwordHash: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  teamId?: Types.ObjectId;

  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  level: number;
}
