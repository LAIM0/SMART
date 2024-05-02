import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './team.schema';
import { Model, Types } from 'mongoose';
import { ModifyTeamDto, CreateTeamDto, TeamDto } from '../Team/dto/team.dto';
import { User, UserDocument } from 'src/User/user.schema';
import { TeamIdDto } from './dto/teamId.dto';
import { CompletedService } from 'src/Completed/completed.service';
import { UserService } from 'src/User/user.service';
import { TeamUpdateDto } from './dto/teamUpdate.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private completedService: CompletedService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) { }

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
    const { _id, name, picturePath, leaderId } = team;
    return { id: _id.toString(), name, picturePath, leaderId };
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

  async getById(teamId: string): Promise<TeamDto> {
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

  async updateTeam(
    teamId: string,
    updateTeamDto: TeamUpdateDto,
  ): Promise<void> {
    const team = await this.teamModel.findById(teamId); // Utilisez votre modèle Mongoose pour trouver l'utilisateur par ID
    if (!team) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    // Mettez à jour les champs du profil avec les nouvelles valeurs du DTO
    team.name = updateTeamDto.name;
    team.picturePath = updateTeamDto.picturePath;
    team.leaderId = updateTeamDto.leaderId;

    // Enregistrez les modifications dans la base de données
    await team.save();
  }

  async delete(TeamId: Types.ObjectId): Promise<void> {
    const teamToDelete = await this.teamModel.findById(TeamId);

    if (!teamToDelete) {
      throw new Error("L'équipe spécifiée n'existe pas.");
    }

    if (teamToDelete.name === 'Équipe par défaut') {
      throw new Error("Vous n'êtes pas autorisé à supprimer cette entité.");
    }

    try {
      // Rechercher l'équipe par son nom "Équipe par défaut"
      const defaultTeam = await this.teamModel.findOne({ name: 'Équipe par défaut' });

      if (!defaultTeam) {
        throw new Error("L'équipe par défaut n'existe pas.");
      }

      // Récupérer les utilisateurs de l'équipe à supprimer
      const usersToUpdate = await this.userModel.find({ teamId: TeamId });

      // Réattribuer chaque utilisateur à l'équipe par défaut
      await Promise.all(usersToUpdate.map(async (user) => {
        user.teamId = defaultTeam._id; // Utilisation de l'ID de l'équipe par défaut
        await user.save();
      }));

      // Supprimer l'équipe
      await this.teamModel.deleteOne({ _id: TeamId });

      console.log('Données supprimées avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      throw error;
    }
  }

  async seedTeam(): Promise<void> {

    const existingTeam = await this.teamModel.findOne({ name: 'Équipe par défaut' });

    if (!existingTeam) {

      // Créer une instance par défaut
      const defaultTeam = new this.teamModel({ name: 'Équipe par défaut' });

      // Insérer dans la base de données
      await defaultTeam.save();
    }
  }

  async updateTeamPicture(teamId: string, data:{ picturePath: string}): Promise<Team> {
    const team = await this.teamModel.findById(teamId).exec();
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    team.picturePath = data.picturePath;
    return team.save();
  }

  async getUsersByTeamId(teamId: string): Promise<User[]> {
    return this.userModel.find({ teamId }).exec();
  }
}
