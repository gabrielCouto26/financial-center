import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PaginatedTransactionsResponse,
  TransactionsService,
  TransactionResponse,
} from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
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

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(
    @CurrentUser() user: SafeUser,
    @Param('id') id: string,
  ): Promise<TransactionResponse> {
    return this.transactionsService.findOne(user.id, id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @CurrentUser() user: SafeUser,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<TransactionResponse> {
    return this.transactionsService.update(user.id, id, dto);
  }
}
