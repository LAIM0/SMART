import { Controller, Get, Post, Put, Delete, Body, Query, Param, Request, Response, HttpException, HttpStatus, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.schema';
import { TeamDto, CreateTeamDto, ModifyTeamDto } from './dto/team.dto';
import { Types } from 'mongoose';
import { TeamIdDto } from './dto/teamId.dto';
import { TeamUpdateDto } from './dto/teamUpdate.dto';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthenticatedGuard } from 'src/Auth/authenticated.guard';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Get()
  async findAll(): Promise<TeamDto[]> {
    return this.teamService.findAll();
  }

  @Post()
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
  async findById(@Param('teamId') teamId: string): Promise<Team> {
    try {
      const team = await this.teamService.findById(teamId);
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