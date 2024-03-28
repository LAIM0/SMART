import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Completed, CompletedDocument } from './completed.schema';
import { Model, Types } from 'mongoose';
import { CompletedInterface } from './interfaces/completed.interface';
import { User } from 'src/User/user.schema';
import { ChallengeService } from 'src/Challenge/challenge.service';

@Injectable()
export class CompletedService {
  constructor(
    @InjectModel(Completed.name)
    private completedModel: Model<CompletedDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    private challengeService: ChallengeService,
  ) {}

  async findAll(): Promise<Completed[]> {
    return this.completedModel.find().exec();
  }

  async create(completed: CompletedInterface): Promise<User> {
    const createdCompleted = new this.completedModel(completed);
    await createdCompleted.save();

    // Association avec l'utilisateur
    // modifié
    try {
      const updatedResult = await this.userModel.findByIdAndUpdate(
        completed.userId,
        {
          $push: { challengesCompleted: completed },
        },
        { new: true, safe: true, upsert: true },
      );
      console.log(updatedResult);
    } catch (error) {
      console.log(error);

      return this.userModel.findById(completed.userId).exec();
    }
  }
  async getUserCompleteds(UserId: Types.ObjectId): Promise<Completed[]> {
    const completeds = await this.completedModel.find({ userId: UserId });
    console.log(completeds);
    const completedsWithChallenges = await Promise.all(
      completeds.map(async (completed) => {
        const challenge = await this.challengeService.getById(
          completed.challengeId,
        );
        return { ...completed.toObject(), challenge };
      }),
    );

    return completedsWithChallenges;
  }
}
