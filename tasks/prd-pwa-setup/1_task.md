# Tarefa 1.0: Extração de Módulo Compartilhado (`packages/shared`)

## Visão Geral

Criar o workspace `packages/shared` no monorepo para abrigar tipos TypeScript compartilhados e o cliente HTTP base, extraindo-os do atual `apps/frontend/`.

<skills>
### Conformidade com Skills

- `execute-task`: Para executar esta tarefa.
- `tester`: Para validar os testes unitários após a implementação.
</skills>

<rules>
### Conformidade com Rules

- `user_global`: Priorizar TypeScript/Type safety, manter código idiomático e rodar testes/lint após modificações.
</rules>

<requirements>
- O workspace `packages/shared` deve ser adicionado ao `pnpm-workspace.yaml`.
- Deve possuir um `package.json`, `.npmrc` (se necessário) e `tsconfig.json` base.
- Tipos TypeScript (`user.ts`, `transaction.ts`, etc.) devem ser movidos para este pacote.
- O cliente HTTP (`apiClient.ts`) deve ser refatorado para suportar recuperação assíncrona de tokens, permitindo integração futura com IndexedDB.
</requirements>

## Subtarefas

- [ ] 1.1 Criar estrutura de diretórios para `packages/shared` e arquivos de configuração (`package.json`, `tsconfig.json`).
- [ ] 1.2 Atualizar `pnpm-workspace.yaml` para incluir o novo pacote.
- [ ] 1.3 Mover os arquivos de tipos TypeScript de `apps/frontend/src/types/` para `packages/shared/src/types/`.
- [ ] 1.4 Refatorar e mover a lógica do cliente HTTP (ex: `apps/frontend/src/services/api.ts`) para `packages/shared/src/api/apiClient.ts`.
- [ ] 1.5 Adaptar o client HTTP para que `getToken` seja assíncrono (Promise-based).
- [ ] 1.6 Atualizar os imports no `apps/frontend` e `apps/backend` (se aplicável) para consumir o novo pacote.

## Detalhes de Implementação

Consultar a seção "Interfaces Principais" e "Sequenciamento de Desenvolvimento" (Passo 1) em `techspec.md`.

## Critérios de Sucesso

- O pacote `packages/shared` deve compilar sem erros de TypeScript.
- O projeto atual (`apps/frontend`, `apps/backend`) não deve quebrar após a extração.
- O `apiClient` suporta injeção de funções assíncronas de gerenciamento de token.

## Testes da Tarefa

- [x] Testes de unidade (Validar o comportamento do novo `apiClient` e o uso assíncrono para captação do token)
- [ ] Testes de integração
- [ ] Testes E2E (se aplicável)

## Arquivos relevantes

- `pnpm-workspace.yaml`
- `packages/shared/package.json`
- `packages/shared/tsconfig.json`
- `packages/shared/src/api/apiClient.ts`
- `apps/frontend/src/services/api.ts` (a ser removido/refatorado)
- `apps/frontend/src/types/*` (a serem movidos)
