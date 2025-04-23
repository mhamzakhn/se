import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// TODO: Add middleware to restrict these to admin

// POST: Add a new item
router.post('/', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error adding menu item:", err);
    res.status(400).json({ message: 'Error adding item' });
  }
});

// PUT: Update an existing item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error("Error updating menu item:", err);
    res.status(500).json({ message: 'Error updating item' });
  }
});

// DELETE: Remove an item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ message: 'Error deleting item' });
  }
});

export default router;
