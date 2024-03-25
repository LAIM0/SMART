import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChallengeDocument = Challenge & Document;

@Schema()
export class Challenge {
  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category?: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  points?: number;

  @Prop()
  description?: string;

  @Prop()
  pedagogicalExplanation?: string;

  @Prop()
  photo?: string;

  @Prop()
  endDate?: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
