import pool from "../config/db.js";
import { createdBlogsTable } from "../data/createBlogTable.js";

const createBlog = async (title, userId, content, category) => {
  const result = await pool.query(`SELECT to_regclass('blogs')`);
  if (!result.rows[0].to_regclass) {
    createdBlogsTable();
  }

  const blogData = await pool.query(
    `INSERT INTO blogs(title,user_id,content,category) VALUES($1,$2,$3,$4) RETURNING title,user_id,category,createdAt`,
    [title, userId, content, category]
  );
  return blogData.rows[0];
};

const getAllBlogs = async (data) => {
  let {
    page = 1,
    limit = 10,
    category,
    title,
    sort = "createdAt",
    order = "desc",
  } = data;

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const allowShorts = ["createdAt", "title"];
  if (!allowShorts.includes(sort)) {
    sort = "createdAt";
  }

  order = order.toLowerCase() === "asc" ? "asc" : "desc";

  let filterQuery = "";
  let filterValues = [];
  let count = 1;

  if (category) {
    filterQuery += `category=$${count}`;
    filterValues.push(category);
    count++;
  }

  if (title) {
    if (filterQuery) {
      filterQuery += " AND ";
    }
    filterQuery += `title ILIKE $${count}`;
    filterValues.push(`%${title}%`);
    count++;
  }

  const whereClause = filterQuery ? `WHERE ${filterQuery}` : "";

  const blogQuery = `SELECT  b.*,u.name FROM blogs b JOIN users u ON b.user_id = u.id ${whereClause} ORDER BY ${sort} ${order} LIMIT $${count} OFFSET $${
    count + 1
  }`;

  filterValues.push(limit, offset);
  const result = await pool.query(blogQuery, filterValues);

  const totalResult = await pool.query(
    `SELECT COUNT(*) FROM blogs ${whereClause}`,
    filterValues.slice(0, count - 1)
  );
  const total = parseInt(totalResult.rows[0].count);

  return {
    blogs: result.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getBlogById = async (id) => {
  const blog = await pool.query(
    `SELECT b.*, u.name FROM blogs b JOIN users u ON b.user_id = u.id WHERE b.id = $1`,
    [id]
  );
  return blog.rows[0];
};

const updateBlog = async (id, data) => {
  const { title, content, category } = data;
  const updateBlog = await pool.query(
    `UPDATE blogs SET title=$1, content=$2, category=$3, updatedAt=CURRENT_TIMESTAMP WHERE id=$4 RETURNING *`,
    [title, content, category, id]
  );
  return updateBlog.rows[0];
};

const deleteBlog = async (id) => {
  const result = await pool.query(`DELETE FROM blogs WHERE id=$1 RETURNING *`, [
    id,
  ]);
  if (!result.rows.length) {
    throw new Error("Blog not found");
  }
  return result.rows[0];
};

export const blogsServices = {
  createBlog,
  getAllBlogs,
  updateBlog,
  getBlogById,
  deleteBlog,
};
