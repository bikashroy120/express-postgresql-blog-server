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

export const createdBlogsLike = async () => {
  const queryText = `
CREATE TABLE blog_likes(
    id SERIAL PRIMARY KEY,
    blog_id INT REFERENCES blogs (id) ON DELETE CASCADE,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT NOW()
)
    `;
  try {
    pool.query(queryText);
    console.log("User table blog_likes created if not exists");
  } catch (error) {
    console.log("Error creating like table : ", error);
  }
};

export const createdBlogsComment = async () => {
  const queryText = `
CREATE TABLE blog_comments (
  id SERIAL PRIMARY KEY,
  blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

    `;
  try {
    pool.query(queryText);
    console.log("User table blog_comments  created if not exists");
  } catch (error) {
    console.log("Error creating comment table : ", error);
  }
};
