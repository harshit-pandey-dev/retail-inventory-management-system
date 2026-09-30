package com.retail.inventory.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardSummaryDTO {

    private long totalProducts;
    private long totalCategories;
    private long totalWarehouses;
    private long totalSuppliers;
    private long totalOrders;
    private long totalInventoryItems;
    private long lowStockItems;
    private List<InventoryDTO> lowStockDetails = new ArrayList<>();

    public DashboardSummaryDTO() {
    }

    public DashboardSummaryDTO(long totalProducts, long totalCategories, long totalWarehouses,
                               long totalSuppliers, long totalOrders, long totalInventoryItems,
                               long lowStockItems, List<InventoryDTO> lowStockDetails) {
        this.totalProducts = totalProducts;
        this.totalCategories = totalCategories;
        this.totalWarehouses = totalWarehouses;
        this.totalSuppliers = totalSuppliers;
        this.totalOrders = totalOrders;
        this.totalInventoryItems = totalInventoryItems;
        this.lowStockItems = lowStockItems;
        this.lowStockDetails = lowStockDetails;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getTotalWarehouses() {
        return totalWarehouses;
    }

    public void setTotalWarehouses(long totalWarehouses) {
        this.totalWarehouses = totalWarehouses;
    }

    public long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getTotalInventoryItems() {
        return totalInventoryItems;
    }

    public void setTotalInventoryItems(long totalInventoryItems) {
        this.totalInventoryItems = totalInventoryItems;
    }

    public long getLowStockItems() {
        return lowStockItems;
    }

    public void setLowStockItems(long lowStockItems) {
        this.lowStockItems = lowStockItems;
    }

    public List<InventoryDTO> getLowStockDetails() {
        return lowStockDetails;
    }

    public void setLowStockDetails(List<InventoryDTO> lowStockDetails) {
        this.lowStockDetails = lowStockDetails;
    }
}
