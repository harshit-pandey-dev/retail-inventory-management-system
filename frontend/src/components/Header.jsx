import React from 'react';
import { RefreshCw, Database } from 'lucide-react';

export default function Header({ pageTitle, onRefresh, loading }) {
  return (
    <header className="top-header">
      <div className="header-title-group">
        <h1>{pageTitle}</h1>
      </div>

      <div className="header-actions">
        <div className="badge-indicator">
          <Database size={14} />
          <span>PostgreSQL Active</span>
        </div>

        {onRefresh && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh current data"
          >
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
            <span>Refresh</span>
          </button>
        )}
      </div>
    </header>
  );
}
