import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CategoryInterface } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) { }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findByCategoryName(name: string): Promise<Category> {
    return this.categoryModel.findOne({ categoryName: name }).exec();
  }

  async findByCategoryID(CategoryId: Types.ObjectId): Promise<Category> {
    return this.categoryModel.findById(CategoryId).exec();
  }

  async create(categoryData: CategoryInterface): Promise<Category> {
    const createdChallenge = new this.categoryModel(categoryData);
    return createdChallenge.save();
  }

  async delete(CategoryId: Types.ObjectId): Promise<void> {
    try {
      await this.categoryModel.deleteOne({ _id: CategoryId });
      console.log('Données supprimées avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      throw error;
    }
  }


  async seedCategories(): Promise<void> {

    const existingCategory = await this.categoryModel.findOne({ categoryName: 'Autre' });

    if (!existingCategory) {

      // Créer une instance par défaut
      const defaultCategory = new this.categoryModel({ categoryName: 'Autre' });

      // Insérer dans la base de données
      await defaultCategory.save();
    }
  }
}

