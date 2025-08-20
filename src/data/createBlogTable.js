import pool from "../config/db.js";

export const createdBlogsTable = async () => {
  const queryText = `
    CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
    `;
  try {
    pool.query(queryText);
    console.log("User table created if not exists");
  } catch (error) {
    console.log("Error creating users table : ", error);
  }
};
