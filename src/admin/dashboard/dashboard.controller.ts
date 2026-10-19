import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@ApiTags('Admin - Dashboard')
@Controller('api/v1/admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'get-dashboard-stats', operationId: 'get-dashboard-stats' })
  @Get()
  async getStats() {
    return await this.dashboardService.getDashboardOverview();
  }
}
