import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminMenuCard from "../components/AdminMenuCard";
import AdminMenuForm from "../components/AdminMenuForm";
import { FiPlus as Plus } from "react-icons/fi";

const AdminMenuPage = () => {
  const [menuData, setMenuData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await axios.get("http://localhost:4000/api/v1/menu");
    setMenuData(res.data);
  };

  const handleAddItem = () => {
    setCurrentItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await axios.delete(`http://localhost:4000/api/v1/admin/menu/${id}`);
      fetchMenu();
    }
  };

  const handleSaveItem = async (itemData) => {
    if (currentItem) {
      await axios.put(`http://localhost:4000/api/v1/admin/menu/${currentItem._id}`, itemData);
    } else {
      await axios.post("http://localhost:4000/api/v1/admin/menu", itemData);
    }
    fetchMenu();
  };

  return (
    <div className="bg-gray-900 min-h-screen py-10 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Manage Menu Items</h1>
          <button
            onClick={handleAddItem}
            className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuData.map((item) => (
            <AdminMenuCard
              key={item._id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>

        {menuData.length === 0 && (
          <p className="text-center mt-20 text-gray-400">No menu items found.</p>
        )}

        <AdminMenuForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveItem}
          item={currentItem}
        />
      </div>
    </div>
  );
};

export default AdminMenuPage;
