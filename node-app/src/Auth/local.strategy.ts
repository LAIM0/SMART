import { Injectable, UnauthorizedException } from '@nestjs/common';
    import { PassportStrategy } from '@nestjs/passport';
    import { Strategy } from 'passport-local';
    import { AuthService } from './auth.service';
    @Injectable()
    export class LocalStrategy extends PassportStrategy(Strategy) {
      constructor(private readonly authService: AuthService) {
        super();
      }
      async validate(username: string, password: string): Promise<any>{
        const userName = username.toLowerCase();
        console.log("username :", userName);
        console.log("password :", password);
        console.log("LocalStrategy");
        const user = await this.authService.validateUser(userName, password);
        if (!user) {
            console.log("pas autporisé local strat");
          throw new UnauthorizedException();
        }
        return user;
      }
    }