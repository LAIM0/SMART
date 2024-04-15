import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { ChallengeSchema } from './challenge.schema';
import { CompletedService } from 'src/Completed/completed.service';
import { CompletedSchema } from 'src/Completed/completed.schema';
import { UserSchema } from 'src/User/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Challenge', schema: ChallengeSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Completed', schema: CompletedSchema },
    ]),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService, CompletedService],
  exports: [ChallengeService],
})
export class ChallengeModule {}
