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
import { MailModule } from './mail/mail.module';

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
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailModule],
})
export class AppModule {}
