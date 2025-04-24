// src/components/AdminMenuForm.jsx
import React, { useEffect, useState } from "react";

const AdminMenuForm = ({ isOpen, onClose, onSave, item }) => {
  const [formState, setFormState] = useState({
    name: '',
    category: '',
    price: '',
    discounted_price_for_LUMS_student: '',
  });

  useEffect(() => {
    if (item) setFormState(item);
    else setFormState({ name: '', category: '', price: '', discounted_price_for_LUMS_student: '' });
  }, [item]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formState);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-lg text-white">
        <h2 className="text-2xl font-semibold mb-4">{item ? "Edit" : "Add New"} Menu Item</h2>
        <div className="space-y-4">
          <input name="name" value={formState.name} onChange={handleChange} placeholder="Name" className="w-full p-2 rounded bg-gray-700" />
          <input name="category" value={formState.category} onChange={handleChange} placeholder="Category" className="w-full p-2 rounded bg-gray-700" />
          <input name="price" value={formState.price} onChange={handleChange} placeholder="Price" className="w-full p-2 rounded bg-gray-700" />
          <input name="discounted_price_for_LUMS_student" value={formState.discounted_price_for_LUMS_student} onChange={handleChange} placeholder="Discounted Price" className="w-full p-2 rounded bg-gray-700" />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenuForm;
