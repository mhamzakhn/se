import api from './api';

export const fetchCart = () => api.get('/api/v1/cart');

export const addToCart = (item) => api.post('/api/v1/cart/add', item);

export const updateCartItem = (itemId, quantity) =>
  api.put(`/api/v1/cart/item/${itemId}`, { quantity });

export const removeCartItem = (itemId) =>
  api.delete(`/api/v1/cart/item/${itemId}`);

export const clearCart = () => api.delete('/api/v1/cart');
