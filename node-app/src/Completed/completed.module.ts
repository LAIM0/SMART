import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompletedService } from './completed.service';
import { CompletedController } from './completed.controller';
import { CompletedSchema } from './completed.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Completed', schema: CompletedSchema }])],
  controllers: [CompletedController],
  providers: [CompletedService],
})
export class CompletedModule {}
