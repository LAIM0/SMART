import { Controller, Get, Post, Put, Delete, Body, Query, Param, Request, Response, HttpException, HttpStatus, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.schema';
import { TeamDto, CreateTeamDto } from './dto/team.dto';
import { Types } from 'mongoose';
import { TeamIdDto } from './dto/teamId.dto';
import { TeamUpdateDto } from './dto/teamUpdate.dto';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { User } from '../User/user.schema';


@ApiTags('Teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Get()
  @ApiOperation({ summary: 'Retrieve all teams' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all teams', type: [TeamDto] })
  async findAll(): Promise<TeamDto[]> {
    return this.teamService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({ status: 201, description: 'Team successfully created', type: TeamDto })
  async create(@Body() createTeamDto: CreateTeamDto): Promise<TeamDto> {
    return this.teamService.create(createTeamDto);
  }

  @Post('default')
  @ApiOperation({ summary: 'Create default team', description: 'Creates a default team with predefined attributes.' })
  @ApiResponse({ status: 201, description: 'Default team created successfully' })
  @ApiResponse({ status: 400, description: 'Unable to create default team' })
  async createDefaultTeam() {
    try {
      const defaultTeamDto: CreateTeamDto = {
        name: 'Equipe par défaut',
        // Autres détails de l'équipe par défaut
      };
      return this.teamService.create(defaultTeamDto);
    } catch (error) {
      throw new Error('Unable to create default team: ' + error.message);
    }
  }

  @Get('getUsers')
  @ApiOperation({ summary: 'Get users by team', description: 'Retrieves all users associated with a specified team.' })
  @ApiQuery({ name: 'teamId', type: 'string', required: true, description: 'Team ID to fetch users for' })
  @ApiResponse({ status: 200, description: 'Users of the team retrieved successfully', type: [User] })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async getUsers(@Query() teamIdDto: TeamIdDto) {
    try {
      return this.teamService.getUsers(teamIdDto);
    } catch (error) {
      throw new Error('Unable to get users of team: ' + error.message);
    }
  }

  @Get('ranking')
  @ApiOperation({ summary: 'Get team ranking', description: 'Retrieves ranking of teams based on scores.' })
  @ApiResponse({ status: 200, description: 'Team rankings retrieved successfully', type: Array })
  @ApiResponse({ status: 400, description: 'Unable to retrieve rankings' })
  async getRanking(): Promise<{ team: Team; score: number }[]> {
    try {
      return this.teamService.getRanking();
    } catch (error) {
      throw new Error('Unable to get users of team: ' + error.message);
    }
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a team', description: 'Creates a new team with provided data.' })
  @ApiBody({ type: CreateTeamDto, description: 'Data for creating a new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  @ApiResponse({ status: 400, description: 'Error creating team' })
  async createTeam(@Body() teamData: CreateTeamDto) {
    return this.teamService.create(teamData);
  }

  @Get('byId/:teamId')
  @ApiOperation({ summary: 'Find a team by its ID' })
  @ApiParam({ name: 'teamId', type: String, required: true, description: 'The ID of the team' })
  @ApiResponse({ status: 200, description: 'Team found', type: Team })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async findById(@Param('teamId') teamId: string): Promise<Team> {
    try {
      const team = await this.teamService.findById(teamId);
      return team;
    } catch (error) {
      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    }
  }

  @Put('update/:teamId')
  @ApiOperation({ summary: 'Update a team profile' })
  @ApiParam({ name: 'teamId', type: String, required: true, description: 'ID of the team to update' })
  @ApiBody({ type: TeamUpdateDto })
  @ApiResponse({ status: 200, description: 'Team profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async updateUserProfile(
    @Param('teamId') teamId: string,
    @Body() teamUpdateDto: TeamUpdateDto,
  ): Promise<{ message: string }> {
    try {
      await this.teamService.updateTeam(teamId, teamUpdateDto);
      return { message: 'Profil utilisateur mis à jour avec succès' };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil de l'utilisateur:", error);
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'ID of the team to delete' })
  @ApiResponse({ status: 204, description: 'Team deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async delete(@Param('id') TeamId: Types.ObjectId): Promise<void> {
    return this.teamService.delete(TeamId);
  }

  @Post('upload/:teamId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Le répertoire où les fichiers seront stockés
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          // Utilisation de la fonction de rappel pour générer un nom de fichier unique
          cb(null, file.originalname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload a team picture' })
  @ApiParam({ name: 'teamId', type: String, required: true, description: 'ID of the team' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Team picture uploaded successfully', type: Team })
  async uploadTeamPicture(
    @Param('teamId') teamId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Team> {
    return this.teamService.updateTeamPicture(teamId, {
      picturePath: file.filename,
    });
    //return of({imagepath: file.filename});
  }

  @Get('profile-picture/:teamPicture')
  @ApiOperation({ summary: 'Retrieve a team picture' })
  @ApiParam({ name: 'teamPicture', type: String, required: true, description: 'The filename of the team picture' })
  @ApiResponse({ status: 200, description: 'Returns the team picture file' })
  FindTeamPicture(
    @Param('teamPicture') teamPicture,
    @Response() res,
  ): Promise<Team> {
    return res.sendFile(join(process.cwd(), 'uploads/' + teamPicture));
  }
}