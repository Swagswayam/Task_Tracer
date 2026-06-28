import { useState } from 'react';
import { Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';

const PRIORITY_LABEL = { low: '🟢 Low', medium: '🟡 Medium', high: '🔴 High' };
const STATUS_LABEL = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };

function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dueDate, status) {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date();
}

export default function TaskItem({ task, onEdit, onDelete, onStatusChange, deleting }) {
  const [statusLoading, setStatusLoading] = useState(false);
  const isCompleted = task.status === 'completed';

  const handleToggle = async () => {
    const nextStatus = isCompleted ? 'pending' : 'completed';
    setStatusLoading(true);
    await onStatusChange(task._id, nextStatus);
    setStatusLoading(false);
  };

  const handleStatusSelect = async (e) => {
    setStatusLoading(true);
    await onStatusChange(task._id, e.target.value);
    setStatusLoading(false);
  };

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className={`task-item${isCompleted ? ' completed-task' : ''}`}>
      <div className="task-header">
        {/* Toggle complete button */}
        <button
          className={`task-check${isCompleted ? ' checked' : ''}`}
          onClick={handleToggle}
          disabled={statusLoading || deleting}
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <div className="task-body">
          <div className="task-title">{task.title}</div>
          {task.description && <div className="task-desc">{task.description}</div>}
          <div className="task-meta">
            <span className={`badge badge-priority-${task.priority}`}>
              {PRIORITY_LABEL[task.priority]}
            </span>
            <select
              className="status-select"
              value={task.status}
              onChange={handleStatusSelect}
              disabled={statusLoading || deleting}
            >
              <option value="pending">⏳ Pending</option>
              <option value="in-progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
            {task.dueDate && (
              <span className={`task-due${overdue ? ' overdue' : ''}`}>
                📅 {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => onEdit(task)}
            disabled={deleting || statusLoading}
            title="Edit task"
          >
            <Edit2 size={15} />
          </button>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => onDelete(task._id)}
            disabled={deleting || statusLoading}
            title="Delete task"
            style={{ color: 'var(--danger)' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
