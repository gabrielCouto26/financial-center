import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type SafeUser = Pick<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(email: string, passwordHash: string): Promise<SafeUser> {
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
      },
    });
    return this.toSafeUser(user);
  }

  toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
