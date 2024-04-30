import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  isNotEmpty,
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

  @IsBoolean()
  @IsNotEmpty()
  passwordInitialized: boolean;

  @IsBoolean()
  @IsNotEmpty()
  firstLogin: boolean;
}
