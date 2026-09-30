import React from 'react';

export default function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value !== undefined && value !== null ? value : '-'}</div>
      </div>
      {Icon && (
        <div className={`stat-icon ${colorClass || 'indigo'}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
