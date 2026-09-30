package com.retail.inventory.service;

import com.retail.inventory.dto.DashboardSummaryDTO;
import com.retail.inventory.dto.InventoryDTO;
import com.retail.inventory.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryService inventoryService;

    public DashboardService(ProductRepository productRepository,
                            CategoryRepository categoryRepository,
                            WarehouseRepository warehouseRepository,
                            SupplierRepository supplierRepository,
                            OrderRepository orderRepository,
                            InventoryRepository inventoryRepository,
                            InventoryService inventoryService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.warehouseRepository = warehouseRepository;
        this.supplierRepository = supplierRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.inventoryService = inventoryService;
    }

    public DashboardSummaryDTO getDashboardSummary() {
        long totalProducts = productRepository.count();
        long totalCategories = categoryRepository.count();
        long totalWarehouses = warehouseRepository.count();
        long totalSuppliers = supplierRepository.count();
        long totalOrders = orderRepository.count();
        long totalInventoryItems = inventoryRepository.count();
        long lowStockCount = inventoryRepository.countLowStockItems();
        List<InventoryDTO> lowStockDetails = inventoryService.getLowStockInventory();

        return new DashboardSummaryDTO(
                totalProducts,
                totalCategories,
                totalWarehouses,
                totalSuppliers,
                totalOrders,
                totalInventoryItems,
                lowStockCount,
                lowStockDetails
        );
    }
}
