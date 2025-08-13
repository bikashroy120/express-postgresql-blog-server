
import { UserServices } from "../services/user.services.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const newUser = await UserServices.createUserServices(
      name,
      email,
      password,
      role
    );
    handleResponse(res, 201, "User Created successfully", newUser);
  } catch (error) {
    next(error);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const { page, limit, role, name, sort, order } = req.query;

    const usersData = await UserServices.getUserServices({
      page,
      limit,
      role,
      name,
      sort,
      order,
    });
    handleResponse(res, 200, "get all user successfully", usersData);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const users = await UserServices.getById(id);

    if (!users) {
      return handleResponse(res, 400, "User not found");
    }

    handleResponse(res, 200, "get all user successfully", users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, role } = req.body;
  try {
    const users = await UserServices.updateUser(id, name, role);

    if (!users) {
      return handleResponse(res, 400, "User not found");
    }

    handleResponse(res, 200, "User update successfully", users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const users = await UserServices.deleteUser(id);

    if (!users) {
      return handleResponse(res, 400, "User not found");
    }

    handleResponse(res, 200, "User delete successfully", users);
  } catch (error) {
    next(error);
  }
};
