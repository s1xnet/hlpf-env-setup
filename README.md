# Практичні роботи

## Навігація

- [Практичне заняття 1: Підготовка середовища для розробки](#практичне-заняття-1-підготовка-середовища-для-розробки)
- [Практичне заняття 2: NestJS + PostgreSQL + Redis у Docker](#практичне-заняття-2-nestjs--postgresql--redis-у-docker)
- [Практичне заняття 3: MiniShop CRUD REST API на NestJS](#практичне-заняття-3-minishop-crud-rest-api-на-nestjs)
  
---

# Практичне заняття 1: Підготовка середовища для розробки

## Student

* Name: Лук'янова Ю. А.
* Group: 232.1

## Опис роботи

У межах практичного заняття було підготовлено базове середовище для подальшої розробки.
Було встановлено та перевірено Docker Desktop, Docker Compose і Git. Також було створено GitHub-репозиторій, додано базовий `Dockerfile` і `docker-compose.yml` для запуску контейнера з актуальною версією npm.

## Перевірка Docker, Docker Compose та Git

Команди:

```bash
docker --version
docker compose version
git --version
```

Вивід:

```text
Docker version 29.5.3, build d1c06ef
Docker Compose version v5.1.4
git version 2.54.0.windows.1
```

## Перевірка роботи Docker

Команда:

```bash
docker run --rm hello-world
```

Вивід:

```text
Hello from Docker!

This message shows that your installation appears to be working correctly.
```

## Перевірка docker-compose та latest npm

Команда:

```bash
docker compose up --build
```

Вивід:

```text
Image hlpf-env-setup-npm Built
Network hlpf-env-setup_default Created
Container hlpf-env-setup-npm-1 Created
npm-1 | 11.17.0
npm-1 exited with code 0
```

## Перевірка версії npm

Команда:

```bash
docker compose run --rm npm npm -v
```

Вивід:

```text
11.17.0
```

## Перевірка версії Node.js

Команда:

```bash
docker compose run --rm npm node --version
```

Вивід:

```text
v26.3.1
```

## Структура репозиторію

```text
.
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Висновок

У результаті виконання практичного заняття було підготовлено базове середовище для розробки.
Docker Desktop і Docker Compose успішно встановлено та перевірено. Команда `hello-world` підтвердила коректну роботу Docker. Також було створено GitHub-репозиторій, додано `Dockerfile` і `docker-compose.yml`, після чого через Docker Compose було перевірено версії npm та Node.js.



---

# Практичне заняття 2: NestJS + PostgreSQL + Redis у Docker

## Student

* Name: Лук'янова Ю. А.
* Group: 232.1

## Опис роботи

У межах практичного заняття було розширено середовище з Практичної роботи №1.
До проєкту додано NestJS-застосунок, базу даних PostgreSQL та Redis для кешування.
Усі сервіси запускаються через Docker Compose.

## Структура репозиторію

```text
.
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── app.service.ts
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## Запуск проєкту

```bash
cp .env.example .env
docker compose up --build
```

Файл `.env.example` містить приклади змінних оточення для навчального запуску проєкту.

## Перевірка сервісів

Команда:

```bash
docker compose ps
```

Вивід:

```text
NAME                         IMAGE                  STATUS
hlpf-env-setup-app-1          hlpf-env-setup-app     running
hlpf-env-setup-postgres-1     postgres:16-alpine     running (healthy)
hlpf-env-setup-redis-1        redis:7-alpine         running (healthy)
```

## Перевірка PostgreSQL

Команда:

```bash
docker compose exec postgres psql -U nestuser -d nestdb -c '\l'
```

Вивід:

```text
List of databases
Name      | Owner    | Encoding
----------+----------+---------
nestdb    | nestuser | UTF8
postgres  | nestuser | UTF8
template0 | nestuser | UTF8
template1 | nestuser | UTF8
```

## Перевірка Redis

Команда:

```bash
docker compose exec redis redis-cli ping
```

Вивід:

```text
PONG
```

## Перевірка застосунку

Команда:

```bash
curl http://localhost:3000
```

Вивід:

```text
Hello World!
```

Також застосунок можна перевірити у браузері за адресою:

```text
http://localhost:3000
```

Очікувана відповідь:

```text
Hello World!
```

## Логи NestJS

Команда:

```bash
docker compose logs app
```

Фрагмент логів:

```text
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] LOG [InstanceLoader] CacheModule dependencies initialized
[Nest] LOG [NestApplication] Nest application successfully started
```

## Підключення PostgreSQL через TypeORM

У файлі `src/app.module.ts` додано `TypeOrmModule.forRoot(...)`.

Підключення використовує змінні оточення:

```text
POSTGRES_HOST
POSTGRES_PORT
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

## Підключення Redis через CacheModule

У файлі `src/app.module.ts` додано `CacheModule.registerAsync(...)`.

Підключення використовує змінні оточення:

```text
REDIS_HOST
REDIS_PORT
```

## Коміти

У репозиторії створено нові коміти:

```text
add postgresql and redis to docker-compose
init nestjs project with db and redis connection
```

## Висновок

У результаті виконання практичного заняття було створено Docker-середовище для NestJS-застосунку з підключенням PostgreSQL та Redis.
Було налаштовано `Dockerfile`, `docker-compose.yml`, змінні оточення, структуру NestJS-проєкту, підключення до бази даних через TypeORM та кешування через Redis.



---

# Практичне заняття 3: MiniShop CRUD REST API на NestJS

## Student

- Name: Лук'янова Ю. А.
- Group: 232.1

## Опис роботи

У межах практичного заняття було розширено NestJS-проєкт MiniShop. Реалізовано REST API для керування категоріями та товарами з використанням PostgreSQL, TypeORM, Redis і Docker Compose.

Було створено дві сутності: `Category` та `Product`. Між товаром і категорією реалізовано зв'язок Many-to-One: один товар може належати одній категорії, а категорія може містити багато товарів.

## Міграції бази даних

Для роботи зі схемою бази даних вимкнено автоматичну синхронізацію:

```ts
synchronize: false
```

Створено та виконано дві міграції:

| Тип | Файл | Призначення |
|---|---|---|
| Ручна | `1700000001000-CreateTables.ts` | Створює таблиці `categories` і `products` |
| Згенерована | `1781921208651-AddIsActiveToProducts.ts` | Додає поле `isActive` до таблиці `products` |

Міграції підключено до `app.module.ts` і вони запускаються автоматично через `migrationsRun: true`.

## Реалізовані модулі

### CategoriesModule

Реалізовано CRUD-операції для категорій:

| Метод | URL | Опис |
|---|---|---|
| POST | `/categories` | Створення категорії |
| GET | `/categories` | Отримання всіх категорій |
| GET | `/categories/:id` | Отримання категорії за id |
| PATCH | `/categories/:id` | Оновлення категорії |
| DELETE | `/categories/:id` | Видалення категорії |

### ProductsModule

Реалізовано CRUD-операції для товарів:

| Метод | URL | Опис |
|---|---|---|
| POST | `/products` | Створення товару |
| GET | `/products` | Отримання всіх товарів |
| GET | `/products/:id` | Отримання товару за id |
| PATCH | `/products/:id` | Оновлення товару |
| DELETE | `/products/:id` | Видалення товару |

Під час створення товару можна передати `categoryId` для встановлення зв'язку з категорією.

## Перевірка роботи

Під час перевірки успішно виконано:

- створення категорії `Electronics`;
- створення товару `Wireless headphones` із прив'язкою до категорії;
- отримання списку товарів;
- оновлення значень `stock` та `isActive`;
- видалення товару;
- видалення категорії;
- збірку проєкту командою `docker compose run --rm app npm run build`;
- чистий запуск після видалення Docker volume командою `docker compose up --build -d`.

Проєкт доступний за адресою:

```text
http://localhost:3000
```

## Висновок

У результаті роботи створено MiniShop CRUD REST API з двома пов'язаними сутностями, ручною та згенерованою міграціями, вимкненою автоматичною синхронізацією бази даних і можливістю запуску проєкту з нуля через Docker Compose.
