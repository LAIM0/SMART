import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.schema';


@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all')
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('/byName/:categoryName')
  async findByCategoryName(@Param('categoryName') categoryName: string): Promise<Category> {
    return this.categoryService.findByCategoryName(categoryName);
  }

  @Post('/create') // Décorateur @Post() pour l'endpoint /challenges/create
  async createCategory(@Body() challengeData: Partial<Category>) {
    return this.categoryService.create(challengeData);
  }
}
