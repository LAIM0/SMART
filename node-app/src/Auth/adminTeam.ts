import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { UserService } from 'src/User/user.service';

@Injectable()
export class AdminTeamAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('adminTeamauthguard');
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; 

    const user = await this.userService.findById(userId); 

    if (user && user.isTeamAdmin) {
      return true; 
    } else {
      throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
    }
  }
}
