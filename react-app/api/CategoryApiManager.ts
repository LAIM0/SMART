import axios from 'axios';
import ENDPOINTS from './apiUtils/endpoints';
import ApiMethods from './apiUtils/apiMethods';
import CategoryData, {
  CategoryDataWithDate,
} from '../interfaces/categoryInterface';

interface NewCategory {
  categoryName: string;
  creationDate: Date;
}

let newCategory = {
  categoryName: 'string',
  creationDate: new Date(),
};

class CategoryApiManager {
  static async get_by_id(id: string): Promise<CategoryData> {
    try {
      const response = await ApiMethods.get(
        ENDPOINTS.CATEGORY.CATEGORY_GET_BY_ID(id)
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de la categories "${id}" : ${error}`
      );
    }
  }

  static async getAll(): Promise<CategoryData[]> {
    try {
      const response = await ApiMethods.get(
        ENDPOINTS.CATEGORY.CATEGORY_GET_ALL()
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des categories: ${error}`
      );
    }
  }

  static async getAllWithDate(): Promise<CategoryDataWithDate[]> {
    try {
      const response = await ApiMethods.get(
        ENDPOINTS.CATEGORY.CATEGORY_GET_ALL()
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des categories: ${error}`
      );
    }
  }

  static async create(categoryData: CategoryData): Promise<void> {
    console.log(newCategory);
    newCategory.categoryName = categoryData.categoryName;
    newCategory.creationDate = new Date();
    try {
      await ApiMethods.post(ENDPOINTS.CATEGORY.CATEGORY_CREATE(), newCategory);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la catégorie: ${error}`);
    }
  }

  static async modify(categoryData: CategoryData): Promise<void> {
    const { id, ...dataWithoutId } = categoryData;
    try {
      await ApiMethods.put(
        ENDPOINTS.CATEGORY.CATEGORY_MODIFY(id),
        dataWithoutId
      );
    } catch (error) {
      throw new Error(`Erreur lors de la création de la catégorie: ${error}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await axios.delete(`http://localhost:3001/categories/delete/${id}`);
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression de la catégorie: ${error}`
      );
    }
  }
}

export default CategoryApiManager;
