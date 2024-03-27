import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompletedService } from './completed.service';
import { Completed } from './completed.schema';
import { CreateCompletedDto } from './dto/create-completed.dto';

@Controller('completed')
export class CompletedController {
  constructor(private readonly completedService: CompletedService) {}

  @Get()
  async findAll(): Promise<Completed[]> {
    return this.completedService.findAll();
  }

  @Post('/create')
  async ChallengeCompleted(@Body() createCompletedDto: CreateCompletedDto) {
    return this.completedService.create(createCompletedDto);
  }
}
