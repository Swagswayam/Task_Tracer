import { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckSquare } from 'lucide-react';

import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import FilterBar from './components/FilterBar';
import ConfirmModal from './components/ConfirmModal';
import { getTasks, createTask, updateTask, patchTaskStatus, deleteTask } from './api/tasks';

const INIT_FILTERS = { search: '', status: '', priority: '', sortBy: 'createdAt', order: 'desc' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState(INIT_FILTERS);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.order) params.order = filters.order;
      if (filters.search) params.search = filters.search;
      const res = await getTasks(params);
      setTasks(res.data || []);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, filters.search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  // Create task
  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      const res = await createTask(data);
      setTasks(prev => [res.data, ...prev]);
      toast.success('Task created!');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to create task';
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  // Update task
  const handleUpdate = async (data) => {
    if (!editTask) return;
    setFormLoading(true);
    try {
      const res = await updateTask(editTask._id, data);
      setTasks(prev => prev.map(t => t._id === res.data._id ? res.data : t));
      setEditTask(null);
      toast.success('Task updated!');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  // Status change (quick toggle)
  const handleStatusChange = async (id, status) => {
    try {
      const res = await patchTaskStatus(id, status);
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteTask(deleteTarget);
      setTasks(prev => prev.filter(t => t._id !== deleteTarget));
      toast.success('Task deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1d27', color: '#e8eaf0', border: '1px solid #2e3250' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
        }}
      />

      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <CheckSquare size={22} />
          <span>TaskFlow</span>
        </div>
        <div className="header-stats">
          <div className="stat-chip">
            <span className="dot" style={{ background: 'var(--pending)' }} />
            {stats.pending} pending
          </div>
          <div className="stat-chip">
            <span className="dot" style={{ background: 'var(--in-progress)' }} />
            {stats.inProgress} in progress
          </div>
          <div className="stat-chip">
            <span className="dot" style={{ background: 'var(--completed)' }} />
            {stats.completed} done
          </div>
        </div>
      </header>

      <main className="main">
        {/* Form */}
        <div className="card form-section">
          <TaskForm
            onSubmit={editTask ? handleUpdate : handleCreate}
            editTask={editTask}
            onCancelEdit={() => setEditTask(null)}
            loading={formLoading}
          />
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onChange={handleFiltersChange} />

        {/* Task list */}
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <CheckSquare size={48} />
            <p>No tasks found</p>
            <small>Add a task above or adjust your filters</small>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={setEditTask}
                onDelete={setDeleteTarget}
                onStatusChange={handleStatusChange}
                deleting={deleteTarget === task._id && deleteLoading}
              />
            ))}
          </div>
        )}
      </main>

      {/* Confirm delete modal */}
      {deleteTarget && (
        <ConfirmModal
          message="Delete this task? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
