import { Injectable, NotAcceptableException } from '@nestjs/common';
    import { UserService } from 'src/User/user.service';
    import * as bcrypt from 'bcryptjs';

    @Injectable()
    export class AuthService {
      constructor(private readonly usersService: UserService) {}
      
      async validateUser(username: string, password: string): Promise<any> {
        console.log("username passed :", username);
        console.log("password passed :", password);
        const user = await this.usersService.getUser(username);
        console.log(user);
        const passwordValid = await bcrypt.compare(password, user.passwordHash)
        
        if (!user) {
            throw new NotAcceptableException('could not find the user');
          }
        if (user && passwordValid) {
          return {
            userName: user.email
          };
        }
        return null;
      }
    }