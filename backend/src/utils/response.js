export const sendResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({ success: true, data, message });
};

export const sendPaginatedResponse = (res, statusCode, data, total, page, limit, message) => {
  res.status(statusCode).json({
    success: true,
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    message,
  });
};
