import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  @IsNotEmpty()
  color1: string;

  @IsNotEmpty()
  color2: string;
}
