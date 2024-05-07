import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CategoryInterface } from './interfaces/category.interface';
import { Challenge, ChallengeDocument } from 'src/Challenge/challenge.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Challenge.name) private challengeModel: Model<ChallengeDocument>,
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
    const createdCategory = new this.categoryModel(categoryData);
    return createdCategory.save();
  }

  async modify(CategoryId: Types.ObjectId, categoryData: CategoryInterface): Promise<Category> {

    try {
      const categoryToUpdate = await this.categoryModel.findById(CategoryId);

      if (!categoryToUpdate) {
        throw new Error("The category to be updated does not exist.");
      }

      Object.assign(categoryToUpdate, categoryData);

      return await categoryToUpdate.save();
    } catch (error) {
      throw new Error('Error modifying category : ' + error.message);
    }
  }

  async delete(CategoryId: Types.ObjectId): Promise<void> {
    const categoryToDelete = await this.categoryModel.findById(CategoryId);

    if (!categoryToDelete) {
      throw new Error("The specified category does not exist.");
    }

    if (categoryToDelete.categoryName === 'Autre') {
      throw new Error("You are not authorized to delete this entity.");
    }

    try {
      const otherCategory = await this.categoryModel.findOne({ categoryName: 'Autre' });

      if (!otherCategory) {
        throw new Error("The 'Autre' category does not exist.");
      }

      // Récupérer les défis de la catégorie à supprimer
      const challengesToUpdate = await this.challengeModel.find({ category: CategoryId });

      // Réattribuer chaque défi à la catégorie "Autre"
      await Promise.all(challengesToUpdate.map(async (challenge) => {
        challenge.category = otherCategory._id; // Utilisation de l'ID de la catégorie "Autre"
        await challenge.save();
      }));

      // Supprimer la catégorie
      await this.categoryModel.deleteOne({ _id: CategoryId });

      console.log('Data successfully deleted');
    } catch (error) {
      console.error('Error deleting data :', error);
      throw error;
    }
  }

  async countChallenge(CategoryId: Types.ObjectId): Promise<number> {
    try {
      const count = (await this.challengeModel.find({ category: CategoryId }).exec()).length
      return count;
    } catch (error) {
      throw new Error('Error when counting challenges in the category : ' + error.message);
    }
  }


  async seedCategories(): Promise<void> {

    const existingCategory = await this.categoryModel.findOne({ categoryName: 'Autre' });

    if (!existingCategory) {

      // Créer une instance par défaut
      const defaultCategory = new this.categoryModel({ categoryName: 'Autre', creationDate: new Date });

      // Insérer dans la base de données
      await defaultCategory.save();
    }
  }
}

