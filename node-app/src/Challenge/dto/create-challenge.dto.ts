import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateChallengeDto {
  @IsOptional()
  category?: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  pedagogicalExplanation?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsOptional()
  endDate?: Date;
}
