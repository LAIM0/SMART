import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompletedService } from './completed.service';
import { CompletedController } from './completed.controller';
import { CompletedSchema } from './completed.schema';
import { UserSchema } from 'src/User/user.schema';
import { ChallengeModule } from 'src/Challenge/challenge.module';
import { ChallengeService } from 'src/Challenge/challenge.service';
import { Challenge, ChallengeSchema } from 'src/Challenge/challenge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Completed', schema: CompletedSchema },
      { name: 'User', schema: UserSchema },
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
  ],
  controllers: [CompletedController],
  providers: [CompletedService, ChallengeService],
  exports: [CompletedService],
})
export class CompletedModule {}
