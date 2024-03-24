import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  icon: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
