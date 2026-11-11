# GraphQL Digital Business Card API - Evgeny Morozov

> **Production-ready GraphQL API «Цифровая визитка» для Морозова Евгения Евгеньевича (Senior Frontend Developer)**, спроектированное на базе **NestJS**, **Apollo GraphQL**, **Prisma ORM** и **PostgreSQL**.
> Архитектура построена с соблюдением строгой 3-слойной модели (`Resolver` -> `Service / DataLoader` -> `Repository / Prisma`), полным отсутствием проблемы N+1 запросов к базе данных и поддержкой автоматической инициализации данных при старте.

---

## Публичное демо (Cloud Deployment)

* **Apollo Sandbox:** [https://test-assignment-itsmi-production.up.railway.app/graphql](https://test-assignment-itsmi-production.up.railway.app/graphql) (или корень [https://test-assignment-itsmi-production.up.railway.app](https://test-assignment-itsmi-production.up.railway.app) с автоматическим редиректом)
* **Healthcheck:** [https://test-assignment-itsmi-production.up.railway.app/health](https://test-assignment-itsmi-production.up.railway.app/health)

---

## Ключевые инженерные преимущества

1. **3-слойная модульная архитектура (Separation of Concerns):**
   * **Presentation Layer (`*.resolver.ts`, `models/*.model.ts`):** GraphQL Code-First схема, строгая валидация, маршрутизация запросов. Запрещен прямой доступ к БД или Prisma.
   * **Application Layer (`*.service.ts`, `*.loader.ts`):** Бизнес-логика, оркестрация и request-scoped `DataLoader` батчинг.
   * **Data Access Layer (`*.repository.ts`):** Полная изоляция операций `PrismaClient` с сортировкой на уровне SQL.
2. **Нулевой N+1 оверхед (Zero N+1 Queries Mandate):**
   * Корневой запрос `profile` запрашивает **только** одну строку профиля без жадных `JOIN`.
   * Связанные коллекции (`links`, `skills`, `experience`, `projects`) резолвятся лениво через `@ResolveField()`.
   * Если клиент не запрашивает вложенные поля, к БД уходит **ровно 0 лишних запросов**.
   * При запросе вложенных коллекций request-scoped `DataLoader` объединяет ключи в один батч и выполняет ровно **1 SQL-запрос** (`WHERE profile_id IN (...)`).
3. **Индексация внешних ключей и порядка за $O(1)$:**
   * Все внешние ключи и порядок сортировки (`@@index([profileId, sortOrder])`) проиндексированы в `prisma/schema.prisma`.
4. **Автоматическая идемпотентная инициализация БД:**
   * При первом или повторном старте (`DatabaseInitService` на `OnApplicationBootstrap`) база данных автоматически заполняется актуальными данными резюме Евгения Морозова через транзакционный `upsert`.
5. **Готовая песочница Apollo Sandbox:**
   * При переходе на `http://localhost:3000/graphql` или в корень `http://localhost:3000/` открывается встроенный **Apollo Sandbox** с уже предзаполненным запросом!

---

## Варианты запуска

### Вариант 1: Запуск через Docker Compose (Рекомендуемый)

Для запуска не требуется предварительно настраивать локальный PostgreSQL - все сервисы поднимаются в изолированных контейнерах:

```bash
docker compose up --build
```

Контейнеры запустятся, PostgreSQL пройдет healthcheck, `docker-entrypoint.sh` применит схему Prisma, и сервер начнет принимать запросы на порту `3000`:
* **Apollo Sandbox:** [http://localhost:3000/graphql](http://localhost:3000/graphql)
* **Healthcheck:** [http://localhost:3000/health](http://localhost:3000/health)

---

### Вариант 2: Локальный запуск (Node.js + PostgreSQL)

1. **Запустите PostgreSQL:**
   Убедитесь, что сервер PostgreSQL запущен и доступен по стандартному порту `5432`.
2. **Создайте базу данных `morozov_cv` (если еще не создана):**
   ```bash
   psql -U postgres -c "CREATE DATABASE morozov_cv ENCODING 'UTF8';"
   ```
3. **Настройте переменные окружения (`.env`):**
   Скопируйте `.env.example` в `.env` (если файл еще не существует) и укажите строку подключения:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/morozov_cv?schema=public"
   ```
4. **Установите зависимости, синхронизируйте БД и запустите проект:**
   ```bash
   npm install
   npm run setup:local
   npm run start:dev
   ```
5. **Откройте песочницу:**
   * Перейдите в браузере по адресу: **[http://localhost:3000/graphql](http://localhost:3000/graphql)** или **[http://localhost:3000](http://localhost:3000)** (автоматический редирект в Sandbox).

---

## Примеры GraphQL-запросов

### 1. Минимальный запрос из ТЗ
```graphql
query {
  profile {
    name
    description
    skills {
      name
    }
    experience {
      company
      position
    }
    projects {
      name
    }
  }
}
```

### 2. Полный запрос всех данных цифровой визитки
```graphql
query GetEvgenyMorozovProfile {
  profile {
    id
    name
    title
    location
    description
    education
    languages
    links {
      platform
      url
    }
    skills {
      name
      category
      sortOrder
    }
    experience {
      company
      companyInfo
      position
      period
      startDate
      endDate
      achievements
      techStack
    }
    projects {
      name
      description
      url
      techStack
    }
    createdAt
    updatedAt
  }
}
```

---

## Архитектура каталогов

```text
├── Dockerfile                             # Multi-stage production Docker build
├── docker-compose.yml                     # Docker Compose для API и PostgreSQL
├── docker-entrypoint.sh                   # Инициализация схемы БД в контейнере
├── .env.example                           # Шаблон переменных окружения
├── README.md                              # Документация проекта
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma                      # Схема БД с @@index([profileId, sortOrder])
│   └── seed.ts                            # Идемпотентный сидинг данных Морозова Е. Е.
└── src/
    ├── main.ts                            # Bootstrap, shutdown hooks, CORS
    ├── app.module.ts                      # Apollo Sandbox с предзаполненным запросом
    ├── common/
    │   └── health/
    │       └── health.controller.ts       # GET /health и редирект GET / -> /graphql
    ├── database/
    │   ├── database.module.ts             # Global database модуль
    │   ├── database-init.service.ts       # Авто-сидинг на OnApplicationBootstrap
    │   └── prisma.service.ts              # Lifecycle hooks (OnModuleInit/Destroy)
    └── modules/
        ├── profile/                       # Домен профиля и контактов
        │   ├── models/                    # GraphQL ObjectTypes
        │   ├── profile.module.ts
        │   ├── profile.resolver.ts        # @Query('profile'), @ResolveField('links'...)
        │   ├── profile.service.ts         # Singleton ProfileService
        │   ├── profile.repository.ts      # Изоляция Prisma
        │   └── social-link.loader.ts      # Request-scoped DataLoader
        ├── skill/                         # Домен навыков
        │   ├── models/skill.model.ts
        │   ├── skill.module.ts
        │   ├── skill.service.ts           # Singleton SkillService
        │   ├── skill.repository.ts
        │   └── skill.loader.ts            # Request-scoped DataLoader
        ├── experience/                    # Домен опыта работы
        │   ├── models/experience.model.ts
        │   ├── experience.module.ts
        │   ├── experience.service.ts      # Singleton ExperienceService
        │   ├── experience.repository.ts
        │   └── experience.loader.ts       # Request-scoped DataLoader
        └── project/                       # Домен проектов
            ├── models/project.model.ts
            ├── project.module.ts
            ├── project.service.ts         # Singleton ProjectService
            ├── project.repository.ts
            └── project.loader.ts          # Request-scoped DataLoader
```

---

## Проверка сборки и типов

```bash
# Генерация Prisma клиента
npm run db:generate

# Компиляция TypeScript без ошибок
npm run build
```
