import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "express-clod",
  password: "postgresql",
  port: 5432,
});

pool.on("connect", () => {
  console.log("Connection pool established with Database");
});

export default pool;
