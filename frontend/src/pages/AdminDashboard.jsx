import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Check, Ban } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user && isAdmin) {
      fetch("http://localhost:4000/api/v1/admin/orders/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => setPendingOrders(data))
        .catch(err => console.error("Failed to fetch pending orders:", err))
        .finally(() => setLoading(false));
    } else if (user && !isAdmin) {
      setLoading(false);
    }
  }, [user, isAdmin]);

  const handleAction = async (orderId, status) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error("Failed to update order status");
      const updated = await res.json();
      setPendingOrders(prev => prev.filter(order => order._id !== updated._id));
      alert(`Order #${updated._id.slice(0, 8)} marked as ${status}`);
    } catch (err) {
      alert("Error updating order: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading dashboard...</div>;
  }

  if (user && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const toggleExpanded = (orderId) => {
    setExpanded((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div className="min-h-screen bg-restaurant-primary py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard - Pending Orders</h1>

        {pendingOrders.length > 0 ? (
          <div className="space-y-6">
            {pendingOrders.map(order => (
              <div key={order._id} className="bg-[#101214] rounded-lg p-4 shadow-lg text-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">
                      Order #{order._id.slice(0, 8)}
                    </h2>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">{order.user?.name}</span> • {order.user?.email}
                    </p>
                    {order.user?.phone && (
                      <p className="text-sm text-gray-400">{order.user.phone}</p>
                    )}
                    <p className="text-sm text-gray-300 mt-1">
                      {order.items.length} item(s) • Total: PKR {
                        order.user?.student_status === 'student'
                          ? order.items.reduce((sum, item) => sum + item.discounted_price_for_LUMS_student * item.quantity, 0)
                          : order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                      }
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    {order.instructions && order.instructions.trim() !== "" && (
                      <div className="mt-3 text-sm text-white-300">
                        <strong>Instructions:</strong> {order.instructions}
                      </div>
                    )}

                    <button
                      onClick={() => toggleExpanded(order._id)}
                      className="text-sm mt-2 text-blue-400 hover:text-blue-300 underline"
                    >
                      {expanded[order._id] ? 'Hide items' : 'View items'}
                    </button>

                    {expanded[order._id] && (
                      <ul className="mt-3 pl-5 list-disc text-sm text-gray-200 space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.quantity} — PKR {item.price}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(order._id, 'confirmed')}
                      className="p-2 rounded-full bg-green-900 hover:bg-green-800 text-green-200"
                      title="Mark as confirmed"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAction(order._id, 'cancelled')}
                      className="p-2 rounded-full bg-red-900 hover:bg-red-800 text-red-200"
                      title="Cancel order"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#101214] text-center py-12 rounded-lg text-white shadow">
            <p className="text-lg font-medium">No pending orders 🎉</p>
            <p className="text-sm text-gray-400 mt-2">All caught up for now!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
