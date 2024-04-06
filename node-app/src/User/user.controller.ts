import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthenticatedGuard } from 'src/Auth/authenticated.guard';
import { LocalAuthGuard } from 'src/Auth/local.auth.guard';
import { UserService } from './user.service';
import { AuthService } from 'src/Auth/auth.service';
import { ScoreCheckDto } from './dto/score-check.dto';
import { ResetPasswordDto } from './dto/ResetPasswordDto.dto';
import { MailService } from 'src/mail/mail.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  //private readonly jwtService: JwtService

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
      const newUser = {
        email: createUserDto.email,
        passwordHash: hashedPassword,
        lastName: createUserDto.lastName,
        firstName: createUserDto.firstName,
        isAdmin: createUserDto.isAdmin,
        teamId: createUserDto.teamId,
      };

      // Log the user data before calling createUser method
      console.log('User data:', newUser);

      const result = await this.userService.createUser(
        createUserDto.email,
        hashedPassword,
        createUserDto.lastName,
        createUserDto.firstName,
        createUserDto.isAdmin,
        createUserDto.teamId,
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
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        resetPasswordDto.password,
        saltOrRounds,
      );
      await this.userService.resetPassword(
        resetPasswordDto.email,
        hashedPassword,
      );
      return { msg: 'Password reset successful' };
    } catch (error) {
      console.log(error);
      return { msg: error.message };
    }
  }
  // @Post('forgot-password')
  // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
  //   const user = await this.userService.findByEmail(forgotPasswordDto.email);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   const token = this.jwtService.sign({ email: user.email }, { expiresIn: '1h' });
  //   // Envoi de l'e-mail de réinitialisation de mot de passe avec le lien contenant le token
  //   // Vous pouvez utiliser des services comme SendGrid, Nodemailer, etc., pour envoyer des e-mails
  // }

  //Get / Score & infos user
  @Get('/score')
  async score(
    @Body() scoreCheckDto: ScoreCheckDto,
  ): Promise<{ user: User; score: number }> {
    const userId = scoreCheckDto.userId;
    return this.userService.getScoreUserWithDetails(userId);
  }

  //Get / ranking -- classement des user ordre décroissant de points
  @Get('/ranking')
  async ranking(
    @Body() scoreCheckDto: ScoreCheckDto,
  ): Promise<{ user: User; score: number }[]> {
    const userId = scoreCheckDto.userId;
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
    const { id, userName } = req.user; // Supposons que req.user contient l'id et le nom d'utilisateur de l'utilisateur connecté

    console.log(req.user);
    return { id, email: userName };
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
    const token = await this.userService.generateResetPasswordToken(email);
    await this.userService.sendResetPasswordEmail(email, token);
    return {
      message:
        'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    };
  }
}
