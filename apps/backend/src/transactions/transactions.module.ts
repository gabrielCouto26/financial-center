import { Module } from '@nestjs/common';
import { CoupleModule } from '../couple/couple.module';
import { GroupsModule } from '../groups/groups.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [CoupleModule, GroupsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
