import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Truck, Mail, Phone, MapPin } from 'lucide-react';
import Modal from '../components/Modal';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../services/api';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierEmail: '',
    supplierPhone: '',
    supplierAddress: ''
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getSuppliers();
      setSuppliers(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({
      supplierName: '',
      supplierEmail: '',
      supplierPhone: '',
      supplierAddress: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSupplier(s);
    setFormData({
      supplierName: s.supplierName,
      supplierEmail: s.supplierEmail,
      supplierPhone: s.supplierPhone || '',
      supplierAddress: s.supplierAddress || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (editingSupplier) {
        await updateSupplier(editingSupplier.supplierId, formData);
        setSuccessMsg('Supplier updated successfully!');
      } else {
        await createSupplier(formData);
        setSuccessMsg('Supplier created successfully!');
      }

      setIsModalOpen(false);
      fetchSuppliers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save supplier');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      setError('');
      await deleteSupplier(id);
      setSuccessMsg('Supplier deleted successfully!');
      fetchSuppliers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete supplier');
    }
  };

  return (
    <div className="page-body">
      <div className="page-header-actions">
        <div>
          <h2 className="page-title">Supplier Management</h2>
          <p className="page-subtitle">Vendor contacts, purchase agreements, and communication directory.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      {successMsg && <div className="alert-banner success">{successMsg}</div>}
      {error && <div className="alert-banner danger">{error}</div>}

      <div className="card-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier Name</th>
              <th>Email Address</th>
              <th>Phone</th>
              <th>Facility Address</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading suppliers directory...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <Truck size={36} />
                    <p>No vendor suppliers registered yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.supplierId}>
                  <td>#{s.supplierId}</td>
                  <td style={{ fontWeight: 600 }}>{s.supplierName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} color="var(--text-muted)" />
                      <a href={`mailto:${s.supplierEmail}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                        {s.supplierEmail}
                      </a>
                    </div>
                  </td>
                  <td>
                    {s.supplierPhone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={13} color="var(--text-muted)" />
                        <span>{s.supplierPhone}</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>
                    {s.supplierAddress ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '300px' }}>
                        <MapPin size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {s.supplierAddress}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        className="btn-icon"
                        title="Edit supplier"
                        onClick={() => handleOpenEdit(s)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Delete supplier"
                        onClick={() => handleDelete(s.supplierId)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Register New Supplier'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Supplier / Company Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Apex Global Supply Co."
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Business Email *</label>
              <input
                type="email"
                className="form-control"
                required
                placeholder="contact@company.com"
                value={formData.supplierEmail}
                onChange={(e) => setFormData({ ...formData, supplierEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+1-555-0199"
                value={formData.supplierPhone}
                onChange={(e) => setFormData({ ...formData, supplierPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Physical Address / Depot Location</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Suite, Street Address, City, Postal Code"
              value={formData.supplierAddress}
              onChange={(e) => setFormData({ ...formData, supplierAddress: e.target.value })}
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
              {editingSupplier ? 'Save Changes' : 'Register Supplier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
