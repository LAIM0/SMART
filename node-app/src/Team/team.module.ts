import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Team, TeamSchema } from './team.schema';
import { User, UserSchema } from 'src/User/user.schema';
import { CompletedService } from 'src/Completed/completed.service';
import { Completed, CompletedSchema } from 'src/Completed/completed.schema';
import { ChallengeService } from 'src/Challenge/challenge.service';
import { Challenge, ChallengeSchema } from 'src/Challenge/challenge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: User.name, schema: UserSchema },
      { name: Completed.name, schema: CompletedSchema },
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService, CompletedService, ChallengeService],
})
export class TeamModule {}
