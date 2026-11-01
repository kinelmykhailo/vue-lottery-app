# vue-lottery-app

Сучасний SPA-додаток на **Vue 3 + TypeScript + Composition API + Vue Router 4 + Pinia**, реалізований у межах **Лабораторної роботи №5** («Керування маршрутами з використанням vue-router»).

🔗 **Демо на GitHub Pages:** [https://kinelmykhailo.github.io/vue-lottery-app/](https://kinelmykhailo.github.io/vue-lottery-app/)

---

## 🎯 Мета лабораторної роботи
Ознайомлення з концепцією маршрутизації в односторінкових додатках (SPA) за допомогою бібліотеки `vue-router`, застосування патерну **Repository** для роботи із зовнішнім REST API (DummyJSON) та реалізація авторизації на основі **JSON Web Tokens (JWT)** з автоматичним оновленням токенів (interceptor).

---

## 🛠️ Стек технологій
- **Vue 3** (`<script setup lang="ts">`, Composition API)
- **Vue Router 4** (SPA маршрутизація, динамічні параметри, вкладені маршрути, navigation guards, lazy loading)
- **Pinia** (State Management для автентифікації та користувачів)
- **TypeScript** (сувора типізація моделей, DTO та репозиторіїв)
- **VeeValidate & Yup** (валідація форм створення, редагування та авторизації)
- **SCSS + Bootstrap 5** (модульний імпорт виключно необхідних SCSS-партіалів)
- **REST API (DummyJSON)** (Users & Auth endpoints)
- **Vite** (швидка збірка та HMR)
- **ESLint & Prettier** (дотримання Vue style guide)

---

## 🚀 Встановлення та запуск

1. **Клонування та перехід у гілку:**
   ```bash
   git clone https://github.com/kinelmykhailo/vue-lottery-app.git
   cd vue-lottery-app
   git checkout feature/routing
   ```

2. **Встановлення залежностей:**
   ```bash
   npm install
   ```

3. **Налаштування середовища (.env):**
   Скопіюйте `.env.example` у `.env`:
   ```bash
   cp .env.example .env
   ```
   Вміст `.env`:
   ```env
   VITE_API_URL=https://dummyjson.com
   ```

4. **Запуск у режимі розробки:**
   ```bash
   npm run dev
   ```

5. **Перевірка типів та лінтера:**
   ```bash
   npm run type-check
   npm run lint
   ```

6. **Продакшн збірка та деплой на GitHub Pages:**
   ```bash
   npm run build
   npm run deploy
   ```

---

## 🔑 Тестові дані для входу
- **Username:** `emilys`
- **Password:** `emilyspass`
*(На сторінці логіну доступна кнопка автоматичного заповнення форми тестовими даними).*

---

## 🏛️ Архітектура та патерн Repository

Застосунок використовує патерн **Repository** для повної ізоляції клієнтського коду від деталей HTTP-запитів:

1. **Generic контракти (`src/services/interfaces.ts`):**
   - `Readable<T>`
   - `Creatable<T, TCreate>`
   - `Editable<T, TUpdate>`
   - `Deletable`
2. **Моделі та DTO (`src/types/user.ts`, `src/types/auth.ts`):**
   - `User`, `CreateUserDto`, `UpdateUserDto`, `UsersResponse`, `AuthResponse`, `LoginCredentials`.
3. **HTTP-клієнт (`src/api/http-client.ts`):**
   - Єдина точка виконання `fetch`.
   - Читає базовий URL виключно з `import.meta.env.VITE_API_URL`.
   - Додає заголовок `Authorization: Bearer <accessToken>`.
   - **401 Interceptor:** при отриманні 401 автоматично надсилає запит на `/auth/refresh` з `refreshToken`, зберігає нову пару токенів та повторює вихідний запит без участі користувача.
4. **Сервіси (`src/services/user.service.ts`, `src/services/auth.service.ts`):**
   - Реалізують інтерфейси доступу до даних. Жодного захардкодженного URL у компонентах чи сервісах.
5. **Фабрика `ServiceProvider` (`src/services/service-provider.ts`):**
   - Єдина точка доступу до екземплярів `UserService` та `AuthService` (`ServiceProvider.users`, `ServiceProvider.auth`).
6. **Тестованість (`src/services/__tests__/fake-user.service.ts`):**
   - Реалізація `FakeUserService`, що дозволяє запускати юніт-тести без реального бекенду.

---

## 🧭 Маршрутизація (Vue Router)

- `/` — **Головна (Home):** опис проєкту, технологічний стек, огляд можливостей та лінк на GitHub.
- `/about` — **Про автора (About):** ПІБ студента, блок Technical Skills, посилання на GitHub профіль.
- `/login` — **Авторизація (Login):** форма входу (VeeValidate + Yup), збереження JWT у Pinia та `localStorage`, відображення помилок сервера, редірект. Використовує `AuthLayout`.
- `/users` — **Учасники (Users):** захищений маршрут (`meta.requiresAuth`). Таблиця учасників із DummyJSON, пагінація (`limit`, `skip`), пошук, збереження стану в URL query (`/users?page=2&q=john`). Модуль розіграшу (Lottery).
- `/users/:id` — **Деталі користувача:** динамічний роут, передача параметра через `props: true`.
- `/users/:id/edit` — **Вкладений маршрут редагування користувача:** форма редагування з валідацією. Після успішного запиту локальний стан у Pinia оновлюється автоматично (імітація DummyJSON мутацій).
- `/:pathMatch(.*)*` — **404:** сторінка помилки з кнопкою повернення на головну.

### Navigation Guards та мета-поля
- `beforeEach`:
  - Неавторизований користувач при спробі відкрити `/users` (або вкладені) перенаправляється на `/login?redirect=...`. Після входу повертається назад.
  - Авторизований користувач при відкритті `/login` перенаправляється на `/users`.
- `afterEach`:
  - Динамічна зміна назви вкладки браузера через `document.title = to.meta.title`.
- `meta.layout`:
  - `DefaultLayout` для основних розділів (з хедерами, футером та навігацією).
  - `AuthLayout` для сторінки входу (сфокусований інтерфейс).

---

## 📂 Структура проєкту
```
src/
├── api/
│   └── http-client.ts           # Базовий HTTP-клієнт + 401 JWT refresh interceptor
├── assets/
│   └── styles/
│       └── main.scss            # Модульні SCSS-стилі Bootstrap 5 + кастомні класи
├── components/
│   ├── AppFooter.vue            # Підвал сайту
│   ├── AppHeader.vue            # Шапка сайту
│   ├── AppNavigation.vue        # Навігація з активними лінками та кнопкою Logout
│   ├── BaseButton.vue           # Базова кнопка
│   ├── BaseInput.vue            # Базове поле вводу
│   ├── Logo.vue                 # Логотип проєкту
│   ├── Modal.vue                # Модальне вікно
│   └── UserFormModal.vue        # Модальне вікно створення користувача (VeeValidate + Yup)
├── layouts/
│   ├── AuthLayout.vue           # Макет для авторизації
│   └── DefaultLayout.vue        # Основний макет
├── router/
│   └── index.ts                 # Конфігурація маршрутів, guards, layouts
├── services/
│   ├── __tests__/
│   │   └── fake-user.service.ts # Фейковий сервіс для тестування
│   ├── auth.service.ts          # Репозиторій авторизації
│   ├── interfaces.ts            # Контракти патерну Repository
│   ├── service-provider.ts      # Фабрика ServiceProvider
│   └── user.service.ts          # Репозиторій користувачів
├── stores/
│   ├── auth.ts                  # Pinia-стор авторизації та JWT
│   └── users.ts                 # Pinia-стор користувачів, пагінації, розіграшу
├── types/
│   ├── auth.ts                  # TypeScript-інтерфейси авторизації
│   └── user.ts                  # TypeScript-інтерфейси DummyJSON User & DTO
├── views/
│   ├── AboutView.vue            # Сторінка про автора
│   ├── HomeView.vue             # Головна сторінка
│   ├── LoginView.vue            # Сторінка авторизації
│   ├── NotFoundView.vue         # 404 сторінка
│   ├── UserDetailsInfo.vue      # Повні дані користувача
│   ├── UserDetailsView.vue      # Батьківський роут /users/:id (props: true)
│   ├── UserEditView.vue         # Вкладений роут /users/:id/edit
│   └── UsersView.vue            # Таблиця учасників, пошук, пагінація, розіграш
├── App.vue                      # Кореневий компонент з динамічним Layout
└── main.ts                      # Ініціалізація додатку, Pinia, Router
```

---

## 👤 Автор
- **Студент:** Кінель Михайло (Misha Kinel)
- **GitHub:** [@kinelmykhailo](https://github.com/kinelmykhailo)
- **Репозиторій:** [vue-lottery-app](https://github.com/kinelmykhailo/vue-lottery-app)
