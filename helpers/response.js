// utils/response.js

exports.success = (res, data = {}, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    status:status,
  });
};

exports.error = (res, error, status = 500) => {
  return res.status(status).json({
    success: false,
    message: error.message || "Something went wrong",
    status:status,
  });
};
