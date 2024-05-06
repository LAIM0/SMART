import {
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
import { UpdateUserDto } from './dto/update-user.dto';
import { Category, CategoryDocument } from 'src/Category/category.schema';
import { CategoryService } from 'src/Category/category.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private completedService: CompletedService,
    private mailService: MailService,
    private teamService: TeamService,
    private categoryService: CategoryService,
  ) {}

  async createUser(
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    isAdmin: boolean,
    teamId: string,
    firstLogin: boolean,
    passWordInitialized: boolean
  ): Promise<User> {
    console.log('createUser');
    const newUser = new this.userModel({
      email: email,
      passwordHash: password,
      lastName: lastName,
      firstName: firstName,
      isAdmin: isAdmin,
      teamId: teamId,
      firstLogin: firstLogin,
      passWordInitialized: passWordInitialized,
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
    const existingUser = await this.userModel.findOne({ email: userName });
    if (existingUser) {
      return existingUser;
    }
    const defaultProfilePicture =
      '/profile-picture-default.png-1713451127942-613847853';
    const newUser = new this.userModel({
      email: userName,
      passwordHash: password,
      lastName: lastName,
      firstName: firstName,
      isAdmin: isAdmin,
      profilePicturePath: defaultProfilePicture, // Valeur par défaut pour profilePicturePath
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
    // Trouve l'utilisateur par son ID dans la base de données
    const user = await this.userModel.findById(UserId);
    if (!user) {
      throw new Error('User not found');
    }

    // Récupère tous les défis complétés par l'utilisateur
    const completedChallenges =
      await this.completedService.getUserCompleteds(UserId);
    let totalScore = 0;

    // Calcule le score total en additionnant les points de chaque défi complété
    for (const completedChallenge of completedChallenges) {
      totalScore += completedChallenge.challenge.points;
    }

    // Affiche dans les logs l'ID de l'utilisateur et le score total calculé
    console.log(`User ID: ${UserId} - Total score calculated: ${totalScore}`);
    return { score: totalScore };
  }

  async updateAllLevels(): Promise<{ success: boolean; error?: string }> {
    try {
      // Récupère tous les utilisateurs enregistrés dans la base de données
      const users = await this.userModel.find().exec();

      // Boucle sur chaque utilisateur pour mettre à jour son niveau
      for (const user of users) {
        const { score } = await this.getScore(user._id);

        // Calcule le niveau en utilisant une formule logarithmique basée sur le score
        const niveau = Math.log(score + 1) / Math.log(10);
        await this.userModel.findByIdAndUpdate(user._id, {
          level: Math.floor(niveau),
        });

        // Affiche dans les logs l'ID de l'utilisateur, son score, et son niveau avant arrondi
        console.log(
          `User ${user._id} updated. Score: ${score}, Level (before rounding): ${niveau}`,
        );
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating user levels:', error);
      return { success: false, error: error.message };
    }
  }

  async getLevel(
    userId: Types.ObjectId,
  ): Promise<{ success: boolean; level?: number; error?: string }> {
    try {
      // Récupère le score de l'utilisateur spécifié
      const { score } = await this.getScore(userId);

      // Calcule le niveau en utilisant une formule logarithmique basée sur le score, sans arrondir
      const niveau = Math.log(score + 1) / Math.log(10);

      // Affiche dans les logs l'ID de l'utilisateur et son niveau calculé
      console.log(`User ${userId} level calculated: ${niveau}`);

      // Retourne le succès avec le niveau calculé
      return { success: true, level: niveau };
    } catch (error) {
      // Log l'erreur si la récupération du score ou le calcul échoue
      console.error(`Error calculating level for user ${userId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async generateUserToken(email: string): Promise<string> {
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
    await this.mailService.sendResetPasswordEmail(email, token);
  }

  async sendvalidationEmail(email: string, token: string) {
    await this.mailService.sendValidationEmail(email, token);
  }

  async sendInitializePasswordEmail(email: string, token: string) {
    await this.mailService.sendInitializePassword(email, token);
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
    user.passWordInitialized = true;
    await user.save();
  }

  async updateFirstLoginStatusWithToken(token: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    console.log(user);
    if (!user) {
      throw new Error('Token invalide ou expiré');
    }
    user.firstLogin = false;
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
        team = await this.teamService.findById(user.teamId);
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
    user.teamId = teamId; // Affectez directement teamId sans le convertir en ObjectId
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
    return await this.userModel
      .findOne({ email: process.env.DEFAULT_ADMIN_USERNAME })
      .exec();
  }

  async createDefaultAdminIfNotExists(): Promise<void> {
    const defaultAdmin = await this.findDefaultAdmin();
    if (!defaultAdmin) {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        process.env.DEFAULT_ADMIN_PASSWORD,
        saltOrRounds,
      );
      const newUser = new this.userModel({
        email: process.env.DEFAULT_ADMIN_USERNAME,
        passwordHash: hashedPassword,
        lastName: 'Admin',
        firstName: 'Admin',
        isAdmin: true,
        teamId: '',
        firstLogin: false,
        passWordInitialized: true,
      });
      await newUser.save();
    }
  }

  async updateProfilePicture(
    userId: string,
    data: { profilePicturePath: string },
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profilePicturePath = data.profilePicturePath;
    return user.save();
  }

  async updateUserProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const user = await this.userModel.findById(userId); // Utilisez votre modèle Mongoose pour trouver l'utilisateur par ID
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Mettez à jour les champs du profil avec les nouvelles valeurs du DTO
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.teamId = updateUserDto.teamId;

    // Enregistrez les modifications dans la base de données
    await user.save();
  }

  async updateFirstLoginStatus(userId: string): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.firstLogin = false; // Mettez à jour la propriété firstLogin à false
      await user.save();
    } catch (error) {
      throw new Error('Failed to update first login status');
    }
  }

  async getScoreByCategory(
    userId: Types.ObjectId,
  ): Promise<{ category: Category; score: number }[]> {
    let categories: Category[] = await this.categoryService.findAll();

    const scoresByCategory = {};

    categories.forEach((cat) => {
      scoresByCategory[cat.id] = { category: cat, score: 0 };
      console.log('categorie id :', cat.id);
    });

    // Récupère les challenges complétés par l'utilisateur
    const completedChallenges =
      await this.completedService.getUserCompleteds(userId);

    // Parcourir chaque challenge complété et accumuler les points par catégorie
    completedChallenges.forEach((completed) => {
      const categoryId = completed.challenge.category.toString();
      if (scoresByCategory[categoryId]) {
        scoresByCategory[categoryId].score += completed.challenge.points;
      }
    });
    return Object.values(scoresByCategory);

    // Filtrez les catégories avec un score de 0 si nécessaire
    // const nonZeroScores = scoresByCategory.filter(sc => sc.score > 0);
  }

  async findByTeamId(teamId: string): Promise<User[]> {
    try {
      const users = await this.userModel
        .find({ teamId: teamId })
        .select('id firstName lastName')
        .exec();
      return users;
    } catch (error) {
      throw new Error(
        `Error finding users for team ID ${teamId}: ${error.message}`,
      );
    }
  }
}
