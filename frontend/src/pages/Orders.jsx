import React, { useEffect, useState } from 'react';
import {
  Plus,
  Eye,
  Trash2,
  ShoppingCart,
  Calendar,
  Warehouse,
  CheckCircle,
  Clock,
  XCircle,
  Truck
} from 'lucide-react';
import Modal from '../components/Modal';
import {
  getOrders,
  getWarehouses,
  getProducts,
  createOrder,
  updateOrderStatus,
  deleteOrder
} from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // New Order Form State
  const [warehouseId, setWarehouseId] = useState('');
  const [orderItems, setOrderItems] = useState([
    { productId: '', quantity: 1, price: 0 }
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [orderRes, whRes, prodRes] = await Promise.all([
        getOrders(),
        getWarehouses(),
        getProducts()
      ]);
      setOrders(orderRes.data || []);
      setWarehouses(whRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setWarehouseId(warehouses[0]?.warehouseId || '');
    const firstProd = products[0];
    setOrderItems([
      {
        productId: firstProd ? firstProd.productId : '',
        quantity: 1,
        price: firstProd ? firstProd.productPrice : 0
      }
    ]);
    setIsCreateModalOpen(true);
  };

  const handleAddItemRow = () => {
    const firstProd = products[0];
    setOrderItems([
      ...orderItems,
      {
        productId: firstProd ? firstProd.productId : '',
        quantity: 1,
        price: firstProd ? firstProd.productPrice : 0
      }
    ]);
  };

  const handleRemoveItemRow = (index) => {
    if (orderItems.length === 1) return;
    setOrderItems(orderItems.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...orderItems];
    if (field === 'productId') {
      const prod = products.find((p) => p.productId === parseInt(value, 10));
      updated[index] = {
        ...updated[index],
        productId: value,
        price: prod ? prod.productPrice : 0
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => {
      const q = parseInt(item.quantity, 10) || 0;
      const p = parseFloat(item.price) || 0;
      return sum + q * p;
    }, 0);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        warehouseId: parseInt(warehouseId, 10),
        status: 'PENDING',
        items: orderItems.map((i) => ({
          productId: parseInt(i.productId, 10),
          quantity: parseInt(i.quantity, 10),
          price: parseFloat(i.price)
        }))
      };

      await createOrder(payload);
      setSuccessMsg('Order placed successfully!');
      setIsCreateModalOpen(false);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to create order');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError('');
      await updateOrderStatus(orderId, newStatus);
      setSuccessMsg(`Order #${orderId} marked as ${newStatus}!`);
      fetchData();
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete Order #${orderId}?`)) return;
    try {
      setError('');
      await deleteOrder(orderId);
      setSuccessMsg('Order deleted successfully!');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete order');
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-pending"><Clock size={12} /> Pending</span>;
      case 'PROCESSING':
        return <span className="badge badge-processing"><Truck size={12} /> Processing</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed"><CheckCircle size={12} /> Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-cancelled"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-body">
      <div className="page-header-actions">
        <div>
          <h2 className="page-title">Order Management</h2>
          <p className="page-subtitle">Track wholesale shipments, client orders, and automated warehouse fulfillment.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} /> Create Order
        </button>
      </div>

      {successMsg && <div className="alert-banner success">{successMsg}</div>}
      {error && <div className="alert-banner danger">{error}</div>}

      <div className="card-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date Placed</th>
              <th>Target Warehouse</th>
              <th>Items Count</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Change Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading order records...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    <ShoppingCart size={36} />
                    <p>No orders on record. Click 'Create Order' to submit one.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.orderId}>
                  <td style={{ fontWeight: 700 }}>#{o.orderId}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} color="var(--text-muted)" />
                      <span>{new Date(o.orderDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>{o.warehouseName}</td>
                  <td>{o.items?.length || 0} line items</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ${o.totalAmount?.toFixed(2)}
                  </td>
                  <td>{renderStatusBadge(o.status)}</td>
                  <td>
                    <select
                      className="select-input"
                      style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        className="btn-icon"
                        title="View order details"
                        onClick={() => {
                          setSelectedOrder(o);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Delete order"
                        onClick={() => handleDelete(o.orderId)}
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

      {/* Order Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Order Details #${selectedOrder?.orderId}`}
      >
        {selectedOrder && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Warehouse</div>
                <div style={{ fontWeight: 600 }}>{selectedOrder.warehouseName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Status</div>
                <div>{renderStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
                  ${selectedOrder.totalAmount?.toFixed(2)}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>Ordered Items:</h4>
            <div className="card-table-wrapper" style={{ marginBottom: '16px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{item.productName}</td>
                      <td><code>{item.productSku}</code></td>
                      <td>{item.quantity}</td>
                      <td>${item.price?.toFixed(2)}</td>
                      <td style={{ fontWeight: 700 }}>
                        ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Customer Order"
      >
        <form onSubmit={handleCreateOrder}>
          <div className="form-group">
            <label>Fulfillment Warehouse *</label>
            <select
              className="form-control"
              required
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((w) => (
                <option key={w.warehouseId} value={w.warehouseId}>
                  {w.warehouseName} ({w.location})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Order Items *</label>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddItemRow}
            >
              + Add Item
            </button>
          </div>

          {orderItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr auto',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '10px'
              }}
            >
              <select
                className="form-control"
                required
                value={item.productId}
                onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.productName} (${p.productPrice})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                className="form-control"
                required
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
              />

              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                required
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
              />

              <button
                type="button"
                className="btn-icon delete"
                title="Remove item row"
                disabled={orderItems.length === 1}
                onClick={() => handleRemoveItemRow(idx)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: '#f8fafc',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600 }}>Estimated Order Total:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
              ${calculateTotal().toFixed(2)}
            </span>
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Place Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
