import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Completed, CompletedDocument } from './completed.schema';
import { Model } from 'mongoose';
import { CompletedInterface } from './interfaces/completed.interface';
import { User } from 'src/User/user.schema';

@Injectable()
export class CompletedService {
  constructor(
    @InjectModel(Completed.name)
    private completedModel: Model<CompletedDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
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
          $set: { lastName: 'callRéussi' },
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
}
