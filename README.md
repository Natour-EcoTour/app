## Como iniciar o aplicativo (desenvolvimento)

Este documento explica como configurar o ambiente de desenvolvimento, instalar dependências, executar o aplicativo localmente e descreve a estrutura de pastas do projeto.

### Pré-requisitos

- Node.js (recomenda-se v18+)
- npm ou yarn
  -- Expo CLI (não é necessário instalar globalmente): prefira usar `npx expo` (ex.: `npx expo start`).
- Android Studio (se for rodar no emulador Android) ou um dispositivo físico com depuração habilitada

> Observação: o projeto usa Expo e `expo-dev-client` para builds de desenvolvimento. Os comandos abaixo assumem que você usará o terminal do sistema (PowerShell no Windows).

### Instalação

1. Clone o repositório ou abra a pasta do projeto.

2. Instale dependências:

```powershell
# usando npm
npm install

# ou usando yarn
yarn install
```

### Scripts úteis (do `package.json`)

    Você também pode executar diretamente com `npx expo start`.
    Você também pode executar diretamente com `npx expo start --android`.
    Você também pode executar diretamente com `npx expo start --ios`.
    Você também pode executar diretamente com `npx expo start --web`.

- `npm run reset-project` — script customizado `node ./scripts/reset-project.js` (verificar o conteúdo do script para detalhes).
- `npm run test` — executa Jest em watch mode.
- `npm run lint` / `npm run lint:fix` — executa ESLint.
- `npm run format` / `npm run format:check` — executa Prettier.

  (ou `npx expo start`).

### Executando o aplicativo (passo a passo)

    (ou `npx expo start --android`).

1. Instale dependências: `npm install`.
2. Inicie o Metro/Expo: `npm run start`.
3. Para Android: conecte um dispositivo ou inicie um emulador e execute `npm run android`.
4. Para web: execute `npm run web`.

Usando `expo-dev-client`/builds customizadas: se você precisar testar APIs nativas que não estão no cliente Go do Expo, siga o fluxo de criação de um dev client com `eas build`/`eas dev` (ver `eas.json`).
(ou `npx expo start`)

### Estrutura de pastas (resumo)

Abaixo estão as pastas principais e uma descrição do que cada uma contém / faz. Alguns arquivos importantes também são anotados.

- `assets/` — imagens, fontes e outros ativos estáticos usados pelo app.

  - `fonts/` — fontes customizadas (ex.: `SpaceMono-Regular.ttf`).
  - `icons/`, `images/`, `modalImages/`, `points/` — coleções de imagens e ícones.

- `services/` — lógica de acesso a API e serviços separados por domínio. Ex.:

  - `apiClient.ts` — cliente HTTP (provavelmente o axios) configurado para comunicação com o backend.
  - `auth/` — serviços de autenticação (`authService.ts`, `sendForgotPassword.ts`, `updateForgotPassword.ts`).
  - `map/` — serviços relacionados ao mapa e pontos (`mapPoints.ts`, `mapPointDetailsService.ts`, `addViewService.ts`).
  - `photos/` — upload, delete e manipulação de fotos (`addPhotoService.ts`, `deletePhotoService.ts`, `photoService.ts`, etc.).
  - `points/` — criação, atualização, busca e gerenciamento de pontos (`createPointService.ts`, `updatePointService.ts`, `searchPoint.ts`, `getMyPointsService.ts`, `addReviewService.ts`, etc.).
  - `singUp/` — serviços relacionados ao cadastro e verificação (`createAccountService.ts`, `sendVerificationCode.ts`, `verifyCodeAndRegister.ts`).
  - `terms/` — `termsService.ts` — possivelmente busca/armazenamento dos termos de uso.
  - `user/` — gerenciamento de usuário (`myInfoService.ts`, `updateUserService.ts`, `changePasswordService.ts`, `deleteUserService.ts`).

- `src/` — código fonte do app (React/React Native + Expo Router).

  - `app/` — entradas e telas do Expo Router (ex.: `_layout.tsx`, `index.tsx`). As rotas podem estar organizadas em subpastas com parênteses como `(auth)`, `(main)`, `(tabs)`, `(terms)` para agrupar rotas.
  - `components/` — componentes reutilizáveis (Inputs, Modais, Botões, Carousels, etc.). Exemplos: `LoginButton/`, `ImageCarousel/`, `AddReview/`, `SearchPointInput/`.
  - `utils/` — utilitários e helpers (formatadores, funções utilitárias, hooks). Procure por funções compartilhadas aqui.
  - `validations/` — esquemas de validação (possivelmente usando `yup`).

- Arquivos de configuração na raiz:
  - `app.config.ts` — configuração do Expo (app.json equivalente). Pode referenciar variáveis de ambiente.
  - `eas.json` — configuração do EAS Build.
  - `tsconfig.json` — configuração do TypeScript.
  - `package.json` — scripts e dependências (consultado para os comandos acima).
  - `README.md` — documentação geral do projeto.

### Troubleshooting comum

- Erro de cache / Metro: execute `npm run reset-project` (veja `scripts/reset-project.js`) ou `expo start -c`.
- Problemas com dependências nativas: rode `npx pod-install` dentro de `ios/` em macOS após instalar pacotes que alteram pods.
- Erros de permissão ao acessar APIs do dispositivo: verifique as permissões no `app.json`/`app.config.ts` e no dispositivo/emulador.
