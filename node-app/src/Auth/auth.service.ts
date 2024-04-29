import { Injectable, NotAcceptableException } from '@nestjs/common';
    import { UserService } from 'src/User/user.service';
    import * as bcrypt from 'bcryptjs';

    @Injectable()
    export class AuthService {
      constructor(private readonly usersService: UserService) {}
      
      async validateUser(username: string, password: string): Promise<any> {
        try {
        const user = await this.usersService.getUser(username);
        
        if (!user) {
          throw new NotAcceptableException('could not find the user');
        }
        
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
    
        if (!passwordValid) {
          throw new NotAcceptableException('invalid password');
        }

        if(!user.passWordInitialized){
          throw new NotAcceptableException('Password not initialized');

        }
    
        if (user.firstLogin) {
          throw new NotAcceptableException('Email not verified');
        }

        return {
          id: user.id,
          userName: user.email,
          isAdmin: user.isAdmin,
        };
      }catch (error) {
          // Catch any unexpected errors and rethrow them
          throw error;
        }
      }
    }