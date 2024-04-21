import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../User/user.service';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to our app!',
      template: 'welcome', // Template name (assuming you have a welcome.handlebars template)
      context: {}, // Data to pass to the template
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetPasswordUrl = `http://localhost:3000/auth/forgotpwd?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      template: 'reset-password',
      context: { resetPasswordUrl },
    });
  }

  async sendValidationEmail(email: string, token: string) {
    const loginUrl = `http://localhost:3000/auth/validate-email?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenue sur Ecoexya',
      template: 'validate-email',
      context: { loginUrl },
    });
  }
}

/*
Pour ajouter dans un controller un mail:
Par exemple envoyer un email de bienvenue à un user:

    await this.mailService.sendWelcomeEmail(userData.email);


Pour tester des mails j'ai créer un mailtrap c'est une boite de reception pour ce genre de test
Voilà les id:
leo.aimonetto@insa-lyon.fr
2tGsBPXEC@$e2Q.

Du coup en envoyant un mail à n'importe qui vous le retrouverez dans le compte
mailtrap (l'utilisateur final ne le recevra pas).
 */
