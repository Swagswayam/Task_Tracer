import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const getTasks = (params = {}) =>
  api.get('/tasks', { params }).then(r => r.data);

export const getTask = (id) =>
  api.get(`/tasks/${id}`).then(r => r.data);

export const createTask = (data) =>
  api.post('/tasks', data).then(r => r.data);

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data).then(r => r.data);

export const patchTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status }).then(r => r.data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then(r => r.data);
