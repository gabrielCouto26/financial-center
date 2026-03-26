import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CoupleService } from './couple.service';

describe('CoupleService', () => {
  const usersService = {
    findByEmail: jest.fn(),
  };

  const prisma = {
    coupleLinkMember: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    coupleLink: {
      create: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
    },
  };

  let service: CoupleService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new CoupleService(prisma as never, usersService as never);
  });

  it('links two available users', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'partner-id',
      email: 'partner@example.com',
    });
    prisma.coupleLinkMember.findMany.mockResolvedValue([]);
    prisma.coupleLink.create.mockResolvedValue({
      id: 'couple-id',
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      members: [
        {
          userId: 'user-id',
          user: { id: 'user-id', email: 'user@example.com' },
        },
        {
          userId: 'partner-id',
          user: { id: 'partner-id', email: 'partner@example.com' },
        },
      ],
    });

    const result = await service.linkUsers('user-id', 'partner@example.com');

    expect(result).toEqual({
      id: 'couple-id',
      createdAt: new Date('2026-03-26T00:00:00.000Z'),
      members: [
        { id: 'user-id', email: 'user@example.com' },
        { id: 'partner-id', email: 'partner@example.com' },
      ],
    });
  });

  it('rejects self-linking', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
    });

    await expect(
      service.linkUsers('user-id', 'user@example.com'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects unknown partner emails', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.linkUsers('user-id', 'missing@example.com'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects linking when either user is already linked', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'partner-id',
      email: 'partner@example.com',
    });
    prisma.coupleLinkMember.findMany.mockResolvedValue([
      { userId: 'partner-id' },
    ]);

    await expect(
      service.linkUsers('user-id', 'partner@example.com'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('calculates couple balance from shared transactions', async () => {
    prisma.coupleLinkMember.findUnique.mockResolvedValue({
      coupleLink: {
        id: 'couple-id',
        members: [
          {
            userId: 'user-id',
            user: { id: 'user-id', email: 'user@example.com' },
          },
          {
            userId: 'partner-id',
            user: { id: 'partner-id', email: 'partner@example.com' },
          },
        ],
      },
    });
    prisma.transaction.findMany.mockResolvedValue([
      {
        amount: 200,
        paidByUserId: 'user-id',
        splits: [
          { userId: 'user-id', percentage: 50 },
          { userId: 'partner-id', percentage: 50 },
        ],
      },
      {
        amount: 90,
        paidByUserId: 'partner-id',
        splits: [
          { userId: 'user-id', percentage: 40 },
          { userId: 'partner-id', percentage: 60 },
        ],
      },
    ]);

    await expect(service.getBalance('user-id')).resolves.toEqual({
      partner: { id: 'partner-id', email: 'partner@example.com' },
      totals: {
        youPaid: 200,
        yourShare: 136,
        partnerPaid: 90,
        partnerShare: 154,
      },
      net: 64,
      youOwe: 0,
      owedToYou: 64,
    });
  });
});
