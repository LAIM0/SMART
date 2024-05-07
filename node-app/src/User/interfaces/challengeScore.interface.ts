import { Document, Types } from 'mongoose';

// Assurez-vous que cette interface reflète la structure réelle de votre document Challenge
interface ChallengeScore {
  _id: Types.ObjectId;
  points: number;
}

// Cette interface représente la structure de vos documents Completed après population
export interface CompletedWithChallenge extends Document {
  userId: Types.ObjectId;
  challengeId: ChallengeScore;
  completionDate: Date;
}
