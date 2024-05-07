import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
