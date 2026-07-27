export type GroupMember = {
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
  members: GroupMember[];
  createdAt: string;
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

export type GroupBalance = {
  group: {
    id: string;
    name: string;
  };
  members: GroupBalanceMember[];
  settlements: GroupSettlement[];
};
