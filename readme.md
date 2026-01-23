# 🏎️ PitWall

**PitWall** é uma aplicação full-stack completa para visualização e análise de telemetria de Fórmula 1. O sistema permite acompanhar corridas, qualificações, pilotos e voltas em tempo real, com gráficos detalhados e interface moderna inspirada no visual da F1.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Executando o Projeto](#-executando-o-projeto)
- [API REST](#-api-rest)
- [Frontend - Interface Web](#-frontend---interface-web)
- [Telemetria e Importação de Dados](#-telemetria-e-importação-de-dados)
- [Docker](#-docker)
- [Scripts Úteis](#-scripts-úteis)
- [Testes](#-testes)
- [Desenvolvimento](#-desenvolvimento)
- [Tecnologias](#-tecnologias)
- [Contribuindo](#-contribuindo)

## 🎯 Visão Geral

PitWall é uma plataforma completa que combina:

- **Backend robusto** em NestJS com TypeORM e documentação Swagger
- **Frontend moderno** em Next.js 15 com App Router e design responsivo
- **Integração com FastF1** para importação de dados reais de telemetria
- **Visualizações avançadas** com gráficos interativos usando Recharts
- **Banco de dados PostgreSQL** para armazenamento de dados estruturados

## ✨ Funcionalidades

### 🏁 Calendário de Corridas
- Visualização completa do calendário da temporada
- Listagem de todas as corridas com data, localização e rodada
- Navegação rápida para detalhes de cada GP
- Design inspirado no visual oficial da F1

### 🏆 Detalhes de Corridas
- Visualização de resultados de corrida e qualificação
- Alternância entre modos RACE e QUALIFYING
- Classificação automática baseada em:
  - Posição final (corrida)
  - Melhor tempo (qualificação)
  - Voltas completadas
- Identificação visual de:
  - DNS (Did Not Start)
  - DNF (Did Not Finish)
- Cores das equipes para fácil identificação

### 👨‍🏁 Análise de Pilotos
- Página dedicada para cada piloto em cada corrida
- Gráfico de evolução de tempo por volta
- Estatísticas detalhadas:
  - Voltas completadas
  - Melhor volta
  - Posição final
  - Tempos setoriais (quando disponível)
- Visualização de todas as voltas com tempo e posição
- Alternância entre dados de corrida e qualificação

### 📊 API REST Completa

#### Pilotos (Drivers)
- Gerenciamento completo de pilotos (CRUD)
- Informações: nome, equipe, número, país
- Relacionamento com voltas realizadas

#### Corridas (Races)
- Gerenciamento de eventos da temporada
- Dados: nome, rodada, localização, data, ano
- Relacionamento com voltas dos pilotos

#### Voltas (Laps)
- Registro detalhado de cada volta
- Dados: número da volta, posição, tempo, setores
- Tipo de sessão (RACE/QUALY)
- Relacionamento com piloto e corrida

### 🔄 Importação de Dados

#### Scripts Python com FastF1
- `import_drivers.py`: Importa pilotos automaticamente
- `import_calendar.py`: Importa calendário da temporada
- `import_season.py`: Importação completa de dados da temporada
- Integração direta com a API do backend

### 📈 Visualizações e Gráficos
- Gráfico de linha mostrando evolução de tempo por volta
- Sistema de tooltip interativo
- Domínio automático do eixo Y para melhor visualização
- Animações suaves e responsivas
- Tratamento de dados inválidos

## 🏗️ Arquitetura

```
PitWall/
├─ backend/                    # API NestJS
│  ├─ src/
│  │  ├─ driver/              # Módulo de pilotos
│  │  │  ├─ driver.controller.ts
│  │  │  ├─ driver.service.ts
│  │  │  ├─ driver.module.ts
│  │  │  ├─ entities/
│  │  │  │  └─ driver.entity.ts
│  │  │  └─ dto/
│  │  ├─ races/               # Módulo de corridas
│  │  │  ├─ races.controller.ts
│  │  │  ├─ races.service.ts
│  │  │  ├─ races.module.ts
│  │  │  ├─ entities/
│  │  │  │  └─ race.entity.ts
│  │  │  └─ dto/
│  │  ├─ laps/                # Módulo de voltas
│  │  │  ├─ laps.controller.ts
│  │  │  ├─ laps.service.ts
│  │  │  ├─ laps.module.ts
│  │  │  ├─ entities/
│  │  │  │  └─ lap.entity.ts
│  │  │  └─ dto/
│  │  ├─ app.module.ts
│  │  └─ main.ts              # Configuração Swagger
│  └─ package.json
├─ frontend/                   # App Next.js
│  ├─ app/
│  │  ├─ page.tsx             # Calendário de corridas
│  │  ├─ races/
│  │  │  └─ [id]/
│  │  │     ├─ page.tsx       # Detalhes da corrida
│  │  │     └─ driver/
│  │  │        └─ [driverId]/
│  │  │           └─ page.tsx # Análise do piloto
│  │  ├─ layout.tsx
│  │  └─ globals.css
│  ├─ public/                 # Assets estáticos
│  └─ package.json
├─ telemetry/                  # Scripts de telemetria
│  ├─ import_drivers.py       # Importa pilotos
│  ├─ import_calendar.py      # Importa calendário
│  ├─ import_season.py        # Importação completa
│  └─ test_f1.py             # Testes FastF1
├─ docker-compose.yaml        # PostgreSQL + PgAdmin
└─ package.json               # Dependências root
```

## 🔧 Pré-requisitos

- **Node.js** 18+ (recomendado LTS)
- **npm** ou **yarn**
- **PostgreSQL** 15+ (ou Docker)
- **Python** 3.8+ (para scripts de telemetria)
- **pip** (gerenciador de pacotes Python)

### Dependências Python (Telemetria)
```bash
pip install fastf1 requests
```

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/PauloHenriqueJunio/PitWall.git
cd PitWall
```

### 2. Instale dependências do Backend
```bash
cd backend
npm install
```

### 3. Instale dependências do Frontend
```bash
cd ../frontend
npm install
```

### 4. Configure o banco de dados

#### Opção A: Docker (Recomendado)
```bash
# Na raiz do projeto
docker-compose up -d
```

Isso iniciará:
- **PostgreSQL** na porta 5432
- **PgAdmin** na porta 8080 (acesse em http://localhost:8080)
  - Email: `admin@admin.com`
  - Senha: `admin`

#### Opção B: PostgreSQL local
Configure sua instância PostgreSQL e ajuste o `.env` conforme necessário.

### 5. Configure variáveis de ambiente

**Backend** (`backend/.env`):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin_password
DB_NAME=pitwall_db
PORT=3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚀 Executando o Projeto

### Backend (API NestJS)
```bash
cd backend
npm run start:dev
```
- API disponível em: `http://localhost:3000`
- Documentação Swagger: `http://localhost:3000/api`

### Frontend (App Next.js)
```bash
cd frontend
npm run dev
```
- Aplicação disponível em: `http://localhost:3001` (porta 3001 por padrão para evitar conflito)

### Produção

**Backend**:
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend**:
```bash
cd frontend
npm run build
npm run start
```

## 🔌 API REST

### Base URL
```
http://localhost:3000
```

### Documentação Interativa
Acesse `http://localhost:3000/api` para explorar todos os endpoints via Swagger UI.

### Endpoints Principais

#### 👨‍🏁 Drivers (Pilotos)

**GET** `/drivers` - Lista todos os pilotos
```json
[
  {
    "id": 1,
    "name": "Max Verstappen",
    "team": "Red Bull Racing",
    "number": 1,
    "country": "NED",
    "laps": [...]
  }
]
```

**GET** `/drivers/:id` - Obtém um piloto específico

**POST** `/drivers` - Cria um novo piloto
```json
{
  "name": "Max Verstappen",
  "team": "Red Bull Racing",
  "number": 1,
  "country": "NED"
}
```

**PATCH** `/drivers/:id` - Atualiza um piloto

**DELETE** `/drivers/:id` - Remove um piloto

---

#### 🏁 Races (Corridas)

**GET** `/races` - Lista todas as corridas
```json
[
  {
    "id": 1,
    "name": "Bahrain Grand Prix",
    "round": 1,
    "date": "2025-03-02",
    "year": 2025,
    "location": "Sakhir",
    "laps": [...]
  }
]
```

**GET** `/races/:id` - Obtém uma corrida específica

**POST** `/races` - Cria uma nova corrida
```json
{
  "name": "Bahrain Grand Prix",
  "round": 1,
  "location": "Sakhir",
  "date": "2025-03-02",
  "year": 2025
}
```

**PATCH** `/races/:id` - Atualiza uma corrida

**DELETE** `/races/:id` - Remove uma corrida

---

#### 🔄 Laps (Voltas)

**GET** `/laps` - Lista todas as voltas
```json
[
  {
    "id": 1,
    "lap_number": 1,
    "position": 1,
    "session_type": "RACE",
    "time": "01:32.452",
    "sector_1": 28.123,
    "sector_2": 34.567,
    "sector_3": 29.762,
    "driver": {...},
    "race": {...}
  }
]
```

**GET** `/laps/:id` - Obtém uma volta específica

**POST** `/laps` - Registra uma nova volta
```json
{
  "lap_number": 1,
  "position": 1,
  "session_type": "RACE",
  "time": "01:32.452",
  "sector_1": 28.123,
  "sector_2": 34.567,
  "sector_3": 29.762
}
```

**PATCH** `/laps/:id` - Atualiza uma volta

**DELETE** `/laps/:id` - Remove uma volta

### Modelos de Dados

#### Driver
```typescript
{
  id: number;
  name: string;
  team: string;
  number: number;
  country?: string;
  laps: Lap[];  // Relacionamento OneToMany
}
```

#### Race
```typescript
{
  id: number;
  name: string;
  round: number;
  date: string;
  year: number;
  location?: string;
  laps: Lap[];  // Relacionamento OneToMany
}
```

#### Lap
```typescript
{
  id: number;
  lap_number: number;
  position: number;
  session_type: string;  // "RACE" | "QUALY"
  time: string;
  sector_1?: number;
  sector_2?: number;
  sector_3?: number;
  driver: Driver;  // Relacionamento ManyToOne
  race: Race;      // Relacionamento ManyToOne
}
```

## 🎨 Frontend - Interface Web

### Páginas Disponíveis

#### 1. **Calendário (`/`)**
Página inicial com todas as corridas da temporada:
- Grid responsivo de corridas
- Informações: rodada, nome, data, localização
- Navegação para detalhes de cada GP
- Design com hover effects e animações

#### 2. **Detalhes da Corrida (`/races/[id]`)**
Visualização completa de uma corrida específica:
- Alternância entre resultados de corrida e qualificação
- Lista de pilotos classificados por:
  - Posição final (modo RACE)
  - Melhor tempo (modo QUALY)
- Identificação visual de DNF/DNS
- Cores das equipes
- Número de voltas completadas
- Click nos pilotos para análise detalhada

#### 3. **Análise de Piloto (`/races/[id]/driver/[driverId]`)**
Dashboard completo para análise de performance:
- Gráfico interativo de evolução de tempo por volta
- Estatísticas principais:
  - Voltas completadas
  - Melhor volta
  - Posição final
- Grid com todas as voltas (número, tempo, posição)
- Alternância entre dados de corrida e qualificação
- Animações e estados de loading personalizados

### Componentes Visuais

#### Cores das Equipes
```typescript
{
  "Red Bull Racing": "#3671C6",
  "Mercedes": "#27F4D2",
  "Ferrari": "#E80020",
  "McLaren": "#FF8000",
  "Aston Martin": "#229971",
  "Alpine": "#00A1E8",
  "Williams": "#1868DB",
  "Racing Bulls": "#6692FF",
  "Kick Sauber": "#52E252",
  "Haas F1 Team": "#B6BABD"
}
```

#### Estados de Loading
- Animação com bandeira checkered para lista de corridas
- Animação de volante girando para dados de piloto
- Mensagens personalizadas em português

## 📡 Telemetria e Importação de Dados

### Scripts Python disponíveis

#### 1. **import_drivers.py**
Importa pilotos automaticamente usando FastF1:
```bash
cd telemetry
python import_drivers.py
```

Funcionalidades:
- Obtém dados de pilotos de várias corridas
- Mapeia país baseado em número do piloto
- Envia dados via POST para a API
- Evita duplicatas

#### 2. **import_calendar.py**
Importa calendário completo da temporada:
```bash
cd telemetry
python import_calendar.py
```

Funcionalidades:
- Obtém schedule completo via FastF1
- Filtra eventos de teste
- Importa nome, rodada, localização, data e ano
- Envia para endpoint `/races`

#### 3. **import_season.py**
Script para importação completa de dados da temporada (implementação customizada).

#### 4. **test_f1.py**
Script de testes para validar integração com FastF1.

### FastF1 Integration
Os scripts utilizam a biblioteca FastF1 para:
- Acesso a dados oficiais da F1
- Cache local de telemetria
- Parsing de sessões (qualificação, corrida, treinos)
- Extração de dados de voltas, setores e posições

## 🐳 Docker

### Serviços Disponíveis

O arquivo `docker-compose.yaml` fornece:

#### PostgreSQL
```yaml
Service: postgres
Port: 5432
Database: pitwall_db
User: admin
Password: admin_password
```

#### PgAdmin
```yaml
Service: pgadmin
Port: 8080
URL: http://localhost:8080
Email: admin@admin.com
Password: admin
```

### Comandos Docker

```bash
# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Parar e remover volumes (limpa dados)
docker-compose down -v
```

## 🛠️ Scripts Úteis

### Backend

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Linting
npm run lint

# Formatação
npm run format

# Testes
npm run test
npm run test:e2e
npm run test:cov
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start

# Linting
npm run lint
```

## 🧪 Testes

### Backend (Jest)

```bash
cd backend

# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

### Frontend

```bash
cd frontend

# Linting (ESLint)
npm run lint
```

## 💻 Desenvolvimento

### Padrões de Código

- **ESLint** configurado em backend e frontend
- **Prettier** para formatação consistente
- Convenção de nomenclatura:
  - PascalCase para componentes React
  - camelCase para funções e variáveis
  - kebab-case para arquivos

### Estrutura de Módulos (Backend)

Cada módulo NestJS segue a estrutura:
```
module-name/
├─ module-name.controller.ts    # Endpoints
├─ module-name.service.ts       # Lógica de negócio
├─ module-name.module.ts        # Configuração do módulo
├─ entities/
│  └─ entity.entity.ts         # Modelo TypeORM
└─ dto/
   ├─ create-entity.dto.ts     # DTO de criação
   └─ update-entity.dto.ts     # DTO de atualização
```

### TypeORM

Relacionamentos configurados:
- Driver → Laps (OneToMany)
- Race → Laps (OneToMany)
- Lap → Driver (ManyToOne)
- Lap → Race (ManyToOne)

Cascade delete configurado em relacionamentos para manter integridade.

### Adicionando Novos Módulos

1. Gere o módulo com NestJS CLI:
```bash
nest generate resource module-name
```

2. Configure entidade TypeORM
3. Implemente service com lógica de negócio
4. Configure controller com decoradores Swagger
5. Adicione no `app.module.ts`

## 🔧 Tecnologias

### Backend
- **NestJS** 11 - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **Swagger** - Documentação de API
- **PostgreSQL** - Banco de dados relacional
- **Class Validator** - Validação de DTOs

### Frontend
- **Next.js** 15 - Framework React com App Router
- **React** 19 - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP
- **Recharts** - Biblioteca de gráficos
- **Next Image** - Otimização de imagens

### Telemetria
- **FastF1** - Biblioteca Python para dados F1
- **Requests** - Cliente HTTP Python

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Ideias para Futuras Features

- 🔐 Autenticação e autorização de usuários
- 📊 Dashboard de estatísticas da temporada
- 🏁 Visualização de mapa de circuito com posições em tempo real
- 🌦️ Informações de clima e condições de pista
- 📈 Comparação entre pilotos
- 🎯 Sistema de predição de resultados
- 📱 Progressive Web App (PWA)
- 🔔 Notificações em tempo real
- 🎨 Temas personalizáveis
- 🌍 Internacionalização (i18n)

## 📝 Licença

Este projeto é mantido por [PauloHenriqueJunio](https://github.com/PauloHenriqueJunio).

## 📞 Suporte

Para questões e suporte, abra uma [issue no GitHub](https://github.com/PauloHenriqueJunio/PitWall/issues).

---

**Desenvolvido com ❤️ para fãs de Fórmula 1**
