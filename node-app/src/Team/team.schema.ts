import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  icon: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  leader?: Types.ObjectId;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
