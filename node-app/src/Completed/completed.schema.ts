import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompletedDocument = Completed & Document;

@Schema()
export class Completed {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Challenge' })
  challengeId: Types.ObjectId;

  @Prop()
  completionDate: Date;
}

export const CompletedSchema = SchemaFactory.createForClass(Completed);
