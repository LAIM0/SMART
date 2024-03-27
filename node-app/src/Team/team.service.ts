import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './team.schema';
import { Model } from 'mongoose';
import { CreateTeamDto, TeamDto } from '../Team/dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
  ) {}

  async findAll(): Promise<TeamDto[]> {
    const teams = await this.teamModel.find().exec();
    return teams.map(team => this.mapTeamToDto(team));
  }

  async create(createTeamDto: CreateTeamDto): Promise<TeamDto> {
    const createdTeam = new this.teamModel(createTeamDto);
    const savedTeam = await createdTeam.save();
    return this.mapTeamToDto(savedTeam);
  }

  private mapTeamToDto(team: TeamDocument): TeamDto {
    const { _id, name, icon } = team;
    return { id: _id.toString(), name, icon };
  }

  // Other CRUD methods
}
