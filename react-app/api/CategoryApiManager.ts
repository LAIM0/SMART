import ENDPOINTS from './apiUtils/endpoints';
import ApiMethods from './apiUtils/apiMethods';
import CategoryData from '../interfaces/categoryInterface';

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

  static async create(categoryName: string): Promise<void> {
    try {
      await ApiMethods.post(ENDPOINTS.CATEGORY.CATEGORY_CREATE(), {
        categoryName,
      });
    } catch (error) {
      throw new Error(`Erreur lors de la création de la catégorie: ${error}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await ApiMethods.delete(ENDPOINTS.CATEGORY.CATEGORY_DELETE(id));
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression de la catégorie: ${error}`
      );
    }
  }
}

export default CategoryApiManager;
