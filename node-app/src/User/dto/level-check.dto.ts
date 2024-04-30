import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class LevelCheckDto {
  @IsNotEmpty()
  userId: Types.ObjectId;
}
