import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SafeUser } from '../users/users.service';
import { LinkCoupleDto } from './dto/link-couple.dto';
import {
  CoupleBalanceResponse,
  CoupleLinkResponse,
  CoupleService,
  CoupleSummary,
} from './couple.service';

@Controller('couple')
@UseGuards(AuthGuard('jwt'))
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}

  @Post('link')
  link(
    @CurrentUser() user: SafeUser,
    @Body() dto: LinkCoupleDto,
  ): Promise<CoupleLinkResponse> {
    return this.coupleService.linkUsers(user.id, dto.partnerEmail);
  }

  @Get()
  findCurrentCouple(
    @CurrentUser() user: SafeUser,
  ): Promise<CoupleSummary | null> {
    return this.coupleService.findCoupleSummary(user.id);
  }

  @Get('balance')
  balance(@CurrentUser() user: SafeUser): Promise<CoupleBalanceResponse> {
    return this.coupleService.getBalance(user.id);
  }
}
