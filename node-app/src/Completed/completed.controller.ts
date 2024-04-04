import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { CompletedService } from './completed.service';
import { Completed } from './completed.schema';
import { CreateCompletedDto } from './dto/create-completed.dto';
import { UserCheckDto } from './dto/get-complete-user.dto';
import { Types } from 'mongoose';

@Controller('completed')
export class CompletedController {
  constructor(private readonly completedService: CompletedService) {}

  @Get()
  async findAll(): Promise<Completed[]> {
    return this.completedService.findAll();
  }

  @Post('/create')
  async CreateCompleted(@Body() createCompletedDto: CreateCompletedDto) {
    return this.completedService.create(createCompletedDto);
  }
  @Get('/byUserId/:userId')
  async getCompletedByUserId(@Param('userId') userId:Types.ObjectId ) {
    return this.completedService.getUserCompleteds(userId);
  }
}
