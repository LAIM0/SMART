import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class TeamIdDto {
  @IsNotEmpty()
  teamId: Types.ObjectId;
}
