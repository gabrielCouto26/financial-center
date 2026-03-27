import { Module } from '@nestjs/common';
import { CoupleModule } from '../couple/couple.module';
import { GroupsModule } from '../groups/groups.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TransactionsModule, CoupleModule, GroupsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
