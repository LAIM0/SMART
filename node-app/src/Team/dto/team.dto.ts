import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  picturePath?: string;

  @IsOptional()
  leaderId?: string;
}

export class ModifyTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
    picturePath?: string;

  @IsOptional()
  leaderId?: string;
}


export class TeamDto {
  readonly id: string;
  readonly name: string;
  readonly picturePath: string;
  readonly leaderId: string;
}
    