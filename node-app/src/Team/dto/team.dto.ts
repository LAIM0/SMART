// team.dto.ts
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  import { Types } from 'mongoose';
export class CreateTeamDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsOptional()
    picturePath?: string;
  }
  
  export class TeamDto {
    readonly id: string;
    readonly name: string;
    readonly picturePath: string;
  }
  