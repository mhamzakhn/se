import React from "react";

const AdminMenuCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg relative">
      <img
        src={item.imageUrl || "/BeefChilliDry.jpeg"}
        alt={item.name}
        className="w-full h-40 object-contain mb-4 rounded bg-gray-900"
      />
      <div className="text-lg font-semibold mb-2">{item.name}</div>
      <p className="text-sm text-gray-400 mb-1">Category: {item.category}</p>
      <p className="text-sm text-gray-400 mb-1">Price: PKR {item.price}</p>
      <p className="text-sm text-gray-400 mb-4">Student Price: PKR {item.discounted_price_for_LUMS_student}</p>
      <div className="flex justify-between">
        <button onClick={() => onEdit(item)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          Edit
        </button>
        <button onClick={() => onDelete(item._id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminMenuCard;
