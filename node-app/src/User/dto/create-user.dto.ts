import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { ObjectId } from 'mongoose';

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

  @IsNotEmpty()
  teamId: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  level?: number;
}
