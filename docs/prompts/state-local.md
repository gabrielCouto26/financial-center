# Estado do Projeto (State.local.md)

Crie ou atualize o arquivo `State.local.md` na raiz do projeto, contendo o estado atual do desenvolvimento para que futuros agentes de IA se contextualizem rapidamente e gastem menos tokens.

## Objetivo

Gerar um snapshot do estado do projeto que sirva como contexto para novos agentes de IA do Cursor: features implementadas, onde o processo parou e o que falta fazer. Assim, os agentes terão respostas mais precisas e gerarão menos correções.

## Processo

1. **Analise o projeto**:

   - Browse pela estrutura de pastas (`apps/`, `packages/`)
   - Consulte arquivos de documentação existentes (ex.: `docs/CHAT_SUMMARY.md`, `README.md`)
   - Verifique o status do git (`git status`, branch atual)
   - Identifique testes, endpoints, rotas e componentes principais

2. **Identifique features implementadas**:

   - Listar funcionalidades concluídas (ex.: telas, endpoints, hooks, serviços)
   - Incluir referências a arquivos chave e convenções usadas

3. **Identifique onde o desenvolvimento parou**:

   - O que está em progresso (branch, PR, feature incompleta)
   - Próximos passos naturais
   - Pendências técnicas (ex.: endpoints do backend não implementados)

4. **Gere o arquivo** `State.local.md` na raiz do monorepo

## Estrutura Esperada do State.local.md

```markdown
# Estado do Projeto – [Nome do Projeto]

> Última atualização: [data]
> Branch: [nome-da-branch]

## Visão Geral

[1-2 parágrafos descrevendo o que é o projeto e o estado atual em alto nível]

## Features Implementadas

### [Nome da Feature 1]

- **O que foi feito**: [resumo]
- **Arquivos principais**: [paths]
- **Observações**: [convenções, mapeamentos, restrições]

### [Nome da Feature 2]

...

## Onde o Desenvolvimento Parou

- **Em progresso**: [descrição]
- **Próximos passos**: [lista ordenada]
- **Pendências**: [ex.: endpoints não implementados, integrações faltando]

## Endpoints / APIs (Estado Atual)

- **Implementados**: [liste]
- **Não implementados**: [liste, se houver]

## Estrutura de Arquivos Relevantes
```

[caminho simplificado das pastas/arquivos mais importantes]

````

## Comandos Úteis

```bash
# [comandos para build, lint, test]
````

## Convenções e Padrões

- [Convenções de código, testes, rotas, etc.]

```

## Requisitos

- O arquivo deve ser criado em `/State.local.md` (raiz do monorepo)
- Priorize clareza e concisão
- Inclua apenas informações que um agente novo precisaria para retomar o trabalho
- Evite repetir documentação que já existe em outros arquivos (referencie em vez de duplicar)
- Use a data atual em "Última atualização"

## Saída

Crie o arquivo `State.local.md` e, em seguida, confirme ao usuário que foi gerado e onde está localizado.
```
