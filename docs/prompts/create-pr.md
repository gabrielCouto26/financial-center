---
description: Cria descrição de Pull Request baseado na branch atual (uso: /create-pr [branch_alvo])
---

# create-pr

## Parâmetro (branch alvo)

O usuário pode invocar o comando com o nome da branch para a qual o PR será mergeado: **`/create-pr <branch_alvo>`**

- Exemplo: `/create-pr main` ou `/create-pr develop`.
- **`<branch_alvo>`** é o primeiro argumento que o usuário digitou logo após o comando; use-o como branch base para as comparações.
- Se nenhum argumento for fornecido, use **`main`** como branch alvo.

## Passos obrigatórios

1. **Obter a branch atual:** `git branch --show-current`
2. **Obter a branch alvo:** o parâmetro do comando (ex.: branch_x) ou `main` se não houver parâmetro.
3. **Listar commits que estão na branch atual e não estão na branch alvo:**  
   `git log <branch_alvo>..HEAD --oneline` (e, se útil, `git log <branch_alvo>..HEAD --pretty=format:"%h %s"` para mensagens).
4. **Resumo de arquivos alterados entre as branches:**  
   `git diff <branch_alvo>...HEAD --stat` (e, se necessário, trechos de `git diff <branch_alvo>...HEAD` para detalhar alterações).
5. **Gerar a descrição do PR** com base nesses commits e diffs, no formato abaixo.

You should use the commits and file changes between the current branch and the target branch to create a PR template similar to this:

"""
Descrição
Cria a biblioteca compartilhada @payface-libs/aws-resources-lib para centralizar o gerenciamento de clientes AWS (DynamoDB, S3, SQS, Lambda) e integra nos serviços do monorepo. Atualiza dependências do AWS SDK e adiciona configuração do Tilt para facilitar o desenvolvimento local. PTR-88

Alterações

1. AWS Resources Lib

- Criação da biblioteca @payface-libs/aws-resources-lib em packages/aws-resources-lib para centralizar criação e gerenciamento de clientes AWS.
- Implementa AwsClientFactory com métodos para criar clientes DynamoDB, S3, SQS e Lambda com suporte a X-Ray tracing e configurações otimizadas.
- Exporta utilitários do AWS SDK (DynamoDBClient, S3Client, SQSClient, LambdaClient) e AWS Lambda Powertools (Logger, Metrics, Tracer).
- Suporte a configurações locais (LocalStack), Lambda e Kubernetes com credenciais via IRSA.
- Adiciona SetupClients com instâncias pré-configuradas dos clientes AWS.
- Inclui testes unitários para validação da biblioteca.

2. Integração nos Serviços

- Switch-Core: substitui imports diretos do AWS SDK por @payface-libs/aws-resources-lib em lambda.ts, aws-logger, metrics, tracer, product.service, SecureStorageService, SqsAdapter, DataOnly3dsService e InternalSwitchAsyncResponseSqsService.
- Backend: atualiza package.json para incluir a nova biblioteca.
- Onboarding-Service: atualiza dependências do AWS SDK.
- WebSockets-Gateway: atualiza dependências do AWS SDK.

3. Dependências e Configuração

- Atualiza versões do AWS SDK (@aws-sdk/client-dynamodb, @aws-sdk/client-s3, @aws-sdk/client-sqs, @aws-sdk/client-lambda) para versões mais recentes.
- Adiciona dependências do AWS Lambda Powertools e AWS Crypto Client.
- Atualiza pnpm-lock.yaml com as novas dependências.

Como testar

1. Instalar dependências: executar `pnpm install` na raiz do monorepo para instalar a nova biblioteca e atualizar dependências.
2. Build da biblioteca: executar `pnpm build --filter @payface-libs/aws-resources-lib` para compilar a biblioteca.
3. Testes unitários: executar `pnpm test --filter @payface-libs/aws-resources-lib` para validar a biblioteca.
   """

Important features: the PR description must be in brazilian portuguese. It must have at least these sections: "Descrição", "Alterações" and "Como testar". The output must be in code format to be easier for me to copy and paste.

**Lembrete:** A descrição deve refletir apenas o que mudou entre a branch atual e a branch alvo (a que foi passada como parâmetro ou `main`). Use os comandos git acima para obter commits e diffs reais antes de escrever.

Create a PR description now (using the target branch from the user's input if provided).
