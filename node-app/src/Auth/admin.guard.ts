import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { UserService } from 'src/User/user.service'; // Assurez-vous d'importer le service UserService ou tout autre service nécessaire

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {} // Injectez le service UserService ou tout autre service nécessaire

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('adminauthguard');
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; // Supposons que vous stockiez l'ID de l'utilisateur dans le jeton JWT

    const user = await this.userService.findById(userId); // Utilisez le service UserService pour récupérer les détails de l'utilisateur

    if (user && user.isAdmin) {
      return true; // Si l'utilisateur est un administrateur, autorisez l'accès
    } else {
      // Sinon, renvoyer une erreur appropriée
      throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
    }
  }
}
