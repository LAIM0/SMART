import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ unique: true })
  name: string;

  @Prop({default:''})
  leaderId?: string 

  @Prop({ default: "team-picture-default.png" })
  picturePath:string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
