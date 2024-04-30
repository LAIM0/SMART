// scheduler.controller.ts
import { Controller, Post } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('/trigger')
  async triggerCron(): Promise<string> {
    await this.schedulerService.scheduleDailyUpdates();
    await this.schedulerService.scheduleWeeklyUpdates();
    await this.schedulerService.scheduleMonthlyUpdates();
    return 'Cron triggered successfully';
  }
}
