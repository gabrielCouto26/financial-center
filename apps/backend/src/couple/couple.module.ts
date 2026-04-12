import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CoupleController } from './couple.controller';
import { CoupleService } from './couple.service';

@Module({
  imports: [UsersModule],
  controllers: [CoupleController],
  providers: [CoupleService],
  exports: [CoupleService],
})
export class CoupleModule {}
