import ENDPOINTS from './apiUtils/endpoints';
import ApiMethods from './apiUtils/apiMethods';
import CategoryData from '../interfaces/categoryInterface';

class CategoryApiManager {
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
}

export default CategoryApiManager;
