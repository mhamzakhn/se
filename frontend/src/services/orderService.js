import api from './api';

export const getMyOrders = () => api.get('/api/v1/orders');

export const placeOrder = (instructions) =>
  api.post('/api/v1/orders/place', { instructions });

export const getPendingOrders = () => api.get('/api/v1/admin/orders/pending');

export const updateOrderStatus = (orderId, status) =>
  api.patch(`/api/v1/admin/orders/${orderId}`, { status });
