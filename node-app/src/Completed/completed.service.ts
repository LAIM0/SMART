import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Completed, CompletedDocument } from './completed.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompletedService {
  constructor(
    @InjectModel(Completed.name) private completedModel: Model<CompletedDocument>,
  ) {}

  async findAll(): Promise<Completed[]> {
    return this.completedModel.find().exec();
  }

  
}
