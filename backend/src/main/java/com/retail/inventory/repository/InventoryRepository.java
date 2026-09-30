package com.retail.inventory.repository;

import com.retail.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductProductIdAndWarehouseWarehouseId(Long productId, Long warehouseId);

    List<Inventory> findByWarehouseWarehouseId(Long warehouseId);

    List<Inventory> findByProductProductId(Long productId);

    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.reorderLevel")
    List<Inventory> findLowStockItems();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantity <= i.reorderLevel")
    long countLowStockItems();
}
