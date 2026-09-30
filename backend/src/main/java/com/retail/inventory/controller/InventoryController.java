package com.retail.inventory.controller;

import com.retail.inventory.dto.ApiResponse;
import com.retail.inventory.dto.InventoryDTO;
import com.retail.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryDTO>>> getAllInventory(
            @RequestParam(required = false, defaultValue = "false") boolean lowStockOnly) {
        List<InventoryDTO> inventory = lowStockOnly
                ? inventoryService.getLowStockInventory()
                : inventoryService.getAllInventory();
        return ResponseEntity.ok(ApiResponse.ok(inventory));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryDTO>> getInventoryById(@PathVariable Long id) {
        InventoryDTO inventory = inventoryService.getInventoryById(id);
        return ResponseEntity.ok(ApiResponse.ok(inventory));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<InventoryDTO>>> getLowStockInventory() {
        List<InventoryDTO> lowStock = inventoryService.getLowStockInventory();
        return ResponseEntity.ok(ApiResponse.ok("Low stock items retrieved", lowStock));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryDTO>> createInventory(@Valid @RequestBody InventoryDTO dto) {
        InventoryDTO created = inventoryService.createInventory(dto);
        return new ResponseEntity<>(ApiResponse.ok("Inventory record created/updated successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryDTO>> updateInventory(@PathVariable Long id,
                                                                     @Valid @RequestBody InventoryDTO dto) {
        InventoryDTO updated = inventoryService.updateInventory(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Inventory record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.ok(ApiResponse.ok("Inventory record deleted successfully", null));
    }
}
