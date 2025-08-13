const errorHandling = (err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message,
    error: true,
  });
};

export default errorHandling;
