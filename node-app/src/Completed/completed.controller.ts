import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CompletedService } from './completed.service';
import { Completed } from './completed.schema';
import { CreateCompletedDto } from './dto/create-completed.dto';
import { Types } from 'mongoose';

@ApiTags('Completed')
@Controller('completed')
export class CompletedController {
  constructor(private readonly completedService: CompletedService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all completed challenges' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all completed challenges.',
    type: [Completed],
  })
  async findAll(): Promise<Completed[]> {
    return this.completedService.findAll();
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a completed challenge record' })
  @ApiResponse({
    status: 201,
    description: 'Completed challenge record successfully created.',
    type: Completed,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async CreateCompleted(@Body() createCompletedDto: CreateCompletedDto) {
    return this.completedService.create(createCompletedDto);
  }

  @Get('/byUserId/:userId')
  @ApiOperation({ summary: 'Get completed challenges by user ID' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    required: true,
    description: 'User ID to retrieve completed challenges for',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved completed challenges for the user.',
    type: [Completed],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getCompletedByUserId(@Param('userId') userId: Types.ObjectId) {
    return this.completedService.getUserCompleteds(userId);
  }

  @Get('/byUserIdByChallengeId')
  @ApiOperation({
    summary: 'Get completed challenges by user ID and challenge ID',
  })
  @ApiQuery({
    name: 'userId',
    type: 'string',
    required: true,
    description: 'User ID',
  })
  @ApiQuery({
    name: 'challengeId',
    type: 'string',
    required: true,
    description: 'Challenge ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully retrieved the completed challenges based on user ID and challenge ID.',
    type: [Completed],
  })
  async getCompletedByUserIdByChallengeId(
    @Query('userId') userId: Types.ObjectId,
    @Query('challengeId') challengeId: Types.ObjectId,
  ): Promise<Completed[]> {
    return this.completedService.getCompletedByUserIdByChallengeId(
      userId,
      challengeId,
    );
  }

  @Delete('/delete')
  @ApiOperation({ summary: 'Delete a completed challenge' })
  @ApiQuery({
    name: 'userId',
    type: 'string',
    required: true,
    description: 'User ID',
  })
  @ApiQuery({
    name: 'challengeId',
    type: 'string',
    required: true,
    description: 'Challenge ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Completed challenge successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Completed challenge not found' })
  async deleteChallenge(
    @Query('userId') userId: Types.ObjectId,
    @Query('challengeId') challengeId: Types.ObjectId,
  ) {
    console.log('params pour la suppression - controller', userId, challengeId);
    return this.completedService.delete(userId, challengeId);
  }
}
