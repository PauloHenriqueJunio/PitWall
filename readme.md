# PitWall

Aplicação full‑stack para visualizar e explorar telemetria de Fórmula 1. O projeto é composto por:

- Backend em NestJS (v11) com TypeORM e Swagger.
- Frontend em Next.js (v16) App Router.
- Pasta de telemetria com cache de sessões F1 organizada por ano/evento.

## Visão Geral

- **API**: expõe recursos (ex.: `drivers`) e documentação interativa em Swagger.
- **Web App**: interface para consumo dos dados e visualizações.
- **Telemetria**: arquivos `.ff1pkl` em `telemetry/cache/...` estruturados por ano, etapa e sessão.

## Arquitetura

```
PitWall/
├─ backend/             # NestJS + TypeORM + Swagger
│  ├─ src/
│  │  ├─ driver/        # Módulo de pilotos (CRUD)
│  │  └─ main.ts        # Boot da API e Swagger
│  ├─ test/             # Testes e2e (Jest)
│  └─ package.json      # Scripts de execução/testes
├─ frontend/            # Next.js App Router
│  ├─ app/              # Páginas e estilos
│  └─ package.json      # Scripts de execução/build
└─ telemetry/           # Cache de dados F1 por evento/sessão
```

## Pré‑requisitos

- Node.js 18+ (recomendado LTS) e npm.
- Banco PostgreSQL (se for usar TypeORM/DB; configurar via env).
- Windows (ambiente atual), mas funciona em macOS/Linux.

## Configuração

1. Instale dependências:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Variáveis de ambiente (exemplos):

Crie `.env` no `backend/` conforme sua infra de banco:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=pitwall
DB_PASSWORD=pitwall
DB_NAME=pitwall
# PORT opcional (default 3000)
PORT=3000
```

No `frontend/`, se precisar apontar para a API:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

3. Telemetria (opcional):

- Os dados em `telemetry/cache/<ano>/<evento>/<sessão>/` são arquivos `.ff1pkl` (pickle) contendo car data, timing, positions, etc.
- A aplicação básica roda sem eles; ingestão/visualização podem ser adicionadas conforme evolução do projeto.

## Executando

Backend (NestJS):

```bash
cd backend
npm run start:dev
```

- API escuta em `http://localhost:3000` (default).
- Swagger: `http://localhost:3000/api`.

Frontend (Next.js):

```bash
cd frontend
npm run dev
```

Por padrão o Next usa porta 3000. Para evitar conflito com o backend, execute em outra porta ou ele íra colocar na porta 3001.

```bash
npm run dev -- -p 3001
```

Build e produção:

```bash
cd backend
npm run build
npm run start:prod

cd ../frontend
npm run build
npm run start
```

## API: Drivers

Base: `http://localhost:3000/drivers`

- `GET /drivers` — lista todos os pilotos.
- `GET /drivers/:id` — obtém um piloto.
- `POST /drivers` — cria um piloto.
- `PATCH /drivers/:id` — atualiza um piloto.
- `DELETE /drivers/:id` — remove um piloto.

Exemplo `POST /drivers`:

```json
{
  "name": "Max Verstappen",
  "team": "Red Bull Racing",
  "number": 1,
  "country": "Netherlands"
}
```

Modelo (`Driver`):

```ts
id: number
name: string
team: string
number: number
country?: string
```

Documentação interativa: `http://localhost:3000/api`

## Scripts úteis

Backend (`backend/package.json`):

- `start` / `start:dev` / `start:prod`
- `build`, `lint`, `format`
- `test`, `test:e2e`, `test:cov`

Frontend (`frontend/package.json`):

- `dev`, `build`, `start`, `lint`

## Testes

Backend (Jest):

```bash
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

Frontend (lint):

```bash
cd frontend
npm run lint
```

## Desenvolvimento

- Padrões de código: ESLint + Prettier em ambos os projetos.
- Documentação da API via Swagger configurada em `backend/src/main.ts`.
- Módulos adicionais podem seguir o padrão do módulo `driver` (controller, service, dto, entity).

## Próximos Passos

- Ingestão dos arquivos de telemetria `.ff1pkl` e mapeamento para entidades.
- Visualizações avançadas (mapa de posições, gráficos de tempo, status de pista, clima).
- Autenticação/autorização se for expor dashboards restritos.

---

Mantido por PauloHenriqueJunio. Contribuições são bem‑vindas!
