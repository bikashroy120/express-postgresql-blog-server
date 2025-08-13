import pool from "../config/db.js";
import createUserTable from "../data/createUserTable.js";
import { throwError } from "../utils/error.js";
import bcrypt from "bcryptjs";

const createUserServices = async (name, email, password, role = "reader") => {
  const result = await pool.query(`SELECT to_regclass('users')`);
  if (!result.rows[0].to_regclass) {
    createUserTable();
  }

  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (userData.rows.length > 0) {
    return throwError(400, "User Already Exits");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const data = await pool.query(
    `INSERT INTO users(name,email,password,role) VALUES($1, $2, $3, $4) RETURNING id,name,email,role,createdAt`,
    [name, email, hashedPassword, role]
  );

  return data.rows[0];
};

const getUserServices = async (data) => {
  let {
    page = 1,
    limit = 10,
    role,
    name,
    sort = "createdAt",
    order = "desc",
  } = data;

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const allowedSort = ["id", "name", "email", "role", "createdAt"];
  if (!allowedSort.includes(sort)) sort = "createdAt";

  order = order.toLowerCase() === "asc" ? "asc" : "desc";

  let filterQuery = "";
  let filtersValues = [];
  let count = 1;

  if (role) {
    filterQuery += `role=$${count}`;
    filtersValues.push(role);
    count++;
  }

  if (name) {
    if (filterQuery) {
      filterQuery += " AND";
    }
    filterQuery += `name ILIKE $${count}`;
    filtersValues.push(`%${name}%`);
    count++;
  }

  const whereClause = filterQuery ? `WHERE ${filterQuery}` : "";

  console.log(limit);

  const usersQuery = `SELECT id,name,email,role,createdAt FROM users ${whereClause} ORDER BY ${sort} ${order} LIMIT $${count} OFFSET $${
    count + 1
  }`;

  filtersValues.push(limit, offset);
  const result = await pool.query(usersQuery, filtersValues);

  const totalResult = await pool.query(
    `SELECT COUNT(*) FROM users ${whereClause}`,
    filtersValues.slice(0, count - 1)
  );

  const total = parseInt(totalResult.rows[0].count);

  return {
    page,
    limit,
    total,
    totalPage: Math.ceil(total / limit),
    data: result.rows,
  };
};

const getById = async (id) => {
  const result = await pool.query(
    `SELECT id,name,email,role,createdAt FROM users WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

const updateUser = async (id, name, role) => {
  const result = await pool.query(
    `UPDATE users SET name=$1,role=$2 WHERE id=$3 RETURNING name,email,role,createdAt`,[name,role,id]
  );
  if (!result) {
    return throwError(404, "user not found");
  }
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id]
  );

  if (!result) {
    return throwError(404, "User not found");
  }

  return result;
};

export const UserServices = {
  createUserServices,
  getUserServices,
  getById,
  updateUser,
  deleteUser,
};
