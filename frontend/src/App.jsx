import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Warehouses from './pages/Warehouses';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Orders from './pages/Orders';
import { getDashboardSummary } from './services/api';

const pageTitles = {
  dashboard: 'Retail Inventory Overview',
  products: 'Products Catalog',
  categories: 'Product Categories',
  warehouses: 'Warehouse Facilities',
  inventory: 'Stock & Inventory Control',
  suppliers: 'Supplier Directory',
  orders: 'Customer & Wholesale Orders'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lowStockCount, setLowStockCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchGlobalStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardSummary();
      if (res.data?.lowStockItems !== undefined) {
        setLowStockCount(res.data.lowStockItems);
      }
    } catch (e) {
      // Keep silent for background polling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalStats();
  }, [activeTab, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key={refreshTrigger} setActiveTab={setActiveTab} />;
      case 'products':
        return <Products key={refreshTrigger} />;
      case 'categories':
        return <Categories key={refreshTrigger} />;
      case 'warehouses':
        return <Warehouses key={refreshTrigger} />;
      case 'inventory':
        return <Inventory key={refreshTrigger} onInventoryChange={fetchGlobalStats} />;
      case 'suppliers':
        return <Suppliers key={refreshTrigger} />;
      case 'orders':
        return <Orders key={refreshTrigger} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={lowStockCount}
      />
      <main className="main-content">
        <Header
          pageTitle={pageTitles[activeTab]}
          onRefresh={handleRefresh}
          loading={loading}
        />
        {renderActivePage()}
      </main>
    </div>
  );
}
