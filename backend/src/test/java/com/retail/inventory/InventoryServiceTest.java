package com.retail.inventory;

import com.retail.inventory.dto.CategoryDTO;
import com.retail.inventory.dto.InventoryDTO;
import com.retail.inventory.dto.ProductDTO;
import com.retail.inventory.dto.WarehouseDTO;
import com.retail.inventory.service.CategoryService;
import com.retail.inventory.service.InventoryService;
import com.retail.inventory.service.ProductService;
import com.retail.inventory.service.WarehouseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class InventoryServiceTest {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private WarehouseService warehouseService;

    private Long productId1;
    private Long productId2;
    private Long warehouseId;

    @BeforeEach
    void setUp() {
        CategoryDTO cat = categoryService.createCategory(new CategoryDTO(null, "Storage Cat", "Storage Description"));

        ProductDTO p1 = new ProductDTO();
        p1.setProductName("USB Drive 64GB");
        p1.setProductPrice(15.99);
        p1.setSku("SKU-USB-64");
        p1.setCategoryId(cat.getCategoryId());
        ProductDTO createdP1 = productService.createProduct(p1);
        productId1 = createdP1.getProductId();

        ProductDTO p2 = new ProductDTO();
        p2.setProductName("USB Drive 128GB");
        p2.setProductPrice(24.99);
        p2.setSku("SKU-USB-128");
        p2.setCategoryId(cat.getCategoryId());
        ProductDTO createdP2 = productService.createProduct(p2);
        productId2 = createdP2.getProductId();

        WarehouseDTO w = new WarehouseDTO();
        w.setWarehouseName("Midwest Depot");
        w.setLocation("Denver, CO");
        w.setCapacity(5000);
        WarehouseDTO createdW = warehouseService.createWarehouse(w);
        warehouseId = createdW.getWarehouseId();
    }

    @Test
    @DisplayName("Should create inventory record correctly")
    void testCreateInventory() {
        InventoryDTO dto = new InventoryDTO();
        dto.setProductId(productId1);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(50);
        dto.setReorderLevel(20);

        InventoryDTO created = inventoryService.createInventory(dto);

        assertNotNull(created.getInventoryId());
        assertEquals(50, created.getQuantity());
        assertEquals(20, created.getReorderLevel());
        assertFalse(created.getLowStock(), "Quantity 50 is greater than reorder level 20, so lowStock should be false");
    }

    @Test
    @DisplayName("Should flag item as low stock when quantity <= reorderLevel")
    void testLowStockLogic() {
        // Case 1: quantity (10) <= reorderLevel (15) -> Low stock
        InventoryDTO lowStockDto = new InventoryDTO();
        lowStockDto.setProductId(productId1);
        lowStockDto.setWarehouseId(warehouseId);
        lowStockDto.setQuantity(10);
        lowStockDto.setReorderLevel(15);
        InventoryDTO createdLow = inventoryService.createInventory(lowStockDto);

        assertTrue(createdLow.getLowStock(), "Quantity 10 <= reorder level 15 must be flagged as low stock");

        // Case 2: quantity (50) > reorderLevel (20) -> Normal stock
        InventoryDTO normalStockDto = new InventoryDTO();
        normalStockDto.setProductId(productId2);
        normalStockDto.setWarehouseId(warehouseId);
        normalStockDto.setQuantity(50);
        normalStockDto.setReorderLevel(20);
        InventoryDTO createdNormal = inventoryService.createInventory(normalStockDto);

        assertFalse(createdNormal.getLowStock(), "Quantity 50 > reorder level 20 must NOT be low stock");

        // Verify low stock query returns the low stock item
        List<InventoryDTO> lowStockList = inventoryService.getLowStockInventory();
        boolean foundLowStock = lowStockList.stream()
                .anyMatch(i -> i.getProductId().equals(productId1) && i.getWarehouseId().equals(warehouseId));
        assertTrue(foundLowStock, "Low stock list should contain product 1");
    }
}
