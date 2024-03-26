import { Types } from 'mongoose';

export interface ChallengeInterface {
  category?: Types.ObjectId;
  title: string;
  points?: number;
  description?: string;
  pedagogicalExplanation?: string;
  photo?: string;
  endDate?: Date;
}
