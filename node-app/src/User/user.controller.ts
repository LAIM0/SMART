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
import * as bcrypt from 'bcryptjs';
import { AuthenticatedGuard } from 'src/Auth/authenticated.guard';
import { LocalAuthGuard } from 'src/Auth/local.auth.guard';
import { UserService } from './user.service';
import { ScoreCheckDto } from './dto/score-check.dto';
import { ResetPasswordDto } from './dto/ResetPasswordDto.dto';
import { AdminAuthGuard } from 'src/Auth/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { join } from 'path';
import { UpdateUserDto } from './dto/update-user.dto';
import { LevelCheckDto } from './dto/level-check.dto';
import { AdminTeamAuthGuard } from 'src/Auth/adminTeam';
import { diskStorage } from 'multer';
import { Category } from 'src/Category/category.schema';
import { Types } from 'mongoose';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';


@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all users', type: [User] })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/welcome')
  @ApiOperation({ summary: 'Welcome message' })
  @ApiResponse({ status: 200, description: 'Welcome message for the first user or no users found' })
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto, description: 'Data for new user registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: Object })
  @ApiResponse({ status: 400, description: 'Bad request, unable to register user' })
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
        createUserDto.passwordInitialized,
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
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ type: ResetPasswordDto, description: 'Data required for resetting password' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Bad request, unable to reset password' })
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
  @ApiOperation({ summary: 'Get user score' })
  @ApiQuery({ name: 'userId', type: String, required: true, description: 'User ID to fetch the score for' })
  @ApiResponse({ status: 200, description: 'Score retrieved successfully', type: Object })
  async score(
    @Query() scoreCheckDto: ScoreCheckDto,
  ): Promise<{ score: number }> {
    const userId = scoreCheckDto.userId;
    return this.userService.getScore(userId);
  }

  @Get('/update-all-levels')
  @ApiOperation({ summary: 'Update all user levels' })
  @ApiResponse({ status: 200, description: 'All user levels updated successfully', type: Object })
  @ApiResponse({ status: 500, description: 'Internal server error occurred while updating user levels' })
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
  @ApiOperation({ summary: 'Get user level' })
  @ApiQuery({ name: 'userId', type: String, required: true, description: 'User ID to fetch the level for' })
  @ApiResponse({ status: 200, description: 'Level retrieved successfully', type: Object })
  async getLevel(
    @Query() levelCheckDto: LevelCheckDto,
  ): Promise<{ success: boolean; level?: number; error?: string }> {
    const userId = levelCheckDto.userId;
    return this.userService.getLevel(userId);
  }

  //Get / ranking -- classement des user ordre décroissant de points
  @Get('/ranking')
  @ApiOperation({ summary: 'Get user rankings' })
  @ApiResponse({ status: 200, description: 'User rankings retrieved successfully', type: Array })
  async ranking(): Promise<{ user: User; score: number; teamName: string }[]> {
    return this.userService.getRanking();
  }

  @Get('/scoreByCategory/:userId')
  @ApiOperation({ summary: 'Get user score by category' })
  @ApiParam({ name: 'userId', type: String, required: true, description: 'User ID to fetch scores for' })
  @ApiResponse({ status: 200, description: 'Scores by category retrieved successfully', type: Array })
  async scoreByCategory(
    @Param('userId') userId: Types.ObjectId,
  ): Promise<{ category: Category; score: number }[]> {
    return this.userService.getScoreByCategory(userId);
  }

  //Post / Login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ description: 'User login credentials' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Request() req): any {
    return { User: req.user, msg: 'User logged in' };
  }

  //Get / protected
  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  @ApiOperation({ summary: 'Access protected content' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Protected content accessed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getHello(@Request() req): string {
    return req.user;
  }
  //Get / logout
  @Get('/logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get logged-in user information' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Logged-in user information returned', type: Object })
  getLoggedInUser(@Request() req) {
    const { id, userName, firstName } = req.user; // Supposons que req.user contient l'id et le nom d'utilisateur de l'utilisateur connecté

    console.log(req.user);
    return { id, email: userName, firstName };
  }

  @Get('check')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Check user authentication status' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Authentication status returned', type: Object })
  checkAuthentication(@Request() req) {
    // L'utilisateur est authentifié si cette fonction est appelée
    // Si cette fonction est appelée, cela signifie que le garde a permis l'accès
    // Cela peut être utilisé pour vérifier l'authentification côté serveur
    return { loggedIn: true };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string', format: 'email' } } } })
  @ApiResponse({ status: 200, description: 'Password reset email sent if user exists' })
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
  @ApiOperation({ summary: 'Check admin user authentication status' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Admin authentication status returned', type: Object })
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
  @ApiOperation({ summary: 'Check admin team user authentication status' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Admin team authentication status returned', type: Object })
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
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'userId', type: 'string', required: true, description: 'User ID of the user to delete' })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete default administrator' })
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
  @ApiOperation({ summary: 'Update user team' })
  @ApiParam({ name: 'userId', type: 'string', required: true, description: 'User ID to update team for' })
  @ApiBody({ schema: { properties: { teamId: { type: 'string', description: 'New team ID for the user' } } } })
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or operation failed' })
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
  @ApiOperation({ summary: 'Update user admin status' })
  @ApiParam({ name: 'userId', type: 'string', required: true, description: 'User ID to update admin status for' })
  @ApiBody({ schema: { properties: { isAdmin: { type: 'boolean', description: 'New admin status' } } } })
  @ApiResponse({ status: 200, description: 'Admin status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or operation failed' })
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
  @ApiOperation({ summary: 'Find user by ID', description: 'Retrieves a user by their unique identifier (userId).' })
  @ApiParam({ name: 'userId', type: 'string', required: true, description: 'The unique identifier of the user to retrieve' })
  @ApiResponse({ status: 200, description: 'User found successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({ summary: 'Upload user profile picture' })
  @ApiParam({ name: 'userId', type: 'string', required: true, description: 'User ID to associate picture with' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Profile picture uploaded successfully' })
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
  @ApiOperation({ summary: 'Retrieve a user profile picture' })
  @ApiParam({ name: 'profilePicture', type: 'string', required: true, description: 'Filename of the profile picture to retrieve' })
  @ApiResponse({ status: 200, description: 'Profile picture retrieved successfully' })
  FindProfilePicture(
    @Param('profilePicture') profilePicture,
    @Response() res,
  ): Promise<User> {
    return res.sendFile(join(process.cwd(), 'uploads/' + profilePicture));
  }

  @Put('update/:userId')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'userId', type: 'string', required: true, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto, description: 'Data to update the user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Error updating profile' })
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    try {
      await this.userService.updateUserProfile(userId, updateUserDto);
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
  @ApiOperation({ summary: 'Validate email with token' })
  @ApiQuery({ name: 'token', type: 'string', required: true, description: 'Validation token' })
  @ApiResponse({ status: 200, description: 'Email validated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
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
  @ApiOperation({ summary: 'Send email validation' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string', format: 'email' } } } })
  @ApiResponse({ status: 200, description: 'Validation email sent successfully' })
  async validateEmail(@Body('email') email: string) {
    const token = await this.userService.generateUserToken(email);
    await this.userService.sendvalidationEmail(email, token);
    return {
      message:
        'Un email vous a été envoyé pour valider votre compte avant votre première connexion',
    };
  }

  @Post('initialize-password')
  @ApiOperation({ summary: 'Initialize password' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string', format: 'email' } } } })
  @ApiResponse({ status: 200, description: 'Initialization email sent successfully' })
  async initializePassword(@Body('email') email: string) {
    const token = await this.userService.generateUserToken(email);
    await this.userService.sendInitializePasswordEmail(email, token);
    return {
      message:
        'Un email vous a été envoyé pour initialiser votre mot de passe avant votre première connexion',
    };
  }

  @Get('getByTeam/:teamId')
  @ApiOperation({ summary: 'Get users by team ID' })
  @ApiParam({ name: 'teamId', type: 'string', required: true, description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'Users fetched successfully', type: [User] })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async findByTeamId(@Param('teamId') teamId: string): Promise<User[]> {
    return this.userService.findByTeamId(teamId);
  }
}
