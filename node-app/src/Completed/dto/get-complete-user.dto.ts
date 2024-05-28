import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UserCheckDto {
  @IsNotEmpty()
  userId: Types.ObjectId;
}
