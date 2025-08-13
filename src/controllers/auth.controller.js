import { authServices } from "../services/auth.services.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userData = await authServices.loginUser(email, password);
    handleResponse(res, 201, "User Login successfully", userData);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  const user = req.user;
  try {
    const userData = await authServices.getMe(user.id);
    handleResponse(res, 201, "User Profile get successfully", userData);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  try {
    const userData = await authServices.changePassword(
      user.id,
      oldPassword,
      newPassword
    );
    handleResponse(res, 201, "User password change successfully", userData);
  } catch (error) {
    next(error);
  }
};

export const authController = {
  loginUser,
  getMe,
  changePassword,
};
