import axios from 'axios';
import ENDPOINTS from './apiUtils/endpoints';
import ApiMethods from './apiUtils/apiMethods';
import { SettingsData } from '../interfaces/settingsInterface';

class SettingsApiManager {
  static async getAll(): Promise<SettingsData[]> {
    try {
      const response = await ApiMethods.get(
        ENDPOINTS.SETTINGS.SETTINGS_GET_ALL()
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des settings: ${error}`);
    }
  }

  static async create(settingsData: SettingsData): Promise<void> {
    try {
      await ApiMethods.post(ENDPOINTS.SETTINGS.SETTINGS_CREATE(), settingsData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la catégorie: ${error}`);
    }
  }

  static async modify(settingsData: SettingsData): Promise<SettingsData> {
    try {
      const response = await ApiMethods.put(
        ENDPOINTS.SETTINGS.SETTINGS_MODIFY(),
        settingsData
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la catégorie: ${error}`);
    }
  }

  static async handleUploadProfilePicture(file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `http://localhost:3001/users/upload`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Upload successful:', response.data);
    } catch (error) {
      /* empty */
    }
  }
}

export default SettingsApiManager;
