import MenuItem from '../models/MenuItem.js';
import catchAsync from '../utils/catchAsync.js';
import { sendResponse } from '../utils/response.js';

export const getMenuItems = catchAsync(async (req, res) => {
  const menuItems = await MenuItem.find();
  sendResponse(res, 200, menuItems);
});
