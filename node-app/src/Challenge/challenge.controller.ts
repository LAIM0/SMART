import { Controller, Get } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.schema';

@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get()
  async findAll(): Promise<Challenge[]> {
    return this.challengeService.findAll();
  }

  
}
