import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Types } from 'mongoose';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { CompletedService } from 'src/Completed/completed.service';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengeController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly completedService: CompletedService,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'Retrieve all challenges' })
  @ApiResponse({ status: 200, description: 'All challenges retrieved successfully', type: [Challenge] })
  async findAll(): Promise<Challenge[]> {
    return this.challengeService.findAll();
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new challenge' })
  @ApiBody({ type: CreateChallengeDto, description: 'Data to create a new challenge' })
  @ApiResponse({ status: 201, description: 'Challenge created successfully', type: Challenge })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengeService.create(createChallengeDto);
  }

  @Patch('/update')
  @ApiOperation({ summary: 'Update an existing challenge' })
  @ApiBody({ type: UpdateChallengeDto, description: 'Data to update an existing challenge' })
  @ApiResponse({ status: 200, description: 'Challenge updated successfully', type: Challenge })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateChallenge(@Body() updateChallengeDto: UpdateChallengeDto) {
    return this.challengeService.update(updateChallengeDto);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a challenge' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the challenge to delete' })
  @ApiResponse({ status: 204, description: 'Challenge deleted successfully' })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async deleteChallenge(@Param('id') id: Types.ObjectId) {
    this.challengeService.delete(id);
    this.completedService.deleteChallengeOccurrences(id);
  }

  @Get('/byId/:id')
  @ApiOperation({ summary: 'Get a challenge by ID' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the challenge to retrieve' })
  @ApiResponse({ status: 200, description: 'Challenge found', type: Challenge })
  @ApiResponse({ status: 404, description: 'Challenge not found' })
  async getById(@Param('id') challengeId: Types.ObjectId) {
    return this.challengeService.getById(challengeId);
  }
}
