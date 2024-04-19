import { IsNotEmpty, IsString } from 'class-validator';

export class ModifyCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;
}
