import { Types } from 'mongoose';

export interface CompletedInterface {
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;
  completionDate: Date;
}
