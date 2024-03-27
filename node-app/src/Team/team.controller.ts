import { Controller, Get, Post, Body } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.schema';
import { CreateTeamDto } from './dto/team.dto';
import { TeamDto } from './dto/team.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll(): Promise<TeamDto[]> {
    return this.teamService.findAll();
  }

  
  @Post()
  async create(@Body() createTeamDto: CreateTeamDto): Promise<TeamDto> {
    return this.teamService.create(createTeamDto);
  } 

  
}
