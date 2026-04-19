import { z } from "zod";
import {
  Category,
  TransactionDirection,
  TransactionType,
} from "../../types/transaction";

const splitSchema = z.object({
  userId: z.string().uuid(),
  percentage: z.coerce.number().positive("Percentage must be positive"),
});

export const transactionSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    amount: z.coerce.number().positive("Amount must be positive"),
    category: z.nativeEnum(Category),
    date: z.string().min(1, "Date is required"),
    type: z.nativeEnum(TransactionType),
    direction: z.nativeEnum(TransactionDirection),
    paidByUserId: z.string().optional(),
    groupId: z.string().optional(),
    participantUserIds: z.array(z.string()).optional(),
    splits: z.array(splitSchema).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type === TransactionType.PERSONAL) {
      return;
    }

    if (!values.paidByUserId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payer is required",
        path: ["paidByUserId"],
      });
    }

    if (values.type === TransactionType.COUPLE) {
      if (values.groupId || values.participantUserIds) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Couple transactions cannot include group fields",
          path: ["groupId"],
        });
      }
      if (values.splits && values.splits.length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Custom couple splits require two participants",
          path: ["splits"],
        });
      }
    }

    if (values.type === TransactionType.GROUP) {
      if (!values.groupId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Group is required",
          path: ["groupId"],
        });
      }
      if (values.participantUserIds && values.splits) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Choose selected members or custom split, not both",
          path: ["participantUserIds"],
        });
      }
      if (values.participantUserIds && values.participantUserIds.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select at least two participants",
          path: ["participantUserIds"],
        });
      }
    }

    if (values.splits) {
      const total = values.splits.reduce(
        (sum, split) => sum + split.percentage,
        0,
      );
      if (Math.abs(total - 100) > 0.001) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Split percentages must total 100",
          path: ["splits"],
        });
      }
    }
  });

export type TransactionFormValues = z.infer<typeof transactionSchema>;
