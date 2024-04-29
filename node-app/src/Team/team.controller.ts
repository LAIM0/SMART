import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.schema';
import { CreateTeamDto } from './dto/team.dto';
import { TeamDto } from './dto/team.dto';
import { Types } from 'mongoose';
import { TeamIdDto } from './dto/teamId.dto';

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

  @Post('default')
  async createDefaultTeam() {
    try {
      const defaultTeamDto: CreateTeamDto = {
        name: 'Equipe par défaut',
        // Autres détails de l'équipe par défaut
      };
      return this.teamService.create(defaultTeamDto);
    } catch (error) {
      throw new Error('Unable to create default team: ' + error.message);
    }
  }

  @Get('getUsers')
  async getUsers(@Query() teamIdDto: TeamIdDto) {
    try {
      return this.teamService.getUsers(teamIdDto);
    } catch (error) {
      throw new Error('Unable to get users of team: ' + error.message);
    }
  }

  @Get('ranking')
  async getRanking(): Promise<{ team: Team; score: number }[]> {
    try {
      return this.teamService.getRanking();
    } catch (error) {
      throw new Error('Unable to get users of team: ' + error.message);
    }
  }
  @Get('byId/:teamId')
  async findById(@Param('teamId') teamId: string): Promise<Team> {
    try {
      const team = await this.teamService.findById(teamId);
      return team;
    } catch (error) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
  }
}
