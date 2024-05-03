import { SettingsService } from './settings.service';
import { Settings } from './settings.schema';
import { CreateSettingsDto } from './dto/create-settings.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Response,
  Query,
  Res,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthenticatedGuard } from 'src/Auth/authenticated.guard';
import { LocalAuthGuard } from 'src/Auth/local.auth.guard';
import { AdminAuthGuard } from 'src/Auth/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { join } from 'path';
import { AdminTeamAuthGuard } from 'src/Auth/adminTeam';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { Category } from 'src/Category/category.schema';
import { Types } from 'mongoose';

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

  // @UseGuards(AdminAuthGuard)
  // @Post('/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads', // Le répertoire où les fichiers seront stockés
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         // Utilisation de la fonction de rappel pour générer un nom de fichier unique
  //         cb(null, file.originalname + '-' + uniqueSuffix);
  //       },
  //     }),
  //   }),
  // )
}
