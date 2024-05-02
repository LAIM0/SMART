import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategorySchema } from './category.schema';
import { Challenge, ChallengeSchema } from 'src/Challenge/challenge.schema';


@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Category', schema: CategorySchema },
    { name: Challenge.name, schema: ChallengeSchema }
  ])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
