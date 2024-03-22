import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { ChallengeSchema } from './challenge.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }])],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
