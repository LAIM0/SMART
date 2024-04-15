import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Types } from 'mongoose';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { CompletedService } from 'src/Completed/completed.service';

@Controller('challenges')
export class ChallengeController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly completedService: CompletedService, // Injection du service CompletedService
  ) {}

  @Get('/all')
  async findAll(): Promise<Challenge[]> {
    return this.challengeService.findAll();
  }

  @Post('/create') // Décorateur @Post() pour l'endpoint /challenges/create
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengeService.create(createChallengeDto);
  }

  @Patch('/update') 
  async updateChallenge(@Body() updateChallengeDto: UpdateChallengeDto) {
    return this.challengeService.update(updateChallengeDto);
  }

  @Delete('/delete/:id')
  async deleteChallenge(@Param('id') id: Types.ObjectId) {
    this.challengeService.delete(id);
    this.completedService.deleteChallengeOccurrences(id);
  }
  @Get('/byId/:id')
  async getById(@Param('id') challengeId: Types.ObjectId) {
    return this.challengeService.getById(challengeId);
  }
}
