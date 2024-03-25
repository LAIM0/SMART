import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.schema';

@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get('/all')
  async findAll(): Promise<Challenge[]> {
    return this.challengeService.findAll();
  }

  @Post('/create') // Décorateur @Post() pour l'endpoint /challenges/create
  async createChallenge(@Body() challengeData: Partial<Challenge>) {
    return this.challengeService.create(challengeData);
  }

  @Delete('/delete/:id')
  async deleteChallenge(@Param('id') id: number) {
    return this.challengeService.delete(id);
  }
}
