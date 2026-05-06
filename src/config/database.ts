import sql from "mssql";
import * as dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
  server: process.env.DB_SERVER ?? "localhost",
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME ?? "mydb",
  user: process.env.DB_USER ?? "sa",
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.NODE_ENV === "production",
    trustServerCertificate: process.env.NODE_ENV !== "production",
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
    console.log("✅ SQL Server connected");
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

export { sql };
