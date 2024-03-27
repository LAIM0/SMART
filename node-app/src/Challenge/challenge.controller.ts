import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get('/all')
  async findAll(): Promise<Challenge[]> {
    return this.challengeService.findAll();
  }

  @Post('/create') // Décorateur @Post() pour l'endpoint /challenges/create
  async createChallenge(@Body() createUserDto: CreateChallengeDto) {
    return this.challengeService.create(createUserDto);
  }

  @Delete('/delete/:id')
  async deleteChallenge(@Param('id') id: number) {
    return this.challengeService.delete(id);
  }
}
