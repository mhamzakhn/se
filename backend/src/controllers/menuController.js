import MenuItem from '../models/MenuItem.js';
import catchAsync from '../utils/catchAsync.js';
import { sendResponse, sendPaginatedResponse } from '../utils/response.js';

export const getMenuItems = catchAsync(async (req, res) => {
  if (req.query.page || req.query.limit) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await MenuItem.countDocuments();
    const menuItems = await MenuItem.find().skip(skip).limit(limit);

    return sendPaginatedResponse(res, 200, menuItems, total, page, limit);
  }

  const menuItems = await MenuItem.find();
  sendResponse(res, 200, menuItems);
});
