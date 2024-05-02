import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from './category.schema';
import { Types } from 'mongoose';
import { ChallengeCountResponse } from './interfaces/category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ModifyCategoryDto } from './dto/modify-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all')
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all categories.',
    type: [Category],
  })
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('/byName/:categoryName')
  @ApiOperation({ summary: 'Find category by name' })
  @ApiParam({
    name: 'categoryName',
    type: String,
    required: true,
    description: 'Name of the category to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully found the category.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategoryName(
    @Param('categoryName') categoryName: string,
  ): Promise<Category> {
    return this.categoryService.findByCategoryName(categoryName);
  }

  @Get('/byId/:id')
  @ApiOperation({ summary: 'Find category by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID of the category to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully found the category.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategoryID(
    @Param('id') CategoryId: Types.ObjectId,
  ): Promise<Category> {
    return this.categoryService.findByCategoryID(CategoryId);
  }

  @Get('/countChallenge/:id')
  async countChallenge(@Param('id') categoryId: Types.ObjectId): Promise<number> {
    return this.categoryService.countChallenge(categoryId);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category successfully created.',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createCategory(@Body() categoryData: CreateCategoryDto) {
    return this.categoryService.create(categoryData);
  }

  @Put('/modify/:id')
  @ApiOperation({ summary: 'Modify an existing category' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID of the category to modify',
  })
  @ApiResponse({
    status: 200,
    description: 'Category successfully modified.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async modifyCategory(
    @Param('id') CategoryId: Types.ObjectId,
    @Body() categoryData: ModifyCategoryDto,
  ) {
    return this.categoryService.modify(CategoryId, categoryData);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID of the category to delete',
  })
  @ApiResponse({ status: 204, description: 'Category successfully deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async delete(@Param('id') CategoryId: Types.ObjectId): Promise<void> {
    return this.categoryService.delete(CategoryId);
  }
}
