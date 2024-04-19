import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {

  @IsNotEmpty()
  id: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  categoryName: string;
}
