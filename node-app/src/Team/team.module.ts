import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamSchema } from './team.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
