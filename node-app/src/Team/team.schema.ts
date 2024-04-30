import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  leader?: Types.ObjectId;

  @Prop({ default: "team_default.png-1714465892341-126362164" })
  picturePath:string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
