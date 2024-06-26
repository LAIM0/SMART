import { Types } from 'mongoose';
import { Periodicity } from 'utils/constants';

export interface ChallengeInterface {
  category?: string;
  title: string;
  points?: number;
  description?: string;
  pedagogicalExplanation?: string;
  photo?: string;
  endDate?: Date;
  periodicity?: Periodicity;
}

export interface ChallengeData {
  id?: Types.ObjectId;
  category?: string;
  title: string;
  points?: number;
  description?: string;
  pedagogicalExplanation?: string;
  photo?: string;
  endDate?: Date;
  periodicity?: Periodicity;
}

