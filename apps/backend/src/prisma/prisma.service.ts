import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma 7 requires a driver `adapter` (or Accelerate URL) when the datasource
 * URL is not embedded in the generated client. We use `@prisma/adapter-pg` + `pg`
 * so `schema.prisma` can keep the datasource block without `url = ...`.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const url = config.get<string>('DATABASE_URL');
    if (!url?.trim()) {
      throw new Error(
        'DATABASE_URL is missing or empty. Set it in backend/.env (see .env.example).',
      );
    }
    super({
      adapter: new PrismaPg({ connectionString: url }),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
