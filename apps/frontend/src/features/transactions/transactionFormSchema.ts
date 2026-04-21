import { z } from "zod";
import {
  Category,
  TransactionDirection,
  TransactionType,
} from "../../types/transaction";

const splitSchema = z.object({
  userId: z.string().uuid(),
  percentage: z.coerce.number().positive("A porcentagem deve ser positiva"),
});

export const transactionSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    amount: z.coerce.number().positive("O valor deve ser positivo"),
    category: z.nativeEnum(Category),
    date: z.string().min(1, "A data é obrigatória"),
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
        message: "Quem pagou é obrigatório",
        path: ["paidByUserId"],
      });
    }

    if (values.type === TransactionType.COUPLE) {
      if (values.groupId || values.participantUserIds) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Transações do casal não podem incluir campos de grupo",
          path: ["groupId"],
        });
      }
      if (values.splits && values.splits.length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Divisões personalizadas do casal exigem dois participantes",
          path: ["splits"],
        });
      }
    }

    if (values.type === TransactionType.GROUP) {
      if (!values.groupId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O grupo é obrigatório",
          path: ["groupId"],
        });
      }
      if (values.participantUserIds && values.splits) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Escolha membros selecionados ou divisão personalizada, não os dois",
          path: ["participantUserIds"],
        });
      }
      if (values.participantUserIds && values.participantUserIds.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione pelo menos dois participantes",
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
          message: "A soma das porcentagens deve totalizar 100",
          path: ["splits"],
        });
      }
    }
  });

export type TransactionFormValues = z.infer<typeof transactionSchema>;
