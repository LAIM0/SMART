import { Controller, Get } from '@nestjs/common';
import { CompletedService } from './completed.service';
import { Completed } from './completed.schema';

@Controller('completed')
export class CompletedController {
  constructor(private readonly completedService: CompletedService) {}

  @Get()
  async findAll(): Promise<Completed[]> {
    return this.completedService.findAll();
  }

  
}
