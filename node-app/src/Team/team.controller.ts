import { Controller, Get } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.schema';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll(): Promise<Team[]> {
    return this.teamService.findAll();
  }

  
}
