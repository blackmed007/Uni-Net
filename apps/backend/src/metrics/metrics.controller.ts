import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('summary')
  async getSummaryData() {
    return this.metricsService.getSummaryData();
  }

  @Get('user-distribution')
  async getUserDistributionData() {
    return this.metricsService.getUserDistributionData();
  }
  @Get('recent-activity')
  async getRecentActivityData() {
    return this.metricsService.getRecentActivityData();
  }

  @Get('activity-overview')
  async getMonthlyActivity() {
    return this.metricsService.getActivityOverviewData();
  }
  @Get('engagement-overview')
  async getMonthlyEngagement() {
    return this.metricsService.getEngagementOverview();
  }
}
