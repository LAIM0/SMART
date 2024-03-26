import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCompletedDto {
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsNotEmpty()
  challengeId: Types.ObjectId;

  @IsNotEmpty()
  completionDate: Date;
}
