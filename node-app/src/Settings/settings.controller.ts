import { SettingsService } from './settings.service';
import { Settings } from './settings.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateSettingsDto } from './dto/create-settings.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';

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

  //@UseGuards(AdminAuthGuard)
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Le répertoire où les fichiers seront stockés
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          // Utilisation de la fonction de rappel pour générer un nom de fichier unique
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  async uploadProfilePicture(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Settings> {
    console.log(file);
    const user = req.user;
    console.log(user);
    return this.settingsService.updateProfilePicture({
      logoPath: file.filename,
    });
    //return of({imagepath: file.filename});
  }
}
