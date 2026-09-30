import React, { useEffect, useState } from 'react';
import {
  Package,
  Warehouse,
  Truck,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Layers
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { getDashboardSummary } from '../services/api';

export default function Dashboard({ setActiveTab }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getDashboardSummary();
      setSummary(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="page-body">
      <div className="page-header-actions">
        <div>
          <h2 className="page-title">Executive Dashboard</h2>
          <p className="page-subtitle">Real-time overview of retail inventory, orders, and logistics.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('orders')}>
            + New Order
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('inventory')}>
            Manage Inventory
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-banner danger">
          <span>{error}</span>
          <button className="btn btn-sm btn-secondary" onClick={fetchSummary}>Retry</button>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Products"
          value={summary?.totalProducts}
          icon={Package}
          colorClass="indigo"
        />
        <StatCard
          label="Total Warehouses"
          value={summary?.totalWarehouses}
          icon={Warehouse}
          colorClass="emerald"
        />
        <StatCard
          label="Total Suppliers"
          value={summary?.totalSuppliers}
          icon={Truck}
          colorClass="sky"
        />
        <StatCard
          label="Total Orders"
          value={summary?.totalOrders}
          icon={ShoppingCart}
          colorClass="amber"
        />
        <StatCard
          label="Low Stock Items"
          value={summary?.lowStockItems}
          icon={AlertTriangle}
          colorClass="rose"
        />
      </div>

      {/* Low Stock Warning Section */}
      {summary?.lowStockItems > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '12px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                background: '#e11d48',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingDown size={20} />
              </div>
              <div>
                <h4 style={{ color: '#9f1239', fontWeight: 700, fontSize: '1rem' }}>
                  Attention Required: {summary.lowStockItems} Items Below Reorder Level
                </h4>
                <p style={{ color: '#be123c', fontSize: '0.825rem' }}>
                  Items have fallen below their safety threshold (Quantity &le; Reorder Level). Restock promptly.
                </p>
              </div>
            </div>
            <button
              className="btn btn-sm"
              style={{ background: '#e11d48', color: '#fff' }}
              onClick={() => setActiveTab('inventory')}
            >
              Review All in Inventory <ArrowRight size={14} />
            </button>
          </div>

          {summary.lowStockDetails && summary.lowStockDetails.length > 0 && (
            <div className="card-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Warehouse</th>
                    <th>Current Stock</th>
                    <th>Reorder Level</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.lowStockDetails.slice(0, 5).map((item) => (
                    <tr key={item.inventoryId}>
                      <td style={{ fontWeight: 600 }}>{item.productName}</td>
                      <td><code>{item.productSku}</code></td>
                      <td>{item.warehouseName}</td>
                      <td style={{ color: '#e11d48', fontWeight: 700 }}>{item.quantity} units</td>
                      <td>{item.reorderLevel} units</td>
                      <td>
                        <span className="badge badge-low-stock">
                          <AlertTriangle size={12} /> Low Stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, marginBottom: '6px' }}>
              <Package size={18} />
              <span>Catalog & Categories</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Manage {summary?.totalProducts || 0} products classified under {summary?.totalCategories || 0} categories.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '16px', alignSelf: 'flex-start' }}
            onClick={() => setActiveTab('products')}
          >
            Open Products Catalog &rarr;
          </button>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700, marginBottom: '6px' }}>
              <Warehouse size={18} />
              <span>Warehouses & Storage</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Monitor {summary?.totalWarehouses || 0} regional distribution centers and warehouse capacities.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '16px', alignSelf: 'flex-start' }}
            onClick={() => setActiveTab('warehouses')}
          >
            View Warehouse Facilities &rarr;
          </button>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontWeight: 700, marginBottom: '6px' }}>
              <ShoppingCart size={18} />
              <span>Customer Orders</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Track {summary?.totalOrders || 0} orders with automated item allocation and fulfillment status.
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '16px', alignSelf: 'flex-start' }}
            onClick={() => setActiveTab('orders')}
          >
            Process Orders &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
