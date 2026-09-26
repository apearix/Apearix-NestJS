import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/v1/admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ operationId: 'get-dashboard-stats' })
  @Get()
  async getStats() {
    return await this.dashboardService.getDashboardOverview();
  }
}
