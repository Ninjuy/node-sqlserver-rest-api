# node-sqlserver-rest-api

> **EN:** Production-ready REST API boilerplate — Node.js + TypeScript + SQL Server.
> Includes JWT authentication, role-based access control, pagination, Zod validation, and structured error handling.
>
> **TH:** REST API boilerplate พร้อม production — Node.js + TypeScript + SQL Server
> มาพร้อม JWT authentication, role-based access control, pagination, Zod validation และ error handling แบบมีโครงสร้าง

---

## Endpoints / เส้นทาง API

### Auth / การยืนยันตัวตน

| Method | Path | EN | TH |
|--------|------|----|----|
| POST | `/api/auth/register` | Register new user | ลงทะเบียนผู้ใช้ใหม่ |
| POST | `/api/auth/login` | Login, returns JWT | เข้าสู่ระบบ รับ JWT กลับมา |

### Users (ต้องใช้ JWT)

| Method | Path | Access | EN | TH |
|--------|------|--------|----|----|
| GET | `/api/users` | Admin | List all users (paginated) | ดูรายชื่อผู้ใช้ทั้งหมด |
| GET | `/api/users/:id` | Self / Admin | Get user by ID | ดูข้อมูลผู้ใช้รายบุคคล |
| PATCH | `/api/users/:id` | Self / Admin | Update user | อัปเดตข้อมูลผู้ใช้ |
| DELETE | `/api/users/:id` | Admin | Delete user | ลบผู้ใช้ |

### System

| Method | Path | EN | TH |
|--------|------|----|----|
| GET | `/health` | Health check | ตรวจสอบสถานะ server |

---

## Getting Started / เริ่มต้นใช้งาน

### 1. Clone & Install / โคลนและติดตั้ง

```bash
git clone https://github.com/Ninjuy/node-sqlserver-rest-api.git
cd node-sqlserver-rest-api
npm install
```

### 2. Set up database / ตั้งค่าฐานข้อมูล

```bash
# EN: Run the schema script in SQL Server Management Studio or sqlcmd
# TH: รัน schema script ใน SQL Server Management Studio หรือ sqlcmd
sqlcmd -S localhost -i sql/schema.sql
```

### 3. Configure environment / ตั้งค่า environment

```bash
cp .env.example .env
# EN: Edit .env with your SQL Server credentials
# TH: แก้ไข .env ด้วย SQL Server credentials ของคุณ
```

### 4. Start development server / เริ่ม server

```bash
npm run dev
```

---

## Project Structure / โครงสร้างโปรเจกต์

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

## Extending / ต่อยอด

- **เพิ่ม resource ใหม่** — สร้างไฟล์ `models/`, `controllers/`, `routes/` ตาม pattern เดิม
- **เพิ่ม table** — ขยาย `sql/schema.sql`
- **Refresh tokens** — เพิ่ม table `refresh_tokens` และ endpoint `/api/auth/refresh`
- **File uploads** — เพิ่ม middleware `multer` และ route `/api/uploads`
- **Rate limiting** — เพิ่ม `express-rate-limit` ใน `app.ts`

---

## Tech Stack

| Package | Purpose / หน้าที่ |
|---------|-------------------|
| express | Web framework |
| mssql | SQL Server driver / ตัวเชื่อมต่อ SQL Server |
| bcryptjs | Password hashing / เข้ารหัสรหัสผ่าน |
| jsonwebtoken | JWT authentication |
| zod | Request validation / ตรวจสอบ input |
| helmet | Security headers / header ความปลอดภัย |
| cors | CORS handling |
| morgan | HTTP logging / บันทึก HTTP request |

## License

MIT
