# Contexto do Projeto: unv-gelato

Este documento fornece um resumo do projeto para acelerar o desenvolvimento e a assistência.

## Visão Geral

`unv-gelato` é uma aplicação full-stack com:
- **Frontend:** Uma aplicação single-page (SPA) construída com React.
- **Backend:** Um backend Node.js baseado no Parse Server e hospedado no Back4app como Cloud Code.

## Estrutura e Tecnologias

O projeto utiliza uma estrutura monorepo-like com o código-fonte localizado em `src/`.

### Frontend

- **Framework:** React 19 com Vite.
- **Linguagem:** TypeScript (`.tsx`).
- **Estilização:** Tailwind CSS.
- **Raiz do Projeto (Vite):** `src/presentation`.
- **Autenticação:** Login social com Google One Tap.

### Backend

- **Ambiente:** Back4app Cloud Code (Node.js).
- **Framework:** Parse Server.
- **Linguagem:** TypeScript (`.ts`).
- **Módulos:** O código deve ser compilado para **CommonJS** para ser compatível com o ambiente do Back4app.
- **Código Fonte Principal:** `src/infrastructure/cloud/main.ts`.

## Build e Deploy

- **Gerenciador de Pacotes:** `pnpm`.
- **CI/CD:** GitHub Actions, configurado em `.github/workflows/deploy.yml`.
- **Processo:** O workflow instala dependências com `pnpm`, faz o build do frontend (Vite) e do backend (`tsc`), e por fim faz o deploy no Back4app.
- **Cache:** O workflow está otimizado para cachear as dependências do `pnpm`, acelerando o processo de build.

## Comandos Importantes

- `pnpm dev`: Inicia os ambientes de desenvolvimento do frontend e backend simultaneamente.
- `pnpm build`: Executa o build de produção para o frontend e backend.
- `pnpm lint`: Executa o linter no projeto.
- `pnpm start`: Inicia o servidor de produção a partir do código compilado.

## Contexto do Backend (Back4app)

### Implicações para o Desenvolvimento

A principal implicação das restrições do ambiente Back4app é que **qualquer código adicionado ou modificado em `src/infrastructure/cloud/` deve funcionar exclusivamente com os pacotes e versões listados abaixo.** Não é possível adicionar novas dependências do `npm` para o código de nuvem. A lógica deve ser construída levando em conta este cenário limitado.

### Módulos e APIs

- O ambiente do Back4app requer que o código das Cloud Functions seja em formato **CommonJS**.
- Para requisições HTTP, a API `fetch` é a abordagem recomendada e compatível, enquanto `axios` não é suportado.

### Pacotes Permitidos no Ambiente Back4app

O ambiente de Cloud Code do Back4app permite apenas o uso dos seguintes pacotes nas suas respectivas versões:

- `parse-server`: 6.2.0
- `@sendgrid/mail`: 7.7.0
- `aws-sdk`: 2.1390.0
- `body-parser`: 1.20.2
- `braintree`: 3.16.0
- `cookie-parser`: 1.4.6
- `crypto-js`: 4.1.1
- `ejs`: 3.1.9
- `express`: 4.18.2
- `jsonwebtoken`: 9.0.0
- `mailgun-js`: 0.22.0
- `mandrill-api`: 1.0.45
- `mercadopago`: 1.5.16
- `method-override`: 3.0.0
- `moment`: 2.29.4
- `numeral`: 2.0.6
- `parse-cache`: 0.0.13
- `parse-express-cookie-session`: 0.0.3
- `parse-express-https-redirect`: 0.0.1
- `parse-image`: 0.3.0
- `plivo`: 4.49.0
- `pug`: 2.0.4
- `pusher`: 5.1.3
- `stripe`: 12.8.0
- `twilio`: 4.11.2
- `underscore`: 1.13.6
- `xlsx`: 0.18.5
