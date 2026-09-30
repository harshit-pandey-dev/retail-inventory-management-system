package com.retail.inventory.controller;

import com.retail.inventory.dto.ApiResponse;
import com.retail.inventory.dto.WarehouseDTO;
import com.retail.inventory.service.WarehouseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "*")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WarehouseDTO>>> getAllWarehouses() {
        List<WarehouseDTO> warehouses = warehouseService.getAllWarehouses();
        return ResponseEntity.ok(ApiResponse.ok(warehouses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WarehouseDTO>> getWarehouseById(@PathVariable Long id) {
        WarehouseDTO warehouse = warehouseService.getWarehouseById(id);
        return ResponseEntity.ok(ApiResponse.ok(warehouse));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WarehouseDTO>> createWarehouse(@Valid @RequestBody WarehouseDTO dto) {
        WarehouseDTO created = warehouseService.createWarehouse(dto);
        return new ResponseEntity<>(ApiResponse.ok("Warehouse created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WarehouseDTO>> updateWarehouse(@PathVariable Long id,
                                                                     @Valid @RequestBody WarehouseDTO dto) {
        WarehouseDTO updated = warehouseService.updateWarehouse(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Warehouse updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWarehouse(@PathVariable Long id) {
        warehouseService.deleteWarehouse(id);
        return ResponseEntity.ok(ApiResponse.ok("Warehouse deleted successfully", null));
    }
}
