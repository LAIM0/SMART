import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CategoryInterface, ChallengeCountResponse } from './interfaces/category.interface';
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
        throw new Error("La catégorie à mettre à jour n'existe pas.");
      }

      Object.assign(categoryToUpdate, categoryData);

      return await categoryToUpdate.save();
    } catch (error) {
      throw new Error('Erreur lors de la modification de la catégorie : ' + error.message);
    }
  }

  async delete(CategoryId: Types.ObjectId): Promise<void> {
    const categoryToDelete = await this.categoryModel.findById(CategoryId);

    if (!categoryToDelete) {
      throw new Error("La catégorie spécifiée n'existe pas.");
    }

    if (categoryToDelete.categoryName === 'Autre') {
      throw new Error("Vous n'êtes pas autorisé à supprimer cette entité.");
    }

    try {
      // Rechercher la catégorie par son nom "Autre"
      const otherCategory = await this.categoryModel.findOne({ categoryName: 'Autre' });

      if (!otherCategory) {
        throw new Error("La catégorie 'Autre' n'existe pas.");
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

      console.log('Données supprimées avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      throw error;
    }
  }

  async countChallenge(CategoryId: Types.ObjectId): Promise<number> {
    try {
      const count = (await this.challengeModel.find({ category: CategoryId }).exec()).length
      return count;
    } catch (error) {
      throw new Error('Erreur lors du dénombrement de challenge dans la catégorie : ' + error.message);
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

