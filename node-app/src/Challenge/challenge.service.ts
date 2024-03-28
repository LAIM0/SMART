import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { Model, Types } from 'mongoose';
import { ChallengeInterface } from './interfaces/challenge.interface';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
  ) {}

  async findAll(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }

  async create(challenge: ChallengeInterface): Promise<Challenge> {
    const createdChallenge = new this.challengeModel(challenge);
    return createdChallenge.save();
  }

  async delete(id: number): Promise<void> {
    try {
      this.challengeModel.deleteOne({ _id: id });
      await this.challengeModel.deleteOne({ _id: id });

      console.log('Données supprimées avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      throw error;
    }
  }
  async getById(challengeId: Types.ObjectId): Promise<Challenge> {
    return this.challengeModel.findById(challengeId).exec();
  }
}
