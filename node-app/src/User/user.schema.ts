import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId?: Types.ObjectId;

  @Prop({ required: true })
  isAdmin: boolean;

  @Prop()
  profilePicture?: string;

  @Prop({ default: 0 })
  level: number;

  @Prop({ default: true })
  firstLogin: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
