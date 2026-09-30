import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to easily access response data and standardize errors
api.interceptors.response.use(
  (response) => {
    // If wrapped in our backend ApiResponse<T>, unwrap data where appropriate
    if (response.data && response.data.data !== undefined) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected server error occurred';
    return Promise.reject(new Error(errorMsg));
  }
);

// 1. Dashboard
export const getDashboardSummary = () => api.get('/dashboard/summary');

// 2. Products
export const getProducts = (categoryId) =>
  api.get('/products', { params: categoryId ? { categoryId } : {} });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// 3. Categories
export const getCategories = () => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// 4. Warehouses
export const getWarehouses = () => api.get('/warehouses');
export const getWarehouseById = (id) => api.get(`/warehouses/${id}`);
export const createWarehouse = (data) => api.post('/warehouses', data);
export const updateWarehouse = (id, data) => api.put(`/warehouses/${id}`, data);
export const deleteWarehouse = (id) => api.delete(`/warehouses/${id}`);

// 5. Inventory
export const getInventory = (lowStockOnly = false) =>
  api.get('/inventory', { params: { lowStockOnly } });
export const getInventoryById = (id) => api.get(`/inventory/${id}`);
export const getLowStockInventory = () => api.get('/inventory/low-stock');
export const createInventory = (data) => api.post('/inventory', data);
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);

// 6. Suppliers
export const getSuppliers = () => api.get('/suppliers');
export const getSupplierById = (id) => api.get(`/suppliers/${id}`);
export const createSupplier = (data) => api.post('/suppliers', data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`);

// 7. Orders
export const getOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
