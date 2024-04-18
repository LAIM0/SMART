import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CompletedSchema } from 'src/Completed/completed.schema';
import { CompletedModule } from 'src/Completed/completed.module';
import { CompletedService } from 'src/Completed/completed.service';
import { ChallengeSchema } from 'src/Challenge/challenge.schema';
import { ChallengeService } from 'src/Challenge/challenge.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: 'Completed', schema: CompletedSchema },
      { name: 'Challenge', schema: ChallengeSchema },
    ]),MailModule
  ],
  providers: [UserService, ChallengeService, CompletedService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
