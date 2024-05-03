import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';

@ApiTags('Scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('/trigger')
  @ApiOperation({
    summary: 'Trigger all scheduled cron jobs',
    description: 'Triggers the scheduling of daily, weekly, and monthly updates.'
  })
  @ApiResponse({
    status: 200,
    description: 'Cron triggered successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - could not trigger cron jobs'
  })
  async triggerCron(): Promise<string> {
    try {
      await this.schedulerService.scheduleDailyUpdates();
      await this.schedulerService.scheduleWeeklyUpdates();
      await this.schedulerService.scheduleMonthlyUpdates();
      return 'Cron triggered successfully';
    } catch (error) {
      throw new Error('Error triggering cron jobs');
    }
  }
}
