import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CoupleLink,
  TransactionDirection,
  TransactionType,
  User,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

type CoupleMemberRecord = {
  id: string;
  userId: string;
  user: User;
};

type CoupleLinkRecord = CoupleLink & {
  members: CoupleMemberRecord[];
};

export type CoupleMemberSummary = {
  id: string;
  email: string;
  name: string | null;
};

export type CoupleSummary = {
  id: string;
  partner: CoupleMemberSummary;
  members: CoupleMemberSummary[];
};

export type CoupleLinkResponse = {
  id: string;
  members: CoupleMemberSummary[];
  createdAt: Date;
};

export type CoupleBalanceResponse = {
  partner: CoupleMemberSummary;
  totals: {
    youPaid: number;
    yourShare: number;
    partnerPaid: number;
    partnerShare: number;
  };
  net: number;
  youOwe: number;
  owedToYou: number;
};

export type CoupleDashboardSummary = {
  isLinked: boolean;
  youOwe: number;
  owedToYou: number;
  net: number;
};

@Injectable()
export class CoupleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async linkUsers(
    currentUserId: string,
    partnerEmail: string,
  ): Promise<CoupleLinkResponse> {
    const partner = await this.usersService.findByEmail(partnerEmail);
    if (!partner) {
      throw new NotFoundException('Partner not found');
    }
    if (partner.id === currentUserId) {
      throw new BadRequestException('You cannot link yourself as a partner');
    }

    const memberships = await this.prisma.coupleLinkMember.findMany({
      where: { userId: { in: [currentUserId, partner.id] } },
      select: { userId: true },
    });
    if (memberships.length > 0) {
      throw new ConflictException('One of the users is already linked');
    }

    const couple = await this.prisma.coupleLink.create({
      data: {
        members: {
          create: [{ userId: currentUserId }, { userId: partner.id }],
        },
      },
      include: {
        members: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return this.toLinkResponse(couple);
  }

  async findCoupleSummary(userId: string): Promise<CoupleSummary | null> {
    const couple = await this.findCoupleRecordByUserId(userId);
    if (!couple) {
      return null;
    }
    return this.toSummary(couple, userId);
  }

  async getRequiredCoupleRecord(userId: string): Promise<CoupleLinkRecord> {
    const couple = await this.findCoupleRecordByUserId(userId);
    if (!couple) {
      throw new BadRequestException('User is not linked to a partner');
    }
    if (couple.members.length !== 2) {
      throw new ConflictException('Couple link is not in a valid state');
    }
    return couple;
  }

  async getBalance(userId: string): Promise<CoupleBalanceResponse> {
    const couple = await this.getRequiredCoupleRecord(userId);
    const partner = this.getPartner(couple, userId);
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: TransactionType.COUPLE,
        coupleLinkId: couple.id,
      },
      include: {
        splits: true,
      },
    });

    let youPaid = 0;
    let yourShare = 0;
    let partnerPaid = 0;
    let partnerShare = 0;

    for (const transaction of transactions) {
      const amount = Number(transaction.amount);
      const signedAmount =
        transaction.direction === TransactionDirection.INCOME
          ? -amount
          : amount;

      if (transaction.paidByUserId === userId) {
        youPaid += signedAmount;
      }
      if (transaction.paidByUserId === partner.id) {
        partnerPaid += signedAmount;
      }

      for (const split of transaction.splits) {
        const share = signedAmount * (Number(split.percentage) / 100);
        if (split.userId === userId) {
          yourShare += share;
        }
        if (split.userId === partner.id) {
          partnerShare += share;
        }
      }
    }

    const rounded = {
      youPaid: this.roundCurrency(youPaid),
      yourShare: this.roundCurrency(yourShare),
      partnerPaid: this.roundCurrency(partnerPaid),
      partnerShare: this.roundCurrency(partnerShare),
    };
    const net = this.roundCurrency(rounded.youPaid - rounded.yourShare);

    return {
      partner: {
        id: partner.id,
        email: partner.email,
        name: partner.name,
      },
      totals: rounded,
      net,
      youOwe: net < 0 ? this.roundCurrency(Math.abs(net)) : 0,
      owedToYou: net > 0 ? net : 0,
    };
  }

  async getDashboardSummary(userId: string): Promise<CoupleDashboardSummary> {
    const couple = await this.findCoupleRecordByUserId(userId);
    if (!couple) {
      return {
        isLinked: false,
        youOwe: 0,
        owedToYou: 0,
        net: 0,
      };
    }

    const balance = await this.getBalance(userId);
    return {
      isLinked: true,
      youOwe: balance.youOwe,
      owedToYou: balance.owedToYou,
      net: balance.net,
    };
  }

  private async findCoupleRecordByUserId(
    userId: string,
  ): Promise<CoupleLinkRecord | null> {
    const membership = await this.prisma.coupleLinkMember.findUnique({
      where: { userId },
      include: {
        coupleLink: {
          include: {
            members: {
              include: { user: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    return membership?.coupleLink ?? null;
  }

  private getPartner(couple: CoupleLinkRecord, userId: string): User {
    const partnerMember = couple.members.find(
      (member) => member.userId !== userId,
    );
    if (!partnerMember) {
      throw new ConflictException('Partner not found for current user');
    }
    return partnerMember.user;
  }

  private toSummary(couple: CoupleLinkRecord, userId: string): CoupleSummary {
    const members = couple.members.map((member) => ({
      id: member.user.id,
      email: member.user.email,
      name: member.user.name,
    }));
    const partner = this.getPartner(couple, userId);

    return {
      id: couple.id,
      partner: {
        id: partner.id,
        email: partner.email,
        name: partner.name,
      },
      members,
    };
  }

  private toLinkResponse(couple: CoupleLinkRecord): CoupleLinkResponse {
    return {
      id: couple.id,
      members: couple.members.map((member) => ({
        id: member.user.id,
        email: member.user.email,
        name: member.user.name,
      })),
      createdAt: couple.createdAt,
    };
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
