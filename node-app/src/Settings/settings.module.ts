import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SettingsSchema } from './settings.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Settings', schema: SettingsSchema }])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule { }
