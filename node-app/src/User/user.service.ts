import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CompletedWithChallenge } from './interfaces/challengeScore.interface';
import { Completed, CompletedDocument } from 'src/Completed/completed.schema';
import { CompletedService } from 'src/Completed/completed.service';
import { Challenge } from 'src/Challenge/challenge.schema';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private completedService: CompletedService,
  ) {}

  // async createUser(user: UserInterface): Promise<User> {
  //   const newUser = new this.userModel(user);
  //   return newUser.save();
  // }

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
      firstLogin:true,
    });
    return newUser.save();
  }

  async resetPassword(email: string, hashedPassword: string): Promise<void> {
    await this.userModel.updateOne({ email }, { passwordHash: hashedPassword });
  }

  async getUser(email: string) {
    const username = email.toLowerCase();
    const user = await this.userModel.findOne({ email });
    return user;
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

  async getScoreUserWithDetails(
    UserId: Types.ObjectId,
  ): Promise<{ user: User; score: number }> {
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
    return { user: user.toObject(), score: totalScore };
  }

  async getRanking(): Promise<{ user: User; score: number }[]> {
    const users = await this.userModel.find();
    if (!users || users.length === 0) {
      throw new Error('No users found');
    }

    const usersScoresPromises = users.map(async (user) => {
      const completedChallenges = await this.completedService.getUserCompleteds(
        user.id,
      );
      let totalScore = completedChallenges.reduce(
        (acc, current) =>
          acc + JSON.parse(JSON.stringify(current)).challenge.points,
        0,
      );
      return { user: user.toObject(), score: totalScore };
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
        throw new Error('L\'utilisateur n\'existe pas');
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

  // async uploadProfilePicture(userId: string, file: Express.Multer.File): Promise<void> {
  //   const user = await this.userModel.findById(userId).exec();
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   if (!file.originalname) {
  //     throw new Error('Originalname is not defined');
  //   }
  
  //   // Générer un nom de fichier unique en utilisant file.originalname
  //   const fileName = "${uuidv4()}-${file.originalname}";
  //   // Enregistrer l'image sur le système de fichiers
  //   const imagePath = path.join(__dirname, '..', 'uploads', fileName);
  //   console.log(imagePath);

  //   fs.writeFileSync(imagePath, file.buffer);

  //   // Mettre à jour le chemin de l'image dans la base de données
  //   user.profilePicturePath = imagePath;
  //   await user.save();
  // }

  async updateProfilePicture(userId: string, data: { profilePicturePath: string }): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    user.profilePicturePath = data.profilePicturePath;
    return user.save();
    
  }

  async updateUserProfile(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userModel.findById(userId); // Utilisez votre modèle Mongoose pour trouver l'utilisateur par ID
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  
    // Mettez à jour les champs du profil avec les nouvelles valeurs du DTO
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
  
    // Enregistrez les modifications dans la base de données
    await user.save();
  }
  
  
}

