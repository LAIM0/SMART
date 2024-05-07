import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { ChallengeService } from 'src/Challenge/challenge.service';
import { ChallengeModule } from 'src/Challenge/challenge.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, ChallengeSchema } from 'src/Challenge/challenge.schema';
import { CompletedSchema } from 'src/Completed/completed.schema';
import { UserSchema } from 'src/User/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Completed', schema: CompletedSchema },
      { name: 'User', schema: UserSchema },
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, ChallengeService],
  exports: [SchedulerService],
})
export class ScheduleModule {}
