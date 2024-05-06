import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { Image } from './image.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all images' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all images.',
    type: [Image],
  })
  async findAll(): Promise<Image[]> {
    return this.imageService.findAll();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Image file uploaded successfully.',
    type: Image,
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<Image> {
    return this.imageService.upload(file);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Download an image by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID of the image to download',
  })
  @ApiResponse({ status: 200, description: 'Image downloaded successfully.' })
  async downloadImage(@Param('id') id: string): Promise<Image> {
    return this.imageService.download(id);
  }

  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update an image file' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID of the image to update',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Image file updated successfully.',
    type: Image,
  })
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Image> {
    return this.imageService.update(id, file);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete an image file' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID of the image to delete',
  })
  @ApiResponse({ status: 204, description: 'Image file successfully deleted' })
  async deleteImage(@Param('id') id: string): Promise<void> {
    return this.imageService.delete(id);
  }
}
