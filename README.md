# Практичні роботи

## Навігація

- [Практичне заняття 1: Підготовка середовища для розробки](#практичне-заняття-1-підготовка-середовища-для-розробки)
- [Практичне заняття 2: NestJS + PostgreSQL + Redis у Docker](#практичне-заняття-2-nestjs--postgresql--redis-у-docker)
- [Практичне заняття 3: MiniShop CRUD REST API на NestJS](#практичне-заняття-3-minishop-crud-rest-api-на-nestjs)
- [Практичне заняття 4: DTO + class-validator + Pipes](#практичне-заняття-4-dto--class-validator--pipes)
- [Практичне заняття 5: JWT Authentication + Guards + RBAC](#практичне-заняття-5-jwt-authentication--guards--rbac)
  
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




---

# Практичне заняття 4: DTO + class-validator + Pipes

## Student

- Name: Лук'янова Ю. А.
- Group: 232.1

## Опис роботи

У межах практичного заняття до MiniShop API було додано валідацію вхідних даних. Створено окремі DTO-класи для категорій і товарів з декораторами `class-validator`, підключено глобальний `ValidationPipe`, а контролери й сервіси переведено на строго типізовані DTO.

Також створено кастомний `TrimPipe`, який автоматично прибирає зайві пробіли на початку та в кінці рядкових значень у тілі запиту перед валідацією.

## Реалізовані модулі

- `src/categories/dto/create-category.dto.ts` - DTO для створення категорії.
- `src/categories/dto/update-category.dto.ts` - DTO для часткового оновлення категорії через `PartialType`.
- `src/products/dto/create-product.dto.ts` - DTO для створення товару з перевіркою ціни, залишку та ідентифікатора категорії.
- `src/products/dto/update-product.dto.ts` - DTO для часткового оновлення товару.
- `src/common/pipes/trim.pipe.ts` - кастомний Pipe для видалення зайвих пробілів.
- `src/main.ts` - глобальне підключення `TrimPipe` і `ValidationPipe`.

## Налаштування ValidationPipe

У файлі `src/main.ts` підключено глобальну валідацію:

```ts
app.useGlobalPipes(
  new TrimPipe(),
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

- `whitelist: true` - дозволяє лише поля, описані в DTO.
- `forbidNonWhitelisted: true` - повертає помилку `400`, якщо передано зайве поле.
- `transform: true` - перетворює JSON-дані на екземпляри DTO.
- `TrimPipe` запускається першим і очищує рядкові дані від пробілів.

## Структура репозиторію

```text
.
├── src/
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── categories.controller.ts
│   │   └── categories.service.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── products.controller.ts
│   │   └── products.service.ts
│   ├── common/
│   │   └── pipes/
│   │       └── trim.pipe.ts
│   └── main.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Запуск проєкту

```bash
cp .env.example .env
docker compose up --build -d
docker compose logs --tail=100 app
```

Після запуску застосунок успішно скомпілювався без помилок, а маршрути `/api/categories` і `/api/products` були зареєстровані.

## Перевірка роботи

### Тест TrimPipe

Було створено категорію з пробілами на початку та в кінці назви.

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method Post -ContentType "application/json" -Body '{"name":"  Accessories  "}'
```

Результат:

```text
name          id
----          --
Accessories    2
```

`TrimPipe` прибрав зайві пробіли, тому в базі збережено значення `Accessories`.

### Тест валідації - порожнє ім'я категорії

```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method Post -ContentType "application/json" -Body '{"name":""}' } catch { $_.ErrorDetails.Message }
```

Результат:

```json
{
  "message": ["name must be longer than or equal to 2 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Тест валідації - зайве поле

```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method Post -ContentType "application/json" -Body '{"name":"Test","isAdmin":true}' } catch { $_.ErrorDetails.Message }
```

Результат:

```json
{
  "message": ["property isAdmin should not exist"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Тест валідного створення товару

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Post -ContentType "application/json" -Body '{"name":"iPhone 16","price":999.99,"stock":50,"categoryId":2}'
```

Результат:

```text
name     : iPhone 16
price    : 999.99
stock    : 50
category : Accessories
id       : 2
```

### Тест валідації - від'ємна ціна товару

```powershell
try { Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Post -ContentType "application/json" -Body '{"name":"Bad Product","price":-5}' } catch { $_.ErrorDetails.Message }
```

Результат:

```json
{
  "message": ["price must not be less than 0.01"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Тест часткового оновлення товару

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products/2" -Method Patch -ContentType "application/json" -Body '{"price":899.99}'
```

Результат:

```text
id    : 2
name  : iPhone 16
price : 899.99
stock : 50
```

## Висновок

У ході практичного заняття було реалізовано валідацію вхідних даних у MiniShop API. DTO-класи забезпечили єдиний опис структури даних для категорій і товарів, а `ValidationPipe` відхиляє некоректні запити та зайві поля. Кастомний `TrimPipe` очищує рядкові значення до перевірки. Роботу API підтверджено успішним запуском контейнерів і тестовими HTTP-запитами.


---

# Практичне заняття 5: JWT Authentication + Guards + RBAC

## Student

* Name: Лук'янова Ю. А.
* Group: 232.1

## Опис роботи

У межах практичного заняття було додано систему автентифікації та авторизації до MiniShop API на NestJS. Було реалізовано реєстрацію користувачів, логін, генерацію JWT-токена, захист маршрутів за допомогою Guards та рольову модель доступу RBAC. Паролі користувачів зберігаються у базі даних тільки у вигляді bcrypt-хешу. Публічні GET-запити залишилися доступними без токена, а створення, редагування і видалення товарів та категорій доступні тільки користувачу з роллю `admin`.

## Виконані кроки

Для роботи з JWT та хешуванням паролів було встановлено залежності:

```bash
docker compose exec app npm install @nestjs/jwt bcrypt
docker compose exec app npm install -D @types/bcrypt
```

До файлів `.env` та `.env.example` було додано змінні середовища:

```env
JWT_SECRET=my-super-secret-key-change-in-production
JWT_EXPIRES_IN=1h
```

Було створено enum ролей:

```ts
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
```

Для користувачів було створено сутність `User`, яка містить поля `id`, `email`, `passwordHash`, `name`, `role` та `createdAt`. Поле `email` є унікальним, поле `passwordHash` зберігає хеш пароля, а поле `role` за замовчуванням має значення `user`.

Також було створено `UsersModule` та `UsersService`. Сервіс відповідає за пошук користувача за email та створення нового користувача.

Для створення таблиці користувачів було згенеровано міграцію:

```bash
docker compose run --rm app npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate src/migrations/CreateUsers -d src/data-source.ts
```

Результат:

```text
Migration /app/src/migrations/1782172648690-CreateUsers.ts has been generated successfully.
```

Після запуску застосунку таблиця `users` була створена у PostgreSQL. Перевірка таблиці виконувалась командою:

```bash
docker compose exec postgres psql -U nestuser -d nestdb -c "\d users"
```

У результаті було підтверджено, що таблиця містить поля `id`, `email`, `passwordHash`, `name`, `role`, `createdAt`, primary key для `id` та unique constraint для `email`.

## Реалізовані модулі

Було створено модуль `AuthModule`, який відповідає за реєстрацію, логін та роботу з JWT. У модулі реалізовано `AuthController`, `AuthService`, `RegisterDto` та `LoginDto`.

Маршрути авторизації:

| Метод | URL | Опис |
|---|---|---|
| POST | `/auth/register` | Реєстрація користувача |
| POST | `/auth/login` | Логін користувача та отримання JWT |

Під час реєстрації система перевіряє, чи існує користувач з таким email. Якщо користувача немає, пароль хешується за допомогою bcrypt і користувач зберігається у базі даних. У відповіді сервера поле `passwordHash` не повертається.

Перевірка реєстрації:

```bash
curl.exe -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{\"email\":\"admin@test.com\",\"password\":\"password123\",\"name\":\"Admin\"}'
```

Результат:

```json
{"email":"admin@test.com","name":"Admin","id":1,"role":"user","createdAt":"2026-06-23T01:32:28.551Z"}
```

Перевірка логіну:

```bash
curl.exe -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@test.com\",\"password\":\"password123\"}'
```

Результат:

```json
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI..."}
```

## Guards та RBAC

Для захисту маршрутів було створено `JwtAuthGuard`. Він перевіряє наявність Bearer-токена в заголовку `Authorization`, валідує JWT через `JwtService` і записує дані користувача в `request.user`.

Також було створено `RolesGuard`, який перевіряє роль користувача. Для цього було реалізовано декоратор `@Roles()`, який задає список дозволених ролей для маршруту. Додатково було створено декоратор `@CurrentUser()` для отримання поточного користувача з request.

У контролерах `ProductsController` та `CategoriesController` методи `POST`, `PATCH` і `DELETE` були захищені так:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
```

GET-запити залишилися публічними.

## Перевірка роботи

Спроба створити товар без токена:

```bash
curl.exe -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{\"name\":\"HackedProduct\",\"price\":1,\"stock\":1}'
```

Результат:

```json
{"message":"Missing authorization token","error":"Unauthorized","statusCode":401}
```

Це підтверджує, що `JwtAuthGuard` працює правильно.

Далі було отримано токен користувача з роллю `user`:

```powershell
$USER_TOKEN = (Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/login" -ContentType "application/json" -Body '{"email":"admin@test.com","password":"password123"}').accessToken
```

Спроба створити товар з токеном користувача:

```bash
curl.exe -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" -d '{\"name\":\"BlockedProduct\",\"price\":99,\"stock\":1}'
```

Результат:

```json
{"message":"Insufficient permissions","error":"Forbidden","statusCode":403}
```

Це підтверджує, що користувач з роллю `user` не має доступу до admin-операцій.

Після цього роль користувача було змінено на `admin`:

```bash
docker compose exec postgres psql -U nestuser -d nestdb -c "UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';"
```

Результат:

```text
UPDATE 1
```

Було отримано новий токен адміністратора:

```powershell
$ADMIN_TOKEN = (Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/login" -ContentType "application/json" -Body '{"email":"admin@test.com","password":"password123"}').accessToken
```

Створення товару з admin-токеном:

```bash
curl.exe -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{\"name\":\"MacBook\",\"price\":2499.99,\"stock\":10}'
```

Результат:

```json
{"name":"MacBook","price":2499.99,"stock":10,"description":null,"id":3,"isActive":true,"createdAt":"2026-06-23T02:06:44.548Z","updatedAt":"2026-06-23T02:06:44.548Z"}
```

Це підтверджує, що користувач з роллю `admin` має доступ до створення товарів.

## Проблеми під час виконання

Під час роботи виникла проблема з тим, що після встановлення пакетів через `docker compose run --rm app` застосунок не бачив пакети `@nestjs/jwt` та `bcrypt`. Проблему було вирішено встановленням залежностей безпосередньо у працюючий контейнер через `docker compose exec app`.

Також у PowerShell команда `curl.exe` некоректно обробляла JSON без екранування лапок, тому було використано формат з `\"`.

Ще одна проблема була пов'язана з типізацією параметра `expiresIn` у `@nestjs/jwt`. Її було вирішено через імпорт `StringValue` з пакета `ms` та приведення типу:

```ts
expiresIn: config.get<string>('JWT_EXPIRES_IN', '1h') as StringValue
```

## Висновок

У результаті практичного заняття було реалізовано систему автентифікації та авторизації для MiniShop API. Було додано реєстрацію користувачів, логін, генерацію JWT-токена, збереження паролів у вигляді bcrypt-хешу, захист маршрутів через `JwtAuthGuard` та перевірку ролей через `RolesGuard`. Публічні GET-запити залишилися доступними без токена, а створення, редагування і видалення товарів та категорій доступні тільки адміністратору. Перевірки через curl підтвердили коректну роботу статусів `401 Unauthorized`, `403 Forbidden` та успішне створення товару користувачем з роллю `admin`.