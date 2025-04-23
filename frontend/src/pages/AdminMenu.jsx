import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminMenuPage = () => {
  const [menuData, setMenuData] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    discounted_price_for_LUMS_student: '',
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/menu');
      setMenuData(res.data);
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
  };

  const handleInputChange = (e, item, field) => {
    const updatedItem = { ...item, [field]: e.target.value };
    setMenuData(menuData.map(i => (i._id === item._id ? updatedItem : i)));
  };

  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const saveChanges = async (item) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/admin/menu/${item._id}`, item);
      fetchMenu();
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/admin/menu/${id}`);
      fetchMenu();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const addItem = async () => {
    try {
      await axios.post('http://localhost:4000/api/v1/admin/menu', newItem);
      setNewItem({ name: '', category: '', price: '', discounted_price_for_LUMS_student: '' });
      fetchMenu();
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const groupedItems = menuData.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-gray-900 min-h-screen text-white px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-10">Admin Menu Management</h2>

      {/* Add New Item */}
      <div className="bg-gray-800 p-6 rounded-lg mb-12 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4">Add New Item</h3>
        <div className="grid grid-cols-4 gap-4">
          <input name="name" placeholder="Name" value={newItem.name} onChange={handleNewItemChange}
            className="p-2 rounded bg-gray-700 text-white" />
          <input name="category" placeholder="Category" value={newItem.category} onChange={handleNewItemChange}
            className="p-2 rounded bg-gray-700 text-white" />
          <input name="price" placeholder="Price" value={newItem.price} onChange={handleNewItemChange}
            className="p-2 rounded bg-gray-700 text-white" />
          <input name="discounted_price_for_LUMS_student" placeholder="Discounted Price"
            value={newItem.discounted_price_for_LUMS_student} onChange={handleNewItemChange}
            className="p-2 rounded bg-gray-700 text-white" />
        </div>
        <button onClick={addItem} className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-medium">
          Add Item
        </button>
      </div>

      {/* Menu Items Section */}
      {Object.keys(groupedItems).map((category) => (
        <div key={category} className="mb-12">
          <h3 className="text-3xl font-semibold mb-6">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedItems[category].map((item) => (
              <div key={item._id} className="bg-gray-800 p-4 rounded-lg relative">
                <img src="/BeefChilliDry.jpeg" alt={item.name} className="w-full h-40 object-contain mb-4 rounded bg-gray-900" />
                <input value={item.name} onChange={(e) => handleInputChange(e, item, 'name')}
                  className="mb-2 w-full p-2 rounded bg-gray-700 text-white" />
                <input value={item.category} onChange={(e) => handleInputChange(e, item, 'category')}
                  className="mb-2 w-full p-2 rounded bg-gray-700 text-white" />
                <input type="number" value={item.price} onChange={(e) => handleInputChange(e, item, 'price')}
                  className="mb-2 w-full p-2 rounded bg-gray-700 text-white" />
                <input type="number" value={item.discounted_price_for_LUMS_student}
                  onChange={(e) => handleInputChange(e, item, 'discounted_price_for_LUMS_student')}
                  className="mb-4 w-full p-2 rounded bg-gray-700 text-white" />
                <div className="flex justify-between">
                  <button onClick={() => saveChanges(item)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                    Save
                  </button>
                  <button onClick={() => deleteItem(item._id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMenuPage;
