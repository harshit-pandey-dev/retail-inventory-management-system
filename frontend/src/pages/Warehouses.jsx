import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Warehouse as WarehouseIcon } from 'lucide-react';
import Modal from '../components/Modal';
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} from '../services/api';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    warehouseName: '',
    location: '',
    capacity: ''
  });

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getWarehouses();
      setWarehouses(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleOpenAdd = () => {
    setEditingWarehouse(null);
    setFormData({ warehouseName: '', location: '', capacity: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w) => {
    setEditingWarehouse(w);
    setFormData({
      warehouseName: w.warehouseName,
      location: w.location,
      capacity: w.capacity
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        warehouseName: formData.warehouseName,
        location: formData.location,
        capacity: parseInt(formData.capacity, 10)
      };

      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse.warehouseId, payload);
        setSuccessMsg('Warehouse updated successfully!');
      } else {
        await createWarehouse(payload);
        setSuccessMsg('Warehouse created successfully!');
      }

      setIsModalOpen(false);
      fetchWarehouses();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save warehouse');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this warehouse? All assigned inventory records will be deleted.')) return;
    try {
      setError('');
      await deleteWarehouse(id);
      setSuccessMsg('Warehouse deleted successfully!');
      fetchWarehouses();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete warehouse');
    }
  };

  return (
    <div className="page-body">
      <div className="page-header-actions">
        <div>
          <h2 className="page-title">Warehouse Management</h2>
          <p className="page-subtitle">Manage physical facilities, regional distribution centers, and capacity.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Warehouse
        </button>
      </div>

      {successMsg && <div className="alert-banner success">{successMsg}</div>}
      {error && <div className="alert-banner danger">{error}</div>}

      <div className="card-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Warehouse Name</th>
              <th>Location Address</th>
              <th>Total Capacity</th>
              <th>Occupied Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading warehouses...
                </td>
              </tr>
            ) : warehouses.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <WarehouseIcon size={36} />
                    <p>No warehouses registered yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              warehouses.map((w) => {
                const stockPercent = Math.min(100, Math.round(((w.currentStock || 0) / w.capacity) * 100));
                return (
                  <tr key={w.warehouseId}>
                    <td>#{w.warehouseId}</td>
                    <td style={{ fontWeight: 600 }}>{w.warehouseName}</td>
                    <td>{w.location}</td>
                    <td>{w.capacity?.toLocaleString()} units</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600 }}>{w.currentStock || 0} units</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({stockPercent}%)</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn-icon"
                          title="Edit warehouse"
                          onClick={() => handleOpenEdit(w)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete warehouse"
                          onClick={() => handleDelete(w.warehouseId)}
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
        title={editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Warehouse Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. West Coast Fulfillment Center"
              value={formData.warehouseName}
              onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Location / Address *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. 100 Logistics Blvd, City, State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Max Storage Capacity (Units) *</label>
            <input
              type="number"
              min="1"
              className="form-control"
              required
              placeholder="e.g. 5000"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          </div>
          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingWarehouse ? 'Save Changes' : 'Create Warehouse'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
