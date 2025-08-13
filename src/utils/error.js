export const throwError = (statusCode = 500, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
