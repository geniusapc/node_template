module.exports.response = (res, next, statusCode, result, message=null) => {
  if (result instanceof Error) {
    return next(result);
  }
  return res.status(statusCode).json({
    status: 'success',
    message,
    data: result,
  });
};

module.exports.errorResponse = (res, status, message, type) =>
  res.status(status).json({
    status: 'error',
    type,
    message,
    data: null,
  });

module.exports.throwError = (status, type, message) => {
  const error = new Error();
  error.status = status;
  error.message = message;
  error.type = type;
  throw error;
};
