import { Types } from 'mongoose';

export interface UserInterface {
  email: string;
  passwordHash: string;
  lastName: string;
  firstName: string;
  teamId?: Types.ObjectId;
  isAdmin: boolean;
  profilePicture?: string;
  level?: number;
}
