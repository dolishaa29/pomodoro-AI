# Pomodoro

A Pomodoro timer app with a NestJS + PostgreSQL backend (auth) and a React + Vite frontend.

## Project structure

```
pomodoro/
├── backend/    NestJS API — user registration/login (JWT), profile
└── frontend/   React + Vite app — login/register UI and the Pomodoro timer
```

## Backend (`backend/`)

- **Stack**: NestJS, TypeORM, PostgreSQL, Passport JWT, bcryptjs
- **Auth**: register with email/password/first/last name, log in for a JWT access token, fetch the authenticated profile

### Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=pomodoro_backend
JWT_SECRET=<your-secret>
```

Run it:

```bash
npm run start:dev
```

The API listens on `http://localhost:3000` (override with `PORT`).

### Endpoints

| Method | Path            | Auth | Description               |
| ------ | --------------- | ---- | -------------------------- |
| POST   | `/auth/register` | —    | Create a user account      |
| POST   | `/auth/login`     | —    | Log in, returns a JWT      |
| GET    | `/auth/profile`   | JWT  | Get the current user       |

## Frontend (`frontend/`)

- **Stack**: React 19, TypeScript, Vite
- Login/register screens wired to the backend auth API; once logged in, shows a Pomodoro timer (25 min focus / 5 min short break / 15 min long break, every 4th round). The timer runs entirely in the browser — there's no backend timer/session API yet.

### Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default. It talks to the backend at `http://localhost:3000`; override with a `VITE_API_URL` env var if needed.

### Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run lint` — lint

## Running the full app

1. Start PostgreSQL and make sure the `backend/.env` values match it.
2. `cd backend && npm run start:dev`
3. `cd frontend && npm run dev`
4. Open `http://localhost:5173`, register an account, and log in.
