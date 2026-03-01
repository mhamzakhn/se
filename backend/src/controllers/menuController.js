import MenuItem from '../models/MenuItem.js';
import catchAsync from '../utils/catchAsync.js';
import { sendPaginatedResponse } from '../utils/response.js';

export const getMenuItems = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await MenuItem.countDocuments();
  const menuItems = await MenuItem.find().skip(skip).limit(limit);

  sendPaginatedResponse(res, 200, menuItems, total, page, limit);
});
