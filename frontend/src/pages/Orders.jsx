import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center mt-20">{error}</div>;
  }

  return (
    <div className="bg-restaurant-primary min-h-screen py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-white mb-10">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-lg mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/menu"
            className="inline-block px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-medium rounded-md"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-gray-900 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'bg-gray-700 text-gray-300'}`}>
                  {order.status}
                </span>
              </div>

              <div className="divide-y divide-gray-800">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 text-sm">
                    <span className="text-gray-300">
                      {item.name} <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span className="text-white">PKR {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {order.instructions && (
                <p className="text-xs text-gray-500 mt-3 italic">
                  Instructions: {order.instructions}
                </p>
              )}

              <div className="flex justify-between mt-4 pt-3 border-t border-gray-800">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold">PKR {order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
