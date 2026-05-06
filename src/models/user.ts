import { getPool, sql } from "../config/database";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

export const UserModel = {
  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const pool = await getPool();
    const offset = (page - 1) * limit;

    const result = await pool.request()
      .input("limit", sql.Int, limit)
      .input("offset", sql.Int, offset)
      .query(`
        SELECT id, name, email, role, created_at AS createdAt
        FROM users
        ORDER BY id
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;

        SELECT COUNT(*) AS total FROM users;
      `);

    return { users: result.recordsets[0] as User[], total: result.recordsets[1][0].total };
  },

  async findById(id: number): Promise<User | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT id, name, email, role, created_at AS createdAt FROM users WHERE id = @id");

    return (result.recordset[0] as User) ?? null;
  },

  async findByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT id, name, email, role, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE email = @email");

    return (result.recordset[0] as User & { passwordHash: string }) ?? null;
  },

  async create(dto: CreateUserDto & { passwordHash: string }): Promise<User> {
    const pool = await getPool();
    const result = await pool.request()
      .input("name", sql.NVarChar, dto.name)
      .input("email", sql.NVarChar, dto.email)
      .input("passwordHash", sql.NVarChar, dto.passwordHash)
      .input("role", sql.NVarChar, dto.role ?? "user")
      .query(`
        INSERT INTO users (name, email, password_hash, role)
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.created_at AS createdAt
        VALUES (@name, @email, @passwordHash, @role)
      `);

    return result.recordset[0] as User;
  },

  async update(id: number, dto: Partial<Pick<User, "name" | "email" | "role">>): Promise<User | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, dto.name)
      .input("email", sql.NVarChar, dto.email)
      .input("role", sql.NVarChar, dto.role)
      .query(`
        UPDATE users
        SET name = COALESCE(@name, name),
            email = COALESCE(@email, email),
            role = COALESCE(@role, role),
            updated_at = GETDATE()
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.created_at AS createdAt
        WHERE id = @id
      `);

    return (result.recordset[0] as User) ?? null;
  },

  async delete(id: number): Promise<boolean> {
    const pool = await getPool();
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM users WHERE id = @id");

    return result.rowsAffected[0] > 0;
  },
};
