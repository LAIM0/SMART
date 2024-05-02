import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { TeamService } from './team.service';
import { Team } from './team.schema';
import { TeamDto, CreateTeamDto } from './dto/team.dto';
import { Types } from 'mongoose';
import { TeamUpdateDto } from './dto/teamUpdate.dto';

@ApiTags('Teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all teams' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all teams.',
    type: [TeamDto],
  })
  async findAll(): Promise<TeamDto[]> {
    return this.teamService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({
    status: 201,
    description: 'Team successfully created.',
    type: TeamDto,
  })
  async create(@Body() createTeamDto: CreateTeamDto): Promise<TeamDto> {
    return this.teamService.create(createTeamDto);
  }

  @Get('byId/:teamId')
  @ApiOperation({ summary: 'Find team by ID' })
  @ApiParam({
    name: 'teamId',
    type: String,
    required: true,
    description: 'The ID of the team',
  })
  @ApiResponse({ status: 200, description: 'Team found', type: Team })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async findById(@Param('teamId') teamId: string): Promise<Team> {
    try {
      const team = await this.teamService.findById(teamId);
      if (!team)
        throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
      return team;
    } catch (error) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
  }

  @Put('update/:teamId')
  @ApiOperation({ summary: 'Update a team profile' })
  @ApiParam({
    name: 'teamId',
    type: String,
    description: 'The ID of the team to update',
  })
  @ApiBody({ type: TeamUpdateDto })
  @ApiResponse({
    status: 200,
    description: 'Team profile updated successfully',
    type: Team,
  })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async updateUserProfile(
    @Param('teamId') teamId: string,
    @Body() teamUpdateDto: TeamUpdateDto,
  ): Promise<{ message: string }> {
    try {
      await this.teamService.updateTeam(teamId, teamUpdateDto);
      return { message: 'Team profile updated successfully' };
    } catch (error) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The ID of the team to delete',
  })
  @ApiResponse({ status: 204, description: 'Team successfully deleted' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async delete(@Param('id') TeamId: Types.ObjectId): Promise<void> {
    try {
      await this.teamService.delete(TeamId);
    } catch (error) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
  }
}
