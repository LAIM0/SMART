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
    icon?: string;
  }
  
  export class TeamDto {
    readonly id: string;
    readonly name: string;
    readonly icon: string;
  }
  