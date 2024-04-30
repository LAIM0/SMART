import { IsOptional, IsString } from "class-validator";

export class TeamUpdateDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    picturePath?: string;
  
    @IsOptional()
    @IsString()
    leaderId?: string;
  }