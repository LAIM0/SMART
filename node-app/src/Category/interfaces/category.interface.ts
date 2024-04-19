import { Types } from 'mongoose';

export interface CategoryInterface {
  id: Types.ObjectId;
  categoryName: string;
}