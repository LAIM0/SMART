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

  async getById(challengeId: Types.ObjectId): Promise<Challenge> {
    return this.challengeModel.findById(challengeId).exec();
  }
}
