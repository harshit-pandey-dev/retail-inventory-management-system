package com.retail.inventory.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long warehouseId;

    @Column(nullable = false, length = 150)
    private String warehouseName;

    @Column(nullable = false, length = 250)
    private String location;

    @Column(nullable = false)
    private Integer capacity;

    public Warehouse() {
    }

    public Warehouse(String warehouseName, String location, Integer capacity) {
        this.warehouseName = warehouseName;
        this.location = location;
        this.capacity = capacity;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
}
