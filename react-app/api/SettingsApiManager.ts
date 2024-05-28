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
      throw new Error(`Error retrieving settings: ${error}`);
    }
  }

  static async create(settingsData: SettingsData): Promise<void> {
    try {
      await ApiMethods.post(ENDPOINTS.SETTINGS.SETTINGS_CREATE(), settingsData);
    } catch (error) {
      throw new Error(`Category creation error: ${error}`);
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
      throw new Error(`Category creation error: ${error}`);
    }
  }
}

export default SettingsApiManager;
