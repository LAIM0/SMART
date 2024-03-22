import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body('name') userName: string): Promise<User> {
        return this.userService.create(userName);
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
            return "No users found";
        }
    }

    // Vous pouvez ajouter d'autres points de terminaison selon les besoins de votre application
}
