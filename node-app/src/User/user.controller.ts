import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Response,
  Query,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as bcrypt from 'bcryptjs';
import { AuthenticatedGuard } from 'src/Auth/authenticated.guard';
import { LocalAuthGuard } from 'src/Auth/local.auth.guard';
import { UserService } from './user.service';
import { ScoreCheckDto } from './dto/score-check.dto';
import { ResetPasswordDto } from './dto/ResetPasswordDto.dto';
import { AdminAuthGuard } from 'src/Auth/admin.guard';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UpdateUserDto } from './dto/update-user.dto';
import { LevelCheckDto } from './dto/level-check.dto';
import { AdminTeamAuthGuard } from 'src/Auth/adminTeam';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
    this.userService.createDefaultAdminIfNotExists();
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/welcome')
  async welcome(): Promise<string> {
    const users = await this.userService.findAll();
    if (users.length > 0) {
      // Assumant que vous voulez afficher le nom du premier utilisateur
      return `Hello Client! There is one record in the database for ${users[0].lastName}`;
    } else {
      return 'No users found';
    }
  }
  @Post('/signup')
  async addUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ msg: string; userName: string }> {
    try {
      console.log('test Sign');
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.passwordHash,
        saltOrRounds,
      );
      const result = await this.userService.createUser(
        createUserDto.email,
        hashedPassword,
        createUserDto.lastName,
        createUserDto.firstName,
        createUserDto.isAdmin,
        createUserDto.teamId,
        createUserDto.firstLogin,
      );

      return {
        msg: 'User successfully registered',
        userName: result.email,
      };
    } catch (error) {
      console.log(error);
      return { msg: error.message, userName: '' };
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ msg: string }> {
    try {
      await this.userService.resetPasswordWithToken(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
      return { msg: 'Password reset successful' };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { msg: error.message };
    }
  }

  @Get('/score')
  async score(
    @Query() scoreCheckDto: ScoreCheckDto,
  ): Promise<{ score: number }> {
    const userId = scoreCheckDto.userId;
    return this.userService.getScore(userId);
  }

  @Get('/update-all-levels')
  async updateAllLevels(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.userService.updateAllLevels();
      return { success: true };
    } catch (error) {
      console.error('Error updating user levels:', error);
      return {
        success: false,
        error: 'An error occurred while updating user levels',
      };
    }
  }

  @Get('/level')
  async getLevel(
    @Query() levelCheckDto: LevelCheckDto,
  ): Promise<{ success: boolean; level?: number; error?: string }> {
    const userId = levelCheckDto.userId;
    return this.userService.getLevel(userId);
  }

  //Get / ranking -- classement des user ordre décroissant de points
  @Get('/ranking')
  async ranking(): Promise<{ user: User; score: number; teamName: string }[]> {
    return this.userService.getRanking();
  }

  //Post / Login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return { User: req.user, msg: 'User logged in' };
  }

  //Get / protected
  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  getHello(@Request() req): string {
    return req.user;
  }
  //Get / logout
  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  getLoggedInUser(@Request() req) {
    const { id, userName, firstName } = req.user; // Supposons que req.user contient l'id et le nom d'utilisateur de l'utilisateur connecté

    console.log(req.user);
    return { id, email: userName, firstName };
  }

  @Get('check')
  @UseGuards(AuthenticatedGuard)
  checkAuthentication(@Request() req) {
    // L'utilisateur est authentifié si cette fonction est appelée
    // Si cette fonction est appelée, cela signifie que le garde a permis l'accès
    // Cela peut être utilisé pour vérifier l'authentification côté serveur
    return { loggedIn: true };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const token = await this.userService.generateUserToken(email);
    await this.userService.sendResetPasswordEmail(email, token);
    return {
      message:
        'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    };
  }

  @Get('check/admin')
  @UseGuards(AdminAuthGuard, AuthenticatedGuard)
  checkAdminAuthentication(@Request() req) {
    // if(req.user.isAdmin){
    //   return { isAdminLoggedIn: true };
    // }
    // else{
    //   throw new HttpException('Unauthorized Admin access', HttpStatus.FORBIDDEN);
    // }
    return { isAdminLoggedIn: true };
  }

  @Get('check/adminTeam')
  @UseGuards(AdminTeamAuthGuard, AuthenticatedGuard)
  checkAdminTeamAuthentication(@Request() req) {
    // if(req.user.isAdminTeam){
    //   return { isAdminTeamLoggedIn: true };
    // }
    // else{
    //   throw new HttpException('Unauthorized AdminTeam access', HttpStatus.FORBIDDEN);
    // }
    return { isAdminTeamLoggedIn: true };
  }

  @UseGuards(AdminAuthGuard)
  @Delete('delete/:userId')
  async deleteUser(
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    try {
      // Récupérer l'administrateur par défaut
      const defaultAdmin = await this.userService.findDefaultAdmin();
      const user = await this.userService.findById(userId);
      if (user.email === defaultAdmin.email) {
        throw new Error(
          "Vous ne pouvez pas supprimer l'administrateur par défaut.",
        );
      }
      await this.userService.deleteUser(userId);
      return { message: "L'utilisateur a été supprimé avec succès" };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw new Error(
        "Une erreur s'est produite lors de la suppression de l'utilisateur",
      );
    }
  }

  @Put(':userId/team')
  async updateUserTeam(
    @Param('userId') userId: string,
    @Body('teamId') teamId: string,
  ) {
    console.log('entrée put team');
    try {
      // Assurez-vous que teamId est une chaîne
      teamId = teamId.toString();

      // Appelez votre service pour mettre à jour l'équipe de l'utilisateur
      await this.userService.updateUserTeam(userId, teamId);

      return { message: 'Team updated successfully' };
    } catch (error) {
      console.error("Error updating user's team:", error);
      throw error;
    }
  }

  @Put(':userId/admin')
  async updateUserAdminStatus(
    @Param('userId') userId: string,
    @Body('isAdmin') isAdmin: boolean,
  ) {
    try {
      const defaultAdmin = await this.userService.findDefaultAdmin();
      const user = await this.userService.findById(userId);
      if (user.email === defaultAdmin.email) {
        throw new Error(
          'Vous ne pouvez pas changer les droits de cet utilisateur.',
        );
      }
      await this.userService.updateUserAdminStatus(userId, isAdmin);
      return { message: 'User admin status updated successfully' };
    } catch (error) {
      console.error("Error updating user's admin status:", error);
      throw error;
    }
  }

  @Get('byId/:userId')
  async findById(@Param('userId') userId: string): Promise<User> {
    return this.userService.findById(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('upload')
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
  async uploadProfilePicture(
    @Request() req,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    console.log(file);
    const user = req.user;
    console.log(user);
    return this.userService.updateProfilePicture(user.id, {
      profilePicturePath: file.filename,
    });
    //return of({imagepath: file.filename});
  }

  @Get('profile-picture/:profilePicture')
  FindProfilePicture(
    @Param('profilePicture') profilePicture,
    @Response() res,
  ): Promise<User> {
    return res.sendFile(join(process.cwd(), 'uploads/' + profilePicture));
  }

  @Put('update/:userId')
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto, // Créez un DTO approprié pour les données de mise à jour du profil
  ): Promise<{ message: string }> {
    try {
      await this.userService.updateUserProfile(userId, updateUserDto); // Appelez votre service pour mettre à jour le profil de l'utilisateur
      return { message: 'Profil utilisateur mis à jour avec succès' };
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du profil de l'utilisateur:",
        error,
      );
      throw error;
    }
  }

  @Get('validate-email')
  async validateEmailWithToken(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    console.log('entreée endpoint validate mail');
    try {
      const response =
        await this.userService.updateFirstLoginStatusWithToken(token);
      console.log(response);
      return { msg: 'email vérifié successful' };
    } catch (error) {
      return { msg: error.message };
    }
  }

  @Post('send-validatation-email')
  async validateEmail(@Body('email') email: string) {
    const token = await this.userService.generateUserToken(email);
    await this.userService.sendvalidationEmail(email, token);
    return {
      message:
        'Un email vous a été envoyé pour valider votre compte avant votre première connexion',
    };
  }

  @Post('initialize-password')
  async initializePassword(@Body('email') email: string) {
    const token = await this.userService.generateUserToken(email);
    await this.userService.sendInitializePasswordEmail(email, token);
    return {
      message:
        'Un email vous a été envoyé pour initialiser votre mot de passe avant votre première connexion',
    };
  }

  @Get('getByTeam/:teamId')
  async findByTeamId(@Param('teamId') teamId: string): Promise<User[]> {

    return this.userService.findByTeamId(teamId);
  }

}
