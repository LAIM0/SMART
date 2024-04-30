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

  @Prop()
  teamId?: string;

  @Prop({ required: true,default: false })
  isAdmin: boolean;

  @Prop()
  profilePicture?: string;

  @Prop({ default: 0 })
  level: number;

  @Prop()
  firstLogin: boolean;

  @Prop()
  resetPasswordToken: String;

  @Prop()
  resetPasswordExpires: Date;

  @Prop({ default: "profile-picture-default.png-1713713349070-217063153" })
  profilePicturePath: string;

  @Prop({default: false})
  passWordInitialized: boolean;

  @Prop()
  isTeamAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
