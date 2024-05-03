import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Settings } from './settings.schema';
import { CreateSettingsDto } from './dto/create-settings.dto';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get('/all')
  @ApiOperation({ summary: 'Retrieve all settings', description: 'Fetches all settings entries from the database.' })
  @ApiResponse({ status: 200, description: 'All settings retrieved successfully', type: [Settings] })
  async findAll(): Promise<Settings[]> {
    return this.settingsService.findAll();
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create new settings', description: 'Creates a new settings entry in the database.' })
  @ApiBody({ type: CreateSettingsDto, description: 'Data for creating new settings' })
  @ApiResponse({ status: 201, description: 'Settings created successfully', type: Settings })
  @ApiResponse({ status: 400, description: 'Invalid data received' })
  async createSettings(@Body() settingsData: CreateSettingsDto): Promise<Settings> {
    return this.settingsService.create(settingsData);
  }

  @Put('/modify')
  @ApiOperation({ summary: 'Modify existing settings', description: 'Updates an existing settings entry in the database.' })
  @ApiBody({ type: CreateSettingsDto, description: 'Data for modifying existing settings' })
  @ApiResponse({ status: 200, description: 'Settings modified successfully', type: Settings })
  @ApiResponse({ status: 404, description: 'Settings not found' })
  @ApiResponse({ status: 400, description: 'Invalid data received for modification' })
  async modifySettings(@Body() settingsData: CreateSettingsDto): Promise<Settings> {
    return this.settingsService.modify(settingsData);
  }
}
