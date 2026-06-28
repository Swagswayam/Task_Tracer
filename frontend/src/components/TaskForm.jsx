import { useState, useEffect } from 'react';
import { PlusCircle, Edit3 } from 'lucide-react';

const INITIAL = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' };

function validate(fields) {
  const errs = {};
  if (!fields.title.trim()) errs.title = 'Title is required';
  else if (fields.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
  else if (fields.title.trim().length > 100) errs.title = 'Title cannot exceed 100 characters';
  if (fields.description.length > 500) errs.description = 'Description cannot exceed 500 characters';
  return errs;
}

export default function TaskForm({ onSubmit, editTask, onCancelEdit, loading }) {
  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const isEdit = !!editTask;

  useEffect(() => {
    if (editTask) {
      setFields({
        title: editTask.title || '',
        description: editTask.description || '',
        status: editTask.status || 'pending',
        priority: editTask.priority || 'medium',
        dueDate: editTask.dueDate ? editTask.dueDate.slice(0, 10) : ''
      });
      setErrors({});
    } else {
      setFields(INITIAL);
      setErrors({});
    }
  }, [editTask]);

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const payload = { ...fields };
    if (!payload.dueDate) delete payload.dueDate;
    await onSubmit(payload);
    if (!isEdit) setFields(INITIAL);
  };

  const handleCancel = () => {
    setFields(INITIAL);
    setErrors({});
    onCancelEdit?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-title">
        {isEdit ? <><Edit3 size={16} /> Edit Task</> : <><PlusCircle size={16} /> Add New Task</>}
      </div>
      <div className="form-grid">
        <div className="form-group form-full">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            placeholder="What needs to be done?"
            value={fields.title}
            onChange={set('title')}
            className={errors.title ? 'error' : ''}
            maxLength={100}
          />
          {errors.title && <span className="error-msg">{errors.title}</span>}
        </div>

        <div className="form-group form-full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Optional details..."
            value={fields.description}
            onChange={set('description')}
            className={errors.description ? 'error' : ''}
            maxLength={500}
          />
          {errors.description && <span className="error-msg">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={fields.priority} onChange={set('priority')}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" value={fields.status} onChange={set('status')}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={fields.dueDate}
            onChange={set('dueDate')}
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>

      <div className="form-actions">
        {isEdit && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : '+ Add Task')}
        </button>
      </div>
    </form>
  );
}
