import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  @IsNotEmpty()
  color1: string;

  @IsString()
  @IsNotEmpty()
  color2: string;

  @IsString()
  @IsNotEmpty()
  logo: string;
}
