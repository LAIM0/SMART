import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from './category.schema';
import { Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ModifyCategoryDto } from './dto/modify-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('/all')
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({ status: 200, description: 'All categories retrieved successfully', type: [Category] })
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('/byName/:categoryName')
  @ApiOperation({ summary: 'Find a category by name' })
  @ApiParam({ name: 'categoryName', type: String, required: true, description: 'Name of the category to retrieve' })
  @ApiResponse({ status: 200, description: 'Category found', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategoryName(@Param('categoryName') categoryName: string): Promise<Category> {
    return this.categoryService.findByCategoryName(categoryName);
  }

  @Get('/byId/:id')
  @ApiOperation({ summary: 'Find a category by ID' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the category to retrieve' })
  @ApiResponse({ status: 200, description: 'Category found', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategoryID(@Param('id') CategoryId: Types.ObjectId): Promise<Category> {
    return this.categoryService.findByCategoryID(CategoryId);
  }

  @Get('/countChallenge/:id')
  @ApiOperation({ summary: 'Count challenges in a category' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the category' })
  @ApiResponse({ status: 200, description: 'Challenge count returned', type: Number })
  async countChallenge(@Param('id') categoryId: Types.ObjectId): Promise<number> {
    return this.categoryService.countChallenge(categoryId);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto, description: 'Data for the new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: Category })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCategory(@Body() categoryData: CreateCategoryDto) {
    return this.categoryService.create(categoryData);
  }

  @Put('/modify/:id')
  @ApiOperation({ summary: 'Modify an existing category' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the category to modify' })
  @ApiBody({ type: ModifyCategoryDto, description: 'New data for the category' })
  @ApiResponse({ status: 200, description: 'Category modified successfully', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async modifyCategory(@Param('id') CategoryId: Types.ObjectId, @Body() categoryData: ModifyCategoryDto) {
    return this.categoryService.modify(CategoryId, categoryData);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the category to delete' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async delete(@Param('id') CategoryId: Types.ObjectId): Promise<void> {
    return this.categoryService.delete(CategoryId);
  }
}