import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  passwordHash: string;

  @Prop()
  lastName?: string;

  @Prop()
  firstName?: string;

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId?: Types.ObjectId;

  @Prop()
  isAdmin?: boolean;

  @Prop()
  profilePicture?: string;

  @Prop()
  level?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
