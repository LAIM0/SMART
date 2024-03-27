import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ScoreCheckDto {
  @IsNotEmpty()
  userId: Types.ObjectId;
}
