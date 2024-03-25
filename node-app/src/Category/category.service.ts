import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findByCategoryName(name: string): Promise<Category> {
    return this.categoryModel.findOne({ categoryName: name }).exec();
  }

  async create(challengeData: Partial<Category>): Promise<Category> {
    const createdChallenge = new this.categoryModel(challengeData);
    return createdChallenge.save();
  }
  
}
