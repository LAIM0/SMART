import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.schema';
import { Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ModifyCategoryDto } from './dto/modify-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('/all')
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('/byName/:categoryName')
  async findByCategoryName(@Param('categoryName') categoryName: string): Promise<Category> {
    return this.categoryService.findByCategoryName(categoryName);
  }

  @Get('/byId/:id')
  async findByCategoryID(@Param('id') CategoryId: Types.ObjectId): Promise<Category> {
    return this.categoryService.findByCategoryID(CategoryId);
  }

  @Post('/create')
  async createCategory(@Body() categoryData: CreateCategoryDto) {
    return this.categoryService.create(categoryData);
  }

  @Put('/modify/:id')
  async modifyCategory(@Param('id') CategoryId: Types.ObjectId, @Body() categoryData: ModifyCategoryDto) {
    return this.categoryService.modify(CategoryId, categoryData);
  }

  @Delete('delete/:id')
  async delete(@Param('id') CategoryId: Types.ObjectId): Promise<void> {
    return this.categoryService.delete(CategoryId);
  }
}
