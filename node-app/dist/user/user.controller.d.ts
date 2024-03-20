import { UserService } from './user.service';
import { User } from './user.schema';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(userName: string): Promise<User>;
    findAll(): Promise<User[]>;
    welcome(): Promise<string>;
}
