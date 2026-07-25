# Tarefa 3.0: Implementação da Camada de Persistência e Integração API

## Visão Geral

Integrar o `localForage` (IndexedDB) no `apps/pwa` para persistência offline de sessão (tokens e estado mínimo do usuário) e interligar com o cliente HTTP de `packages/shared`.

<skills>
### Conformidade com Skills

- `execute-task`: Para implementação dos serviços e integrações.
- `tester`: Para executar os testes da camada assíncrona.
</skills>

<rules>
### Conformidade com Rules

- `user_global`: Código seguro sem vazamento de secrets, Type Safety total nas interfaces.
</rules>

<requirements>
- Utilizar bibliotecas (como `localForage`) para encapsular o acesso ao IndexedDB.
- Criar a interface `StorageService` para gerenciamento de `AuthToken` e `UserState`.
- Instanciar o `ApiClientConfig` do `packages/shared` utilizando a recuperação assíncrona do IndexedDB.
- Garantir fallback/tratamento de erro para casos de falha de I/O no armazenamento local.
</requirements>

## Subtarefas

- [ ] 3.1 Instalar o `localforage` em `apps/pwa`.
- [ ] 3.2 Implementar o serviço `apps/pwa/src/services/storage.ts` aderente à interface `StorageService`.
- [ ] 3.3 Inicializar e exportar o cliente da API instanciado com as funções de obter e limpar tokens de forma assíncrona (do `StorageService`).
- [ ] 3.4 Escrever testes de unidade mockando o `localforage` e a API.

## Detalhes de Implementação

Consultar a seção "Interfaces Principais" e "Sequenciamento de Desenvolvimento" (Passo 3) em `techspec.md`.

## Critérios de Sucesso

- O token de sessão é guardado e recuperado do IndexedDB.
- O client da API usa esse token assíncrono sem travar a thread principal.
- Cobertura de testes unitários para a camada de persistência.

## Testes da Tarefa

- [x] Testes de unidade (Mockando o client para verificar fallback, falhas de I/O e decodificação do estado)
- [ ] Testes de integração
- [ ] Testes E2E (se aplicável)

## Arquivos relevantes

- `apps/pwa/src/services/storage.ts`
- `apps/pwa/src/services/api.ts` (ou local de instanciação do client)
- `apps/pwa/package.json`
