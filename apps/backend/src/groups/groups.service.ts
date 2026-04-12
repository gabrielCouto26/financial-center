import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Group,
  TransactionDirection,
  TransactionType,
  User,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

type GroupMemberRecord = {
  id: string;
  userId: string;
  user: User;
};

type GroupRecord = Group & {
  members: GroupMemberRecord[];
};

export type GroupMemberSummary = {
  id: string;
  email: string;
};

export type GroupSummary = {
  id: string;
  name: string;
  createdByUserId: string;
  memberCount: number;
};

export type GroupDetail = {
  id: string;
  name: string;
  createdByUserId: string;
  members: GroupMemberSummary[];
  createdAt: Date;
};

export type GroupBalanceMember = {
  id: string;
  email: string;
  paid: number;
  share: number;
  net: number;
};

export type GroupSettlement = {
  fromUserId: string;
  toUserId: string;
  amount: number;
};

export type GroupBalanceResponse = {
  group: { id: string; name: string };
  members: GroupBalanceMember[];
  settlements: GroupSettlement[];
};

export type GroupDashboardSummary = {
  totalNet: number;
  groupCount: number;
  items: Array<{
    id: string;
    name: string;
    net: number;
  }>;
};

@Injectable()
export class GroupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async createGroup(userId: string, name: string): Promise<GroupDetail> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new BadRequestException('Group name is required');
    }

    const group = await this.prisma.group.create({
      data: {
        name: trimmedName,
        createdByUserId: userId,
        members: {
          create: [{ userId }],
        },
      },
      include: {
        members: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return this.toDetail(group);
  }

  async listForUser(userId: string): Promise<GroupSummary[]> {
    const groups = await this.prisma.group.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      createdByUserId: group.createdByUserId,
      memberCount: group._count.members,
    }));
  }

  async getGroupDetail(userId: string, groupId: string): Promise<GroupDetail> {
    const group = await this.getRequiredGroupRecord(userId, groupId);
    return this.toDetail(group);
  }

  async addMember(
    userId: string,
    groupId: string,
    memberEmail: string,
  ): Promise<GroupDetail> {
    const group = await this.getRequiredGroupRecord(userId, groupId);
    const member = await this.usersService.findByEmail(memberEmail);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (group.members.some((groupMember) => groupMember.userId === member.id)) {
      throw new ConflictException('User is already a member of this group');
    }

    const updated = await this.prisma.group.update({
      where: { id: groupId },
      data: {
        members: {
          create: [{ userId: member.id }],
        },
      },
      include: {
        members: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return this.toDetail(updated);
  }

  async getRequiredGroupRecord(
    userId: string,
    groupId: string,
  ): Promise<GroupRecord> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!group.members.some((member) => member.userId === userId)) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return group;
  }

  async getBalance(
    userId: string,
    groupId: string,
  ): Promise<GroupBalanceResponse> {
    const group = await this.getRequiredGroupRecord(userId, groupId);
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: TransactionType.GROUP,
        groupId: group.id,
      },
      include: {
        splits: true,
      },
      orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
    });

    const members = group.members.map((member) => ({
      id: member.user.id,
      email: member.user.email,
      paid: 0,
      share: 0,
      net: 0,
    }));
    const byId = new Map(members.map((member) => [member.id, member]));

    for (const transaction of transactions) {
      const amount = Number(transaction.amount);
      const signedAmount =
        transaction.direction === TransactionDirection.INCOME
          ? -amount
          : amount;
      const payer = byId.get(transaction.paidByUserId);
      if (payer) {
        payer.paid += signedAmount;
      }

      for (const split of transaction.splits) {
        const member = byId.get(split.userId);
        if (!member) {
          continue;
        }
        member.share += signedAmount * (Number(split.percentage) / 100);
      }
    }

    const normalizedMembers = members.map((member) => ({
      ...member,
      paid: this.roundCurrency(member.paid),
      share: this.roundCurrency(member.share),
      net: this.roundCurrency(member.paid - member.share),
    }));

    return {
      group: { id: group.id, name: group.name },
      members: normalizedMembers,
      settlements: this.buildSettlements(normalizedMembers),
    };
  }

  async getDashboardSummary(userId: string): Promise<GroupDashboardSummary> {
    const groups = await this.prisma.group.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    if (groups.length === 0) {
      return { totalNet: 0, groupCount: 0, items: [] };
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: TransactionType.GROUP,
        groupId: { in: groups.map((group) => group.id) },
      },
      include: {
        splits: true,
      },
    });

    const netByGroupId = new Map<string, number>();

    for (const transaction of transactions) {
      if (!transaction.groupId) continue;
      const amount = Number(transaction.amount);
      const signedAmount =
        transaction.direction === TransactionDirection.INCOME
          ? -amount
          : amount;

      if (transaction.paidByUserId === userId) {
        netByGroupId.set(
          transaction.groupId,
          (netByGroupId.get(transaction.groupId) ?? 0) + signedAmount,
        );
      }

      const userSplit = transaction.splits.find(
        (split) => split.userId === userId,
      );
      if (userSplit) {
        netByGroupId.set(
          transaction.groupId,
          (netByGroupId.get(transaction.groupId) ?? 0) -
            signedAmount * (Number(userSplit.percentage) / 100),
        );
      }
    }

    const items = groups.map((group) => ({
      id: group.id,
      name: group.name,
      net: this.roundCurrency(netByGroupId.get(group.id) ?? 0),
    }));

    return {
      totalNet: this.roundCurrency(
        items.reduce((sum, group) => sum + group.net, 0),
      ),
      groupCount: groups.length,
      items,
    };
  }

  private buildSettlements(members: GroupBalanceMember[]): GroupSettlement[] {
    const debtors = members
      .filter((member) => member.net < 0)
      .map((member) => ({
        userId: member.id,
        amount: Math.abs(member.net),
      }));
    const creditors = members
      .filter((member) => member.net > 0)
      .map((member) => ({
        userId: member.id,
        amount: member.net,
      }));

    const settlements: GroupSettlement[] = [];
    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      const amount = this.roundCurrency(
        Math.min(debtor.amount, creditor.amount),
      );

      if (amount > 0) {
        settlements.push({
          fromUserId: debtor.userId,
          toUserId: creditor.userId,
          amount,
        });
      }

      debtor.amount = this.roundCurrency(debtor.amount - amount);
      creditor.amount = this.roundCurrency(creditor.amount - amount);

      if (debtor.amount === 0) {
        debtorIndex += 1;
      }
      if (creditor.amount === 0) {
        creditorIndex += 1;
      }
    }

    return settlements;
  }

  private toDetail(group: GroupRecord): GroupDetail {
    return {
      id: group.id,
      name: group.name,
      createdByUserId: group.createdByUserId,
      members: group.members.map((member) => ({
        id: member.user.id,
        email: member.user.email,
      })),
      createdAt: group.createdAt,
    };
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
