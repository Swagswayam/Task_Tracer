import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <div className="modal-body" style={{ textAlign: 'center', padding: '28px 24px' }}>
          <AlertTriangle size={36} color="var(--danger)" style={{ margin: '0 auto 14px' }} />
          <p style={{ fontSize: '0.97rem', marginBottom: 20, color: 'var(--text)' }}>
            {message || 'Are you sure?'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
