# node-sqlserver-rest-api

> Production-ready REST API boilerplate — Node.js + TypeScript + SQL Server.
> Includes JWT authentication, role-based access control, pagination, Zod validation, and structured error handling.

---

## Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Users (requires JWT)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/users` | Admin | List all users (paginated) |
| GET | `/api/users/:id` | Self / Admin | Get user by ID |
| PATCH | `/api/users/:id` | Self / Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |

### System
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |

---

## Getting Started

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/node-sqlserver-rest-api.git
cd node-sqlserver-rest-api
npm install
```

### 2. Set up database
```bash
# Run the schema script in SQL Server Management Studio or sqlcmd
sqlcmd -S localhost -i sql/schema.sql
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your SQL Server credentials
```

### 4. Start development server
```bash
npm run dev
```

---

## Project Structure

```
src/
├── config/
│   └── database.ts       # SQL Server connection pool
├── middleware/
│   ├── auth.ts           # JWT verification, role guard
│   └── errorHandler.ts   # Centralized error handling
├── models/
│   └── user.ts           # SQL queries for users table
├── controllers/
│   ├── authController.ts # Register / login
│   └── userController.ts # CRUD operations
├── routes/
│   ├── auth.ts
│   └── users.ts
├── types/
│   └── index.ts          # Shared TypeScript types
└── app.ts                # Express setup + server
sql/
└── schema.sql            # Database schema + seed data
```

---

## Extending This Boilerplate

- **Add a new resource** — create `models/`, `controllers/`, `routes/` files following the same pattern
- **Add more tables** — extend `sql/schema.sql`
- **Refresh tokens** — add `refresh_tokens` table and `/api/auth/refresh` endpoint
- **File uploads** — add `multer` middleware and an `/api/uploads` route
- **Rate limiting** — add `express-rate-limit` in `app.ts`

---

## Tech Stack

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mssql | SQL Server driver |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| zod | Request validation |
| helmet | Security headers |
| cors | CORS handling |
| morgan | HTTP logging |

## License

MIT
