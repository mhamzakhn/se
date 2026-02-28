import api from './api';

export const getMenuItems = () => api.get('/api/v1/menu');

export const addMenuItem = (data) => api.post('/api/v1/admin/menu', data);

export const updateMenuItem = (id, data) =>
  api.put(`/api/v1/admin/menu/${id}`, data);

export const deleteMenuItem = (id) => api.delete(`/api/v1/admin/menu/${id}`);
