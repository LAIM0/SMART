import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Types } from 'mongoose';

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

  @Get('/byId')
  async getById(@Body() challengeId: Types.ObjectId) {
    return this.challengeService.getById(challengeId);
  }
}
