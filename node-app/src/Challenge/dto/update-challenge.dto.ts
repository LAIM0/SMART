import { IsNumber, IsNotEmpty, IsOptional, IsString, IsEnum, IsDefined } from 'class-validator';
import { Types } from 'mongoose';
import { Periodicity } from 'utils/constants';

export class UpdateChallengeDto {
  @IsOptional()
  id?: Types.ObjectId;

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

  @IsEnum(Periodicity)
  @IsOptional()
  periodicity?: Periodicity; // Ajout de la propriété periodicity avec le type Periodicity
}
