import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Completed, CompletedDocument } from './completed.schema';
import { Model, Types } from 'mongoose';
import { CompletedInterface } from './interfaces/completed.interface';
import { User } from 'src/User/user.schema';
import { ChallengeService } from 'src/Challenge/challenge.service';
import { Challenge } from 'src/Challenge/challenge.schema';

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

  async create(completed: CompletedInterface): Promise<Completed> {
    const createdCompleted = new this.completedModel(completed);
    return createdCompleted.save();
  }

  async getUserCompleteds(
    UserId: Types.ObjectId,
  ): Promise<{ completed: Completed; challenge: Challenge }[]> {
    const completeds = await this.completedModel.find({
      userId: UserId.toString(),
    });
    console.log(`Completed challenges found: ${completeds.length}`, completeds);

    if (completeds.length === 0) {
      return []; // Retourne un tableau vide si aucun challenge complété n'est trouvé
    }

    const completedsWithChallenges = await Promise.all(
      completeds.map(async (completedChall) => {
        const chall = await this.challengeService.getById(
          completedChall.challengeId,
        );
        return { completed: completedChall.toJSON(), challenge: chall };
      }),
    );

    return completedsWithChallenges;
  }

  async getCompletedByUserIdByChallengeId(
    userId: Types.ObjectId,
    challengeId: Types.ObjectId,
  ): Promise<CompletedInterface[]> {
    console.log('params', userId, challengeId);
    return this.completedModel
      .find({ userId: userId, challengeId: challengeId })
      .exec();
  }

  async delete(
    userId: Types.ObjectId,
    challengeId: Types.ObjectId,
  ): Promise<void> {
    await this.completedModel.deleteOne({
      userId: userId,
      challengeId: challengeId,
    });
  }

  async deleteChallengeOccurrences(challengeId: Types.ObjectId): Promise<void> {
    const completedToDelete = await this.completedModel
      .find({ challengeId: challengeId })
      .exec();
    completedToDelete.map(
      async (completed) =>
        await this.completedModel.deleteOne({ _id: completed.id }),
    );
  }
}
