export type CoupleMember = {
  id: string;
  email: string;
};

export type CoupleSummary = {
  id: string;
  partner: CoupleMember;
  members: CoupleMember[];
};

export type CoupleBalance = {
  partner: CoupleMember;
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

export type LinkCoupleRequest = {
  partnerEmail: string;
};
