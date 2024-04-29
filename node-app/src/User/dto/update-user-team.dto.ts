// update-user.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserTeamDto {
  @IsNotEmpty()
  @IsString()
  teamId: string;
}
