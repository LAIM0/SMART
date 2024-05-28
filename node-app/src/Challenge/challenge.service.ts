import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { Model, Types } from 'mongoose';
import { ChallengeData, ChallengeInterface } from './interfaces/challenge.interface';
import { Periodicity } from 'utils/constants';
import * as moment from 'moment';


@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
  ) {}

  async findAll(): Promise<Challenge[]> {
    return this.challengeModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(challenge: ChallengeInterface): Promise<Challenge> {
    const createdChallenge = new this.challengeModel(challenge);
    return createdChallenge.save();
  }

  async update(updatedChallenge: ChallengeData): Promise<Challenge | null> {
  try {
    const existingChallenge = await this.challengeModel.findById(updatedChallenge.id);
    if (!existingChallenge) {
      return null;
    }
    existingChallenge.set(updatedChallenge);
    const updatedChallengeDoc = await existingChallenge.save();
    return updatedChallengeDoc;
  } catch (error) {
    console.error("Error updating challenge:", error);
    throw error; 
  }
}

  async delete(id: Types.ObjectId): Promise<void> {
    try {
      this.challengeModel.deleteOne({ _id: id });
      await this.challengeModel.deleteOne({ _id: id });
      console.log('Data successfully deleted');
    } catch (error) {
      console.error('Error deleting data :', error);
      throw error;
    }
  }

  
  
  async getById(challengeId: Types.ObjectId): Promise<Challenge> {
    return this.challengeModel.findById(challengeId).exec();
  }

  async updateDailyChallenges(){
    //update des challenges quotidiens
    const dailyChallenges = await this.challengeModel.find({
      endDate: { $gte: moment(new Date()).add(-1, 'day').toDate(), $lte: new Date() },
      periodicity: Periodicity.DAILY
    }).exec();
    console.log(dailyChallenges);

    dailyChallenges.forEach(async challenge => {
      const newEndDate = moment(challenge.endDate).add(1, 'day').toDate();

      const newChallengeData = { ...challenge.toObject(), endDate: newEndDate };
      delete newChallengeData._id; // Supprimer l'ID pour éviter les doublons dans la base de données

      const newChallenge = await this.create(newChallengeData);
      console.log('New challenge created :', newChallenge);
    });
  }

  async updateWeeklyChallenges(){
    //update des challenges hebdomadaires
    const weeklyChallenges = await this.challengeModel.find({
      endDate: { $gte: moment(new Date()).add(-1, 'week').toDate(), $lte: new Date() },
      periodicity: Periodicity.WEEKLY
    }).exec();
    console.log(weeklyChallenges);

    weeklyChallenges.forEach(async challenge => {
      const newEndDate = moment(challenge.endDate).add(1, 'week').toDate();

      const newChallengeData = { ...challenge.toObject(), endDate: newEndDate };
      delete newChallengeData._id; // Supprimer l'ID pour éviter les doublons dans la base de données

      const newChallenge = await this.create(newChallengeData);
      console.log('New challenge created :', newChallenge);
    });
  }

  async updateMonthlyChallenges(){
    //update des challenges mensuels
    const monthlyChallenges = await this.challengeModel.find({
      endDate: { $gte: moment(new Date()).add(-1, 'month').toDate(), $lte: new Date() },
      periodicity: Periodicity.WEEKLY
    }).exec();
    console.log(monthlyChallenges);

    monthlyChallenges.forEach(async challenge => {
      const newEndDate = moment(challenge.endDate).add(1, 'month').toDate();

      const newChallengeData = { ...challenge.toObject(), endDate: newEndDate };
      delete newChallengeData._id; // Supprimer l'ID pour éviter les doublons dans la base de données

      const newChallenge = await this.create(newChallengeData);
      console.log('New challenge created :', newChallenge);
    });
  }
}

