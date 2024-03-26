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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  //signup
  @Post('/signup')
  async addUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ msg: string; userName: string }> {
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
    };
    const result = await this.userService.createUser(newUser);
    return {
      msg: 'User successfully registered',
      userName: result.email,
    };
  }

  @Get('/score')
  async score(@Body() scoreCheckDto: ScoreCheckDto): Promise<User> {
    const userId = scoreCheckDto.userId;
    const defisCompleted = await this.userService.getDefisCompletedUser(userId);
    if (!defisCompleted) {
      // Assumant que vous voulez afficher le nom du premier utilisateur
      console.log("No element found, User doesn't exists");
    }
    return defisCompleted;
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
}
