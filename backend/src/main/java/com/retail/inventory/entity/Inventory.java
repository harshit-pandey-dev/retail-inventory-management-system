package com.retail.inventory.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inventories",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_inventory_product_warehouse", columnNames = {"product_id", "warehouse_id"})
    },
    indexes = {
        @Index(name = "idx_inventory_product", columnList = "product_id"),
        @Index(name = "idx_inventory_warehouse", columnList = "warehouse_id")
    }
)
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer reorderLevel;

    public Inventory() {
    }

    public Inventory(Product product, Warehouse warehouse, Integer quantity, Integer reorderLevel) {
        this.product = product;
        this.warehouse = warehouse;
        this.quantity = quantity;
        this.reorderLevel = reorderLevel;
    }

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Warehouse getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    @Transient
    public boolean isLowStock() {
        return quantity != null && reorderLevel != null && quantity <= reorderLevel;
    }
}
