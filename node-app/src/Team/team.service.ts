import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './team.schema';
import { Model, Types } from 'mongoose';
import { CreateTeamDto, TeamDto } from '../Team/dto/team.dto';
import { User } from 'src/User/user.schema';
import { TeamIdDto } from './dto/teamId.dto';
import { CompletedService } from 'src/Completed/completed.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    private completedService: CompletedService,
  ) {}

  async findAll(): Promise<TeamDto[]> {
    const teams = await this.teamModel.find().exec();
    return teams.map((team) => this.mapTeamToDto(team));
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

  async getUsers(
    teamIdDto: TeamIdDto,
  ): Promise<{ team: User[]; teamScore: number }> {
    // Récupère tous les utilisateurs de l'équipe
    const users = await this.userModel.find({ teamId: teamIdDto.teamId });

    // Calcule le score de chaque utilisateur par les challenges complétés
    const usersScoresPromises = users.map(async (user) => {
      const completedChallenges = await this.completedService.getUserCompleteds(
        user.id,
      );
      const totalScore = completedChallenges.reduce(
        (acc, current) => acc + current.challenge.points,
        0,
      );
      return { user: user.toObject(), score: totalScore };
    });

    // Attends la résolution de toutes les promesses pour obtenir les scores des utilisateurs
    const usersScores = await Promise.all(usersScoresPromises);

    // Calcule le score total de l'équipe en additionnant les scores de tous les utilisateurs
    const teamScore = usersScores.reduce(
      (acc, current) => acc + current.score,
      0,
    );
    const teamUsers = usersScores.map(({ user }) => user);

    return { team: teamUsers, teamScore };
  }

  // Other CRUD methods
}
