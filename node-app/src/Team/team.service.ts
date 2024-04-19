import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './team.schema';
import { Model, Types } from 'mongoose';
import { CreateTeamDto, TeamDto } from '../Team/dto/team.dto';
import { User, UserDocument } from 'src/User/user.schema';
import { TeamIdDto } from './dto/teamId.dto';
import { CompletedService } from 'src/Completed/completed.service';
import { UserService } from 'src/User/user.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private completedService: CompletedService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
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
  async findById(teamId: string): Promise<Team | null> {
    try {
      const team = await this.teamModel.findById(teamId).exec();
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      return team;
    } catch (error) {
      throw new NotFoundException('Team not found');
    }
  }

  async getById(teamId: Types.ObjectId): Promise<TeamDto> {
    const team = await this.teamModel.findById(teamId);
    return this.mapTeamToDto(team);
  }

  async getRanking(): Promise<{ team: Team; score: number }[]> {
    const teams = await this.teamModel.find();
    if (!teams || teams.length === 0) {
      throw new Error('No teams found');
    }

    const teamsScoresPromises = teams.map(async (team) => {
      const users = await this.userModel.find({ teamId: team.id });
      let totalScore = 0;
      for (const user of users) {
        // Assurez-vous que la propriété 'score' existe avant de l'ajouter au score total
        if (user) {
          const scoring = await this.userService.getScore(user.id);
          totalScore += scoring.score;
        }
      }
      return { team: team.toObject(), score: totalScore };
    });

    // Utilisez Promise.all pour résoudre toutes les promesses de score d'utilisateur
    const teamsScores = await Promise.all(teamsScoresPromises);

    // Trie les utilisateurs par leur score en ordre décroissant
    teamsScores.sort((a, b) => b.score - a.score);

    return teamsScores;
  }

  // Other CRUD methods
}
