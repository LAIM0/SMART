import { IsNumber, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { Periodicity } from 'utils/constants';

export class CreateChallengeDto {
  @IsOptional()
  category?: string;

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
  periodicity?: Periodicity;
}
