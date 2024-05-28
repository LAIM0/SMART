import axios from 'axios';
import ENDPOINTS from './apiUtils/endpoints';
import ApiMethods from './apiUtils/apiMethods';
import CategoryData, {
  CategoryDataWithDate,
} from '../interfaces/categoryInterface';

const newCategory = {
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
        `Error retrieving categories "${id}" : ${error}`
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
        `Error retrieving categories: ${error}`
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
        `Error retrieving categories : ${error}`
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
      throw new Error(`Error retrieving categories: ${error}`);
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
      throw new Error(`Category creation error: ${error}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await axios.delete(`http://localhost:3001/categories/delete/${id}`);
    } catch (error) {
      throw new Error(
        `Error deleting category : ${error}`
      );
    }
  }

  static async getChallengeCount(categoryId: string): Promise<number> {
    try {
      const response = await ApiMethods.get(
        ENDPOINTS.CATEGORY.CATEGORY_COUNT(categoryId)
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(
        `Error retrieving categories : ${error}`
      );
    }
  }
}

export default CategoryApiManager;
