import React, { useState, useEffect } from "react";
import Modal from "./Modal/Modal";

const AdminMenuForm = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    item_id: "",
    name: "",
    price: "",
    discounted_price_for_LUMS_student: "",
    category: "",
    available: true,
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        item_id: "",
        name: "",
        price: "",
        discounted_price_for_LUMS_student: "",
        category: "",
        available: true,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? "Edit Item" : "Add New Item"}>
      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-4 bg-gray-800 rounded-lg text-white">
        <h2 className="text-2xl font-semibold text-center mb-4">{item ? "Edit Menu Item" : "Add New Menu Item"}</h2>

        {[
          { id: "item_id", label: "Item ID", type: "number" },
          { id: "name", label: "Name", type: "text" },
          { id: "price", label: "Price", type: "number" },
          { id: "discounted_price_for_LUMS_student", label: "Discounted Price (LUMS)", type: "number" },
          { id: "category", label: "Category", type: "text" },
        ].map(({ id, label, type }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
            <input
              id={id}
              type={type}
              value={formData[id]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        ))}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="available"
            checked={formData.available}
            onChange={handleChange}
            className="accent-red-500 h-4 w-4"
          />
          <label htmlFor="available" className="text-sm">Available</label>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium">
            {item ? "Update Item" : "Add Item"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminMenuForm;
