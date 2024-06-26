import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';
import { SettingsInterface } from './interfaces/settings.interface';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) { }

  async findAll(): Promise<Settings[]> {
    return this.settingsModel.find().exec();
  }

  async create(settingsData: SettingsInterface): Promise<Settings> {
    const createdSettings = new this.settingsModel(settingsData);
    return createdSettings.save();
  }

  async modify(settingsData: SettingsInterface): Promise<Settings> {

    try {
      const settings = await this.settingsModel.find().exec();
      console.log(settings);
      const settingsToUpdate = settings[0];
      if (!settingsToUpdate) {
        throw new Error("The setting to be updated does not exist");
      }

      Object.assign(settingsToUpdate, settingsData);

      return await settingsToUpdate.save();
    } catch (error) {
      throw new Error('Error modifying settings : ' + error.message);
    }
  }

  async seedSettings(): Promise<void> {

    const existingSettings = await this.settingsModel.find().exec();
    if (existingSettings.length === 0) {
      // Créer une instance par défaut
      const defaultSettings = new this.settingsModel({ color1: '#166879' , color2: '#4FD1C5', logo:'logo-company-default.png'});
      // Insérer dans la base de données
      await defaultSettings.save(); 
    }
  }

  async updateProfilePicture(
    data: { logoPath: string },
  ): Promise<Settings> {
    const settings = await this.settingsModel.find().exec();
      console.log(settings);
      const settingsToUpdate = settings[0];
      if (!settingsToUpdate) {
        throw new Error("The setting to be updated does not exist.");
      }
    settingsToUpdate.logo = data.logoPath;
    return settingsToUpdate.save();
  }
}

