import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { UserInterface } from './interfaces/user.interface';
import { CompletedWithChallenge } from './interfaces/challengeScore.interface';
import { Challenge } from 'src/Challenge/challenge.schema';
import { Completed, CompletedDocument } from 'src/Completed/completed.schema';
import { CompletedService } from 'src/Completed/completed.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Completed.name)
    private completedService: CompletedService,
  ) {}

  async createUser(user: UserInterface): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
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

  // Ajoutez d'autres méthodes selon les besoins, par exemple pour chercher, mettre à jour ou supprimer des utilisateurs

  async getDefisCompletedUser(userId: Types.ObjectId) {
    const userWithChallenges = await this.userModel
      .findById(userId)
      .populate({
        path: 'challengesCompleted',
        model: 'Completed',
        populate: {
          path: 'challengeId',
          model: 'Challenge',
        },
      })
      .exec();

    if (!userWithChallenges) {
      throw new Error('User not found');
    }
    return userWithChallenges.challengesCompleted;
  }

  async getScoreUser(UserId: Types.ObjectId): Promise<Completed[]> {
    const test = await this.completedService.findAll();
    // const test = await this.completedService.getUserCompleteds(UserId);
    return test;

    // let totalScore = 0;
    // challengesCompleted.forEach((completed) => {
    //   totalScore += completed.challengeId!.points;
  }
}
