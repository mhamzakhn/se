import MenuItem from '../models/MenuItem.js';

export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: 'Error fetching menu items' });
  }
};
