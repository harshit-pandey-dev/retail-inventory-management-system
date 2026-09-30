package com.retail.inventory.service;

import com.retail.inventory.dto.WarehouseDTO;
import com.retail.inventory.entity.Warehouse;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;

    public WarehouseService(WarehouseRepository warehouseRepository, InventoryRepository inventoryRepository) {
        this.warehouseRepository = warehouseRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public List<WarehouseDTO> getAllWarehouses() {
        return warehouseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WarehouseDTO getWarehouseById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", id));
        return mapToDTO(warehouse);
    }

    public WarehouseDTO createWarehouse(WarehouseDTO dto) {
        Warehouse warehouse = new Warehouse();
        warehouse.setWarehouseName(dto.getWarehouseName().trim());
        warehouse.setLocation(dto.getLocation().trim());
        warehouse.setCapacity(dto.getCapacity());

        Warehouse saved = warehouseRepository.save(warehouse);
        return mapToDTO(saved);
    }

    public WarehouseDTO updateWarehouse(Long id, WarehouseDTO dto) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", id));

        warehouse.setWarehouseName(dto.getWarehouseName().trim());
        warehouse.setLocation(dto.getLocation().trim());
        warehouse.setCapacity(dto.getCapacity());

        Warehouse updated = warehouseRepository.save(warehouse);
        return mapToDTO(updated);
    }

    public void deleteWarehouse(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", id));
        warehouseRepository.delete(warehouse);
    }

    public WarehouseDTO mapToDTO(Warehouse warehouse) {
        WarehouseDTO dto = new WarehouseDTO();
        dto.setWarehouseId(warehouse.getWarehouseId());
        dto.setWarehouseName(warehouse.getWarehouseName());
        dto.setLocation(warehouse.getLocation());
        dto.setCapacity(warehouse.getCapacity());

        int currentStock = inventoryRepository.findByWarehouseWarehouseId(warehouse.getWarehouseId())
                .stream()
                .mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0)
                .sum();
        dto.setCurrentStock(currentStock);
        return dto;
    }
}
