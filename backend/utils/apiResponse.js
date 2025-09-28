export const apiResponse = (success, message, data = null, statusCode = 200) => {
  return {
    success,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString()
  };
};
