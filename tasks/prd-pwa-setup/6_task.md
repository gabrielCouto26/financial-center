# Tarefa 6.0: Testes E2E de Instalação e Uso Offline (Playwright)

## Visão Geral

Implementar testes end-to-end com Playwright para validar a instalação (PWA), caching do Service Worker e a renderização do App Shell em modo offline utilizando IndexedDB.

<skills>
### Conformidade com Skills

- `execute-task`: Para escrita dos cenários E2E.
- `tester`: Ferramenta principal para rodar Playwright em CI/local.
</skills>

<rules>
### Conformidade com Rules

- `user_global`: Testes rigorosos e automação via scripts, não commitar sem passar os pipelines.
</rules>

<requirements>
- Configuração básica do `@playwright/test` dentro do `apps/pwa`.
- Cenário provando que a tag manifest está presente e os assets vitais são guardados em cache.
- Cenário de acesso com a rede desligada (offline mode), verificando que a rota não retorna o erro clássico de dinossauro, mas sim renderiza a UI (esqueleto) captando informações locais temporárias.
</requirements>

## Subtarefas

- [ ] 6.1 Instalar `@playwright/test` em `apps/pwa`.
- [ ] 6.2 Criar script e diretório e2e (ex: `apps/pwa/tests/`).
- [ ] 6.3 Escrever Teste 1: Verificar se manifest existe e Service Worker registra com sucesso.
- [ ] 6.4 Escrever Teste 2: Inicializar com *offline mode* emulado e confirmar que um componente específico do App Shell (ex: Skeleton) está visível na tela.
- [ ] 6.5 Ajustar scripts de package.json para rodar os testes localmente (`test:e2e`).

## Detalhes de Implementação

Consultar a seção "Abordagem de Testes" (Testes de E2E) e "Sequenciamento de Desenvolvimento" (Passo 6) em `techspec.md`.

## Critérios de Sucesso

- A suite E2E roda com sucesso.
- A aplicação comprova a capacidade offline inicial sem erros do navegador (offline first).

## Testes da Tarefa

- [ ] Testes de unidade
- [ ] Testes de integração
- [x] Testes E2E (Execução nativa desta tarefa)

## Arquivos relevantes

- `apps/pwa/playwright.config.ts`
- `apps/pwa/package.json`
- `apps/pwa/tests/pwa.spec.ts`
