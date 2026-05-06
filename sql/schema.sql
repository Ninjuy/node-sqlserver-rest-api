-- Node.js + SQL Server REST API — Database Schema
-- Run this script to set up the initial database structure

CREATE DATABASE mydb;
GO

USE mydb;
GO

CREATE TABLE users (
  id            INT IDENTITY(1,1) PRIMARY KEY,
  name          NVARCHAR(100)  NOT NULL,
  email         NVARCHAR(255)  NOT NULL UNIQUE,
  password_hash NVARCHAR(255)  NOT NULL,
  role          NVARCHAR(20)   NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at    DATETIME2      NOT NULL DEFAULT GETDATE(),
  updated_at    DATETIME2      NULL
);

CREATE INDEX idx_users_email ON users(email);

-- Seed admin user (password: Admin@1234)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin',
  'admin@example.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i',
  'admin'
);
GO
