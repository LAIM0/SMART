import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './User/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ChallengeModule } from './Challenge/challenge.module';
import { TeamModule } from './Team/team.module';
import { CategoryModule } from './Category/category.module';
import { CompletedModule } from './Completed/completed.module';
import { AuthModule } from './Auth/auth.module';
import { MailService } from './mail/mail.service';
import { ScheduleModule } from './Scheduler/schedule.module';

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHostname = process.env.MONGO_HOSTNAME;
const mongoPort = process.env.MONGO_PORT;
const mongoDb = process.env.MONGO_DB;

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${mongoUsername}:${mongoPassword}@${mongoHostname}:${mongoPort}/${mongoDb}?authSource=admin`,
    ),
    UserModule,
    ChallengeModule,
    TeamModule,
    CategoryModule,
    CompletedModule,
    AuthModule,
    ScheduleModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
