import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { throwError } from "../utils/error.js";
import bcrypt from "bcryptjs";

const loginUser = async (email, password) => {
  const userResult = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (userResult.rows.length === 0) {
    return throwError(404, "Invalid email or password");
  }

  const user = userResult.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return throwError(404, "Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    "secretkey",
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

const getMe = async (id) => {
  const result = await pool.query(
    `SELECT id,name,email,role,createdAt FROM users WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

const changePassword = async (id, oldPassword, newPassword) => {
  console.log(oldPassword);

  const userData = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  if (userData.rows.length === 0) {
    return throwError(401, "You are not authorize");
  }
  const user = userData.rows[0];

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return throwError(400, "Invalid old password");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  const updateUser = await pool.query(
    `UPDATE users SET password = $1 WHERE id=$2 RETURNING name,email,role,createdAt`,
    [hashPassword, id]
  );

  return updateUser.rows[0];
};

export const authServices = {
  loginUser,
  getMe,
  changePassword,
};
