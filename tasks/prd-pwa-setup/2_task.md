# Tarefa 2.0: Criação e Configuração Inicial do PWA (`apps/pwa`)

## Visão Geral

Inicializar o workspace `apps/pwa` com React e Vite, preparando o ambiente de desenvolvimento isolado para a nova interface mobile-first.

<skills>
### Conformidade com Skills

- `execute-task`: Para executar o bootstrap do React+Vite.
- `tester`: Para rodar o setup inicial e validar o build.
</skills>

<rules>
### Conformidade com Rules

- `user_global`: Priorizar TypeScript/Type safety e rodar build/lint no novo workspace após criação.
</rules>

<requirements>
- O workspace `apps/pwa` deve ser gerado utilizando Vite (template React + TS).
- Deve ser referenciado corretamente no `pnpm-workspace.yaml`.
- As dependências devem ser instaladas via pnpm.
- O app deve compilar e rodar independentemente na porta padrão do Vite (ou configurada para não conflitar com o frontend legado).
</requirements>

## Subtarefas

- [ ] 2.1 Criar o diretório `apps/pwa` inicializando com `vite` (template `react-ts`).
- [ ] 2.2 Limpar arquivos boilerplate desnecessários do Vite (ex: logos, css default).
- [ ] 2.3 Configurar o `package.json` do `apps/pwa` para consumir dependências locais se necessário, e ajustar scripts de lint/build.
- [ ] 2.4 Testar o build e a execução local para garantir isolamento.

## Detalhes de Implementação

Consultar a seção "Sequenciamento de Desenvolvimento" (Passo 2) em `techspec.md`. Não implementar funcionalidades de Service Worker ou Tailwind nesta etapa (tarefas futuras).

## Critérios de Sucesso

- O comando `pnpm --filter pwa build` executa sem erros e gera a pasta `dist`.
- O comando `pnpm --filter pwa dev` inicia o servidor corretamente.
- A estrutura inicial do React roda de forma independente sem afetar o app legado.

## Testes da Tarefa

- [x] Testes de unidade (Setup básico do Vitest no projeto, se aplicável, testando a renderização do App.tsx vazio)
- [ ] Testes de integração
- [ ] Testes E2E (se aplicável)

## Arquivos relevantes

- `apps/pwa/package.json`
- `apps/pwa/vite.config.ts`
- `apps/pwa/src/App.tsx`
- `pnpm-workspace.yaml`
