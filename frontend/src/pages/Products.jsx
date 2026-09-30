import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import Modal from '../components/Modal';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    sku: '',
    categoryId: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [prodRes, catRes] = await Promise.all([
        getProducts(selectedCategory || undefined),
        getCategories()
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      productName: '',
      productDescription: '',
      productPrice: '',
      sku: '',
      categoryId: categories[0]?.categoryId || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productDescription: product.productDescription || '',
      productPrice: product.productPrice,
      sku: product.sku,
      categoryId: product.categoryId
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        productPrice: parseFloat(formData.productPrice),
        sku: formData.sku.toUpperCase(),
        categoryId: parseInt(formData.categoryId, 10)
      };

      if (editingProduct) {
        await updateProduct(editingProduct.productId, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        await createProduct(payload);
        setSuccessMsg('Product created successfully!');
      }

      setIsModalOpen(false);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      setError('');
      await deleteProduct(productId);
      setSuccessMsg('Product deleted successfully!');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.productName?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term) ||
      p.categoryName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-body">
      <div className="page-header-actions">
        <div>
          <h2 className="page-title">Products Management</h2>
          <p className="page-subtitle">Add, edit, or configure retail catalog items and SKUs.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {successMsg && <div className="alert-banner success">{successMsg}</div>}
      {error && <div className="alert-banner danger">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="select-input"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="card-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Details</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading product catalog...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <Package size={36} />
                    <p>No products found matching your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.productId}>
                  <td>#{p.productId}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.productName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {p.productDescription || 'No description provided'}
                    </div>
                  </td>
                  <td>
                    <code>{p.sku}</code>
                  </td>
                  <td>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                      {p.categoryName || 'Unassigned'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ${p.productPrice?.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        className="btn-icon"
                        title="Edit product"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Delete product"
                        onClick={() => handleDelete(p.productId)}
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="e.g. Ergonomic Keyboard"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SKU (Stock Keeping Unit) *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. SKU-TECH-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                required
                placeholder="29.99"
                value={formData.productPrice}
                onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              className="form-control"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Product Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Detailed product specifications..."
              value={formData.productDescription}
              onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
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
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
