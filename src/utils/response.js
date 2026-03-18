const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data,
  });
};

const sendError = (res, message = 'Something went wrong', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    data: null,
  });
};

const successResponse = (data, message = 'Success', statusCode = 200) => ({
  success: true,
  status: statusCode,
  message,
  data,
});

const errorResponse = (message = 'Something went wrong', statusCode = 500) => ({
  success: false,
  status: statusCode,
  message,
  data: null,
});

module.exports = { sendSuccess, sendError, successResponse, errorResponse };