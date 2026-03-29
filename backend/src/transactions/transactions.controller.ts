import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PaginatedTransactionsResponse,
  TransactionsService,
  TransactionResponse,
} from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SafeUser } from '../users/users.service';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @CurrentUser() user: SafeUser,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionResponse> {
    return this.transactionsService.create(user.id, dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @CurrentUser() user: SafeUser,
    @Query() query: ListTransactionsQueryDto,
  ): Promise<PaginatedTransactionsResponse> {
    return this.transactionsService.listAccessibleByUser(user.id, query);
  }
}
