import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Warehouse,
  Boxes,
  Truck,
  ShoppingCart,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
];

export default function Sidebar({ activeTab, setActiveTab, lowStockCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">📦</div>
        <div>
          <div className="brand-title">RetailIMS</div>
          <div className="brand-subtitle">Inventory Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.id === 'inventory' && lowStockCount > 0 && (
                <span className="nav-badge" title="Low stock items alert">
                  {lowStockCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>Academic Prototype v1.0</span>
        </div>
      </div>
    </aside>
  );
}
