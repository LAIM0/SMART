import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { HttpStatus } from "@nestjs/common";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (request.isAuthenticated()) {
      return true;
    } else {
      // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
      throw new HttpException('Unauthorized access', HttpStatus.FOUND);
    }
  }
}