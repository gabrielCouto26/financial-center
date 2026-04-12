import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionDirection } from '@prisma/client';
import { GroupsService } from './groups.service';

describe('GroupsService', () => {
  const prisma = {
    group: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
    },
  };

  const usersService = {
    findByEmail: jest.fn(),
  };

  let service: GroupsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new GroupsService(prisma as never, usersService as never);
  });

  it('creates a group and inserts the creator as a member', async () => {
    prisma.group.create.mockResolvedValue({
      id: 'group-id',
      name: 'Trip',
      createdByUserId: 'user-id',
      createdAt: new Date('2026-03-27T00:00:00.000Z'),
      members: [
        {
          userId: 'user-id',
          user: { id: 'user-id', email: 'user@example.com' },
        },
      ],
    });

    await expect(service.createGroup('user-id', 'Trip')).resolves.toMatchObject(
      {
        id: 'group-id',
        name: 'Trip',
        createdByUserId: 'user-id',
        members: [{ id: 'user-id', email: 'user@example.com' }],
      },
    );
  });

  it('lists only groups where the user is a member', async () => {
    prisma.group.findMany.mockResolvedValue([
      {
        id: 'group-id',
        name: 'Trip',
        createdByUserId: 'user-id',
        _count: { members: 3 },
      },
    ]);

    await expect(service.listForUser('user-id')).resolves.toEqual([
      {
        id: 'group-id',
        name: 'Trip',
        createdByUserId: 'user-id',
        memberCount: 3,
      },
    ]);
  });

  it('rejects non-members reading a group', async () => {
    prisma.group.findUnique.mockResolvedValue({
      id: 'group-id',
      members: [
        {
          userId: 'other-id',
          user: { id: 'other-id', email: 'x@example.com' },
        },
      ],
    });

    await expect(
      service.getGroupDetail('user-id', 'group-id'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects duplicate group members', async () => {
    prisma.group.findUnique.mockResolvedValue({
      id: 'group-id',
      name: 'Trip',
      createdByUserId: 'user-id',
      createdAt: new Date(),
      members: [
        {
          userId: 'user-id',
          user: { id: 'user-id', email: 'user@example.com' },
        },
        {
          userId: 'friend-id',
          user: { id: 'friend-id', email: 'friend@example.com' },
        },
      ],
    });
    usersService.findByEmail.mockResolvedValue({
      id: 'friend-id',
      email: 'friend@example.com',
    });

    await expect(
      service.addMember('user-id', 'group-id', 'friend@example.com'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects unknown member emails', async () => {
    prisma.group.findUnique.mockResolvedValue({
      id: 'group-id',
      name: 'Trip',
      createdByUserId: 'user-id',
      createdAt: new Date(),
      members: [
        {
          userId: 'user-id',
          user: { id: 'user-id', email: 'user@example.com' },
        },
      ],
    });
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.addMember('user-id', 'group-id', 'missing@example.com'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('calculates balances and settlements for a group', async () => {
    prisma.group.findUnique.mockResolvedValue({
      id: 'group-id',
      name: 'Trip',
      createdByUserId: 'user-id',
      createdAt: new Date(),
      members: [
        { userId: 'user-a', user: { id: 'user-a', email: 'a@example.com' } },
        { userId: 'user-b', user: { id: 'user-b', email: 'b@example.com' } },
        { userId: 'user-c', user: { id: 'user-c', email: 'c@example.com' } },
      ],
    });
    prisma.transaction.findMany.mockResolvedValue([
      {
        amount: 300,
        direction: TransactionDirection.EXPENSE,
        paidByUserId: 'user-a',
        splits: [
          { userId: 'user-a', percentage: 40 },
          { userId: 'user-b', percentage: 30 },
          { userId: 'user-c', percentage: 30 },
        ],
      },
    ]);

    await expect(service.getBalance('user-a', 'group-id')).resolves.toEqual({
      group: { id: 'group-id', name: 'Trip' },
      members: [
        {
          id: 'user-a',
          email: 'a@example.com',
          paid: 300,
          share: 120,
          net: 180,
        },
        { id: 'user-b', email: 'b@example.com', paid: 0, share: 90, net: -90 },
        { id: 'user-c', email: 'c@example.com', paid: 0, share: 90, net: -90 },
      ],
      settlements: [
        { fromUserId: 'user-b', toUserId: 'user-a', amount: 90 },
        { fromUserId: 'user-c', toUserId: 'user-a', amount: 90 },
      ],
    });
  });

  it('builds dashboard group summary items with direction-aware net values', async () => {
    prisma.group.findMany.mockResolvedValue([
      {
        id: 'group-a',
        name: 'Trip',
        members: [{ userId: 'user-id' }, { userId: 'friend-id' }],
      },
      {
        id: 'group-b',
        name: 'House',
        members: [{ userId: 'user-id' }, { userId: 'roommate-id' }],
      },
    ]);
    prisma.transaction.findMany.mockResolvedValue([
      {
        groupId: 'group-a',
        amount: 200,
        direction: TransactionDirection.EXPENSE,
        paidByUserId: 'user-id',
        splits: [
          { userId: 'user-id', percentage: 50 },
          { userId: 'friend-id', percentage: 50 },
        ],
      },
      {
        groupId: 'group-b',
        amount: 100,
        direction: TransactionDirection.INCOME,
        paidByUserId: 'user-id',
        splits: [
          { userId: 'user-id', percentage: 50 },
          { userId: 'roommate-id', percentage: 50 },
        ],
      },
    ]);

    await expect(service.getDashboardSummary('user-id')).resolves.toEqual({
      totalNet: 50,
      groupCount: 2,
      items: [
        { id: 'group-a', name: 'Trip', net: 100 },
        { id: 'group-b', name: 'House', net: -50 },
      ],
    });
  });

  it('treats group income as reducing the receiver net position', async () => {
    prisma.group.findUnique.mockResolvedValue({
      id: 'group-id',
      name: 'Trip',
      createdByUserId: 'user-id',
      createdAt: new Date(),
      members: [
        { userId: 'user-a', user: { id: 'user-a', email: 'a@example.com' } },
        { userId: 'user-b', user: { id: 'user-b', email: 'b@example.com' } },
      ],
    });
    prisma.transaction.findMany.mockResolvedValue([
      {
        amount: 100,
        direction: TransactionDirection.INCOME,
        paidByUserId: 'user-a',
        splits: [
          { userId: 'user-a', percentage: 50 },
          { userId: 'user-b', percentage: 50 },
        ],
      },
    ]);

    await expect(service.getBalance('user-a', 'group-id')).resolves.toEqual({
      group: { id: 'group-id', name: 'Trip' },
      members: [
        {
          id: 'user-a',
          email: 'a@example.com',
          paid: -100,
          share: -50,
          net: -50,
        },
        {
          id: 'user-b',
          email: 'b@example.com',
          paid: 0,
          share: -50,
          net: 50,
        },
      ],
      settlements: [{ fromUserId: 'user-a', toUserId: 'user-b', amount: 50 }],
    });
  });
});
