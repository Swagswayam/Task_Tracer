import { Search, ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export default function FilterBar({ filters, onChange }) {
  const set = (k) => (e) => onChange({ ...filters, [k]: e.target.value });

  const toggleOrder = () =>
    onChange({ ...filters, order: filters.order === 'asc' ? 'desc' : 'asc' });

  return (
    <div className="filter-bar">
      <div className="search-wrap">
        <Search size={15} />
        <input
          type="text"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={set('search')}
        />
      </div>

      <select value={filters.status} onChange={set('status')}>
        <option value="">All Status</option>
        <option value="pending">⏳ Pending</option>
        <option value="in-progress">🔄 In Progress</option>
        <option value="completed">✅ Completed</option>
      </select>

      <select value={filters.priority} onChange={set('priority')}>
        <option value="">All Priority</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>

      <select value={filters.sortBy} onChange={set('sortBy')}>
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <button className="sort-btn" onClick={toggleOrder} title="Toggle sort order">
        <ArrowUpDown size={14} />
        {filters.order === 'asc' ? 'Asc' : 'Desc'}
      </button>
    </div>
  );
}
