import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name) private challengeModel: Model<ChallengeDocument>,
  ) {}

  async findAll(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }

  async create(challengeData: Partial<Challenge>): Promise<Challenge> {
    const createdChallenge = new this.challengeModel(challengeData);
    return createdChallenge.save();
  }
  
}
