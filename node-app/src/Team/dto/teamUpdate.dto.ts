
import { IsNotEmpty, IsString } from 'class-validator';

export class TeamUpdateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  picturePath: string;

  @IsNotEmpty()
  @IsString()
  leaderId: string;
}
