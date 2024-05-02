import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Settings } from './settings.schema';
import { CreateSettingsDto } from './dto/create-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get('/all')
  async findAll(): Promise<Settings[]> {
    return this.settingsService.findAll();
  }

  @Post('/create')
  async createSettings(@Body() settingsData: CreateSettingsDto) {
    return this.settingsService.create(settingsData);
  }

  @Put('/modify')
  async modifySettings(@Body() settingsData: CreateSettingsDto) {
    return this.settingsService.modify(settingsData);
  }
}
