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
import { TeamIdDto } from './dto/teamId.dto';
import { TeamUpdateDto } from './dto/teamUpdate.dto';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthenticatedGuard } from 'src/Auth/authenticated.guard';

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

  @Post('default')
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
  async getUsers(@Query() teamIdDto: TeamIdDto) {
    try {
      return this.teamService.getUsers(teamIdDto);
    } catch (error) {
      throw new Error('Unable to get users of team: ' + error.message);
    }
  }

  @Get('ranking')
  async getRanking(): Promise<{ team: Team; score: number }[]> {
    try {
      return this.teamService.getRanking();
    } catch (error) {
      throw new Error('Unable to get users of team: ' + error.message);
    }
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


  @Post('/create')
  async createTeam(@Body() teamData: CreateTeamDto) {
    return this.teamService.create(teamData);
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
  FindTeamPicture(
    @Param('teamPicture') teamPicture,
    @Response() res,
  ): Promise<Team> {
    return res.sendFile(join(process.cwd(), 'uploads/' + teamPicture));
  }
}
