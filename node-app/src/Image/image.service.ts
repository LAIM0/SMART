import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './image.schema';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async findAll(): Promise<Image[]> {
    return this.imageModel.find().exec();
  }

  async upload(file: Express.Multer.File): Promise<Image> {
    const newImage = new this.imageModel({
      imageBuffer: file.buffer,
    });
    return newImage.save();
  }

  async download(id: string): Promise<Image> {
    const image = await this.imageModel.findById(id).exec();
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  async update(id: string, file: Express.Multer.File): Promise<Image> {
    const existingImage = await this.imageModel.findById(id);
    if (!existingImage) {
      throw new NotFoundException('Image not found');
    }
    existingImage.imageData = file.buffer;
    return existingImage.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.imageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Image not found');
    }
  }
}
