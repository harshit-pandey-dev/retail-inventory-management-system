import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, CheckCircle, Boxes, Filter } from 'lucide-react';
import Modal from '../components/Modal';
import {
  getInventory,
  getProducts,
  getWarehouses,
  createInventory,
  updateInventory,
  deleteInventory
} from '../services/api';

export default function Inventory({ onInventoryChange }) {
  const [inventoryList, setInventoryList] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: '',
    reorderLevel: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [invRes, prodRes, whRes] = await Promise.all([
        getInventory(lowStockFilter),
        getProducts(),
        getWarehouses()
      ]);
      setInventoryList(invRes.data || []);
      setProducts(prodRes.data || []);
      setWarehouses(whRes.data || []);
      if (onInventoryChange) onInventoryChange();
    } catch (err) {
      setError(err.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lowStockFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      productId: products[0]?.productId || '',
      warehouseId: warehouses[0]?.warehouseId || '',
      quantity: '',
      reorderLevel: '10'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      productId: item.productId,
      warehouseId: item.warehouseId,
      quantity: item.quantity,
      reorderLevel: item.reorderLevel
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        productId: parseInt(formData.productId, 10),
        warehouseId: parseInt(formData.warehouseId, 10),
        quantity: parseInt(formData.quantity, 10),
        reorderLevel: parseInt(formData.reorderLevel, 10)
      };

      if (editingItem) {
        await updateInventory(editingItem.inventoryId, payload);
        setSuccessMsg('Inventory allocation updated successfully!');
      } else {
        await createInventory(payload);
        setSuccessMsg('Inventory allocation created/updated successfully!');
      }

      setIsModalOpen(false);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save inventory record');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this inventory record?')) return;
    try {
      setError('');
      await deleteInventory(id);
      setSuccessMsg('Inventory record removed successfully!');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete inventory record');
    }
  };

  return (
    <div className="page-body">
      <div className="page-header-actions">
        <div>
          <h2 className="page-title">Inventory Stock Levels</h2>
          <p className="page-subtitle">Track product stock per warehouse with automatic low-stock threshold detection.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`btn ${lowStockFilter ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setLowStockFilter(!lowStockFilter)}
          >
            <Filter size={16} />
            {lowStockFilter ? 'Showing Low Stock Only' : 'Filter Low Stock'}
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Assign Stock
          </button>
        </div>
      </div>

      {successMsg && <div className="alert-banner success">{successMsg}</div>}
      {error && <div className="alert-banner danger">{error}</div>}

      <div className="card-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Warehouse Facility</th>
              <th>Available Qty</th>
              <th>Reorder Level</th>
              <th>Stock Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading inventory status...
                </td>
              </tr>
            ) : inventoryList.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    <Boxes size={36} />
                    <p>{lowStockFilter ? 'Great news! No items are currently below reorder level.' : 'No inventory allocations found.'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              inventoryList.map((item) => {
                const isLow = item.quantity <= item.reorderLevel;
                return (
                  <tr key={item.inventoryId} style={{ background: isLow ? '#fffbfb' : 'inherit' }}>
                    <td>#{item.inventoryId}</td>
                    <td style={{ fontWeight: 600 }}>{item.productName}</td>
                    <td><code>{item.productSku}</code></td>
                    <td>{item.warehouseName}</td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: isLow ? 'var(--danger)' : 'var(--text-main)'
                      }}>
                        {item.quantity} units
                      </span>
                    </td>
                    <td>{item.reorderLevel} units</td>
                    <td>
                      {isLow ? (
                        <span className="badge badge-low-stock">
                          <AlertTriangle size={12} /> Low Stock Alert
                        </span>
                      ) : (
                        <span className="badge badge-normal-stock">
                          <CheckCircle size={12} /> Optimal Stock
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn-icon"
                          title="Adjust stock"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Remove inventory record"
                          onClick={() => handleDelete(item.inventoryId)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Adjust Inventory Stock' : 'Allocate Inventory to Warehouse'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product *</label>
            <select
              className="form-control"
              required
              disabled={!!editingItem}
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.productName} ({p.sku}) - ${p.productPrice}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Warehouse *</label>
            <select
              className="form-control"
              required
              disabled={!!editingItem}
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((w) => (
                <option key={w.warehouseId} value={w.warehouseId}>
                  {w.warehouseName} (Cap: {w.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Current Quantity *</label>
              <input
                type="number"
                min="0"
                className="form-control"
                required
                placeholder="e.g. 50"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Reorder Level (Safety Threshold) *</label>
              <input
                type="number"
                min="0"
                className="form-control"
                required
                placeholder="e.g. 15"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
              />
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            ℹ️ Low stock alert triggers whenever <strong>Quantity &le; Reorder Level</strong>.
          </p>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update Stock' : 'Allocate Stock'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
