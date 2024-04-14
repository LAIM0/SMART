// scheduler.service.ts
import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { ChallengeService } from'src/Challenge/challenge.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/User/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private challengeService: ChallengeService
  ) {}

  async scheduleDailyUpdates(): Promise<void> {
    cron.schedule('1 0 * * *', async () => {
      this.challengeService.updateDailyChallenges();
    });
  }
  async scheduleWeeklyUpdates(): Promise<void> {
    cron.schedule('1 0 * * 0', async () => {
      this.challengeService.updateWeeklyChallenges();
    });
  }
  async scheduleMonthlyUpdates(): Promise<void> {
    cron.schedule('1 0 1 * *', async () => {
      this.challengeService.updateMonthlyChallenges();
    });
  }
}

