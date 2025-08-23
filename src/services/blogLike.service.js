import pool from "../config/db.js";

const likeAndDislikeBlog = async (blogId, userId) => {
  const existLike = await pool.query(
    `SELECT * FROM blog_likes WHERE Blog_id=$1 AND user_id=$2`,
    [blogId, userId]
  );

  if (existLike.rows.length > 0) {
    const deleteLike = await pool.query(
      `DELETE FROM blog_likes WHERE blog_id=$1 AND user_id=$2 RETURNING *`,
      [blogId, userId]
    );
    return { message: "Blog disliked", data: deleteLike.rows[0] };
  } else {
    const insertLike = await pool.query(
      `INSERT INTO blog_likes (blog_id, user_id) VALUES ($1, $2) RETURNING *`,
      [blogId, userId]
    );
    return { message: "Blog liked", data: insertLike.rows[0] };
  }
};

const getBlogLikes = async (blogId) => {
  const result = await pool.query(
    `SELECT * FROM blogs_likes WHERE blog_id=$1`,
    [blogId]
  );
  return result.rows;
};

export const blogLikeService = {
  likeAndDislikeBlog,
  getBlogLikes,
};
