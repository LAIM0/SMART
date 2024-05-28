import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  baseUrl = 'http://localhost:3000';

  async sendWelcomeEmail(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to our app!',
      template: 'welcome', // Template name (assuming you have a welcome.handlebars template)
      context: {}, // Data to pass to the template
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const resetPasswordUrl = `${this.baseUrl}/auth/forgotpwd?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      template: 'reset-password',
      context: { resetPasswordUrl },
    });
  }

  async sendValidationEmail(email: string, token: string) {
    const loginUrl = `${this.baseUrl}/auth/validate-email?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenue sur Ecoexya',
      template: 'validate-email',
      context: { loginUrl },
    });
  }

  async sendInitializePassword(email: string, token: string) {
    const resetPasswordUrl = `${this.baseUrl}/auth/forgotpwd?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenue sur Ecoexya',
      template: 'initialize-password',
      context: { resetPasswordUrl },
    });
  }
}