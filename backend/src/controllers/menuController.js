import MenuItem from '../models/MenuItem.js';
import catchAsync from '../utils/catchAsync.js';

export const getMenuItems = catchAsync(async (req, res) => {
  const menuItems = await MenuItem.find();
  res.status(200).json(menuItems);
});
