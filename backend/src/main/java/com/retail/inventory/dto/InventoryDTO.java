package com.retail.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class InventoryDTO {

    private Long inventoryId;

    @NotNull(message = "Product ID is required")
    private Long productId;

    private String productName;
    private String productSku;
    private Double productPrice;

    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;

    private String warehouseName;
    private String warehouseLocation;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Reorder level is required")
    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;

    private Boolean lowStock;

    public InventoryDTO() {
    }

    public InventoryDTO(Long inventoryId, Long productId, String productName, String productSku, Double productPrice,
                        Long warehouseId, String warehouseName, String warehouseLocation,
                        Integer quantity, Integer reorderLevel) {
        this.inventoryId = inventoryId;
        this.productId = productId;
        this.productName = productName;
        this.productSku = productSku;
        this.productPrice = productPrice;
        this.warehouseId = warehouseId;
        this.warehouseName = warehouseName;
        this.warehouseLocation = warehouseLocation;
        this.quantity = quantity;
        this.reorderLevel = reorderLevel;
        this.lowStock = quantity != null && reorderLevel != null && quantity <= reorderLevel;
    }

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductSku() {
        return productSku;
    }

    public void setProductSku(String productSku) {
        this.productSku = productSku;
    }

    public Double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }

    public String getWarehouseLocation() {
        return warehouseLocation;
    }

    public void setWarehouseLocation(String warehouseLocation) {
        this.warehouseLocation = warehouseLocation;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        if (this.reorderLevel != null) {
            this.lowStock = quantity <= this.reorderLevel;
        }
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
        if (this.quantity != null) {
            this.lowStock = this.quantity <= reorderLevel;
        }
    }

    public Boolean getLowStock() {
        return lowStock;
    }

    public void setLowStock(Boolean lowStock) {
        this.lowStock = lowStock;
    }
}
