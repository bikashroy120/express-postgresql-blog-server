CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'reader',
    createdAt TIMESTAMP DEFAULT NOW()
)

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE blog_likes(
    id SERIAL PRIMARY KEY,
    blog_id INT REFERENCES blogs (id) ON DELETE CASCADE,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT NOW()
    UNIQUE (blog_id, user_id)
)



CREATE TABLE blog_comments (
  id SERIAL PRIMARY KEY,
  blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);
