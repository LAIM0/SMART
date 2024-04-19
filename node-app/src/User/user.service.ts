import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { MailService } from '../mail/mail.service';
import { CompletedService } from 'src/Completed/completed.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { TeamService } from 'src/Team/team.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private completedService: CompletedService,
    private mailService: MailService,
    private teamService: TeamService,
  ) {}

  async createUser(
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    isAdmin: boolean,
    teamId: string,
  ): Promise<User> {
    console.log('createUser');
    const newUser = new this.userModel({
      email: email,
      passwordHash: password,
      lastName: lastName,
      firstName: firstName,
      isAdmin: isAdmin,
      teamId: teamId,
      firstLogin: true,
    });
    return newUser.save();
  }

  async getUser(email: string) {
    return this.userModel.findOne({ email });
  }
  async create(
    userName: string,
    password: string,
    lastName: string,
    firstName: string,
    isAdmin: boolean,
  ): Promise<User> {
    const existingUser = await this.userModel.findOne({ name: userName });
    if (existingUser) {
      return existingUser;
    }
    const newUser = new this.userModel({
      email: userName,
      passwordHash: password,
      lastName: lastName,
      firstName: firstName,
      isAdmin: isAdmin,
    });
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<User | null> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async getScore(UserId: Types.ObjectId): Promise<{ score: number }> {
    // Récupère les détails de l'utilisateur
    const user = await this.userModel.findById(UserId);
    if (!user) {
      throw new Error('User not found');
    }

    // Récupère les challenges complétés par l'utilisateur
    const completedChallenges =
      await this.completedService.getUserCompleteds(UserId);
    let totalScore = completedChallenges.reduce(
      (acc, current) =>
        acc + JSON.parse(JSON.stringify(current)).challenge.points,
      0,
    );

    // Ajoute le score total à l'objet utilisateur
    return { score: totalScore };
  }

  async generateResetPasswordToken(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
    await user.save();
    return resetToken;
  }

  async sendResetPasswordEmail(email: string, token: string) {
    await this.mailService.sendResetPasswordEmail(email, token); // Utilisez la méthode existante dans le service de courrier pour envoyer l'e-mail
  }

  // Methode pour mettre à jour le mot de passe de l'utilisateur en utilisant le token
  async resetPasswordWithToken(
    token: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      throw new Error('Token invalide ou expiré');
    }
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  async getRanking(): Promise<
    { user: User; score: number; teamName: string }[]
  > {
    const users = await this.userModel.find();
    if (!users || users.length === 0) {
      throw new Error('No users found');
    }

    const usersScoresPromises = users.map(async (user) => {
      const completedChallenges = await this.completedService.getUserCompleteds(
        user.id,
      );
      let team = { name: "Pas d'équipe" };
      if (user.teamId) {
        team = await this.teamService.getById(user.teamId);
      }

      let totalScore = completedChallenges.reduce(
        (acc, current) =>
          acc + JSON.parse(JSON.stringify(current)).challenge.points,
        0,
      );
      return { user: user.toObject(), score: totalScore, teamName: team.name };
    });

    // Utilisez Promise.all pour résoudre toutes les promesses de score d'utilisateur
    const usersScores = await Promise.all(usersScoresPromises);

    // Trie les utilisateurs par leur score en ordre décroissant
    usersScores.sort((a, b) => b.score - a.score);

    return usersScores;
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Vérifiez si l'utilisateur existe
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }
      // Supprimez l'utilisateur de la base de données
      await this.userModel.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateUserTeam(userId: string, teamId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.teamId = new Types.ObjectId(teamId); // Convertir l'ID de l'équipe en ObjectId
    await user.save();
  }

  async updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.isAdmin = isAdmin;
      await user.save();
    } catch (error) {
      throw error;
    }
  }

  async findDefaultAdmin(): Promise<User> {
    return await this.userModel.findOne({ email: 'admin@coexya.com' }).exec();
  }

  async createDefaultAdminIfNotExists(): Promise<void> {
    const defaultAdmin = await this.findDefaultAdmin();
    if (!defaultAdmin) {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash('root', saltOrRounds);
      const newUser = new this.userModel({
        email: 'admin@coexya.com',
        passwordHash: hashedPassword,
        lastName: 'Admin',
        firstName: 'Admin',
        isAdmin: true,
        teamId: '', // Remplissez avec l'ID de l'équipe appropriée si nécessaire
      });
      await newUser.save();
    }
  }
}
