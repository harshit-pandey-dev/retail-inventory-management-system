package com.retail.inventory.service;

import com.retail.inventory.dto.InventoryDTO;
import com.retail.inventory.entity.Inventory;
import com.retail.inventory.entity.Product;
import com.retail.inventory.entity.Warehouse;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            ProductRepository productRepository,
                            WarehouseRepository warehouseRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryDTO> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InventoryDTO getInventoryById(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));
        return mapToDTO(inventory);
    }

    public InventoryDTO createInventory(InventoryDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", dto.getProductId()));

        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", dto.getWarehouseId()));

        // Check if item already exists in this warehouse
        Optional<Inventory> existing = inventoryRepository.findByProductProductIdAndWarehouseWarehouseId(
                dto.getProductId(), dto.getWarehouseId()
        );

        Inventory inventory;
        if (existing.isPresent()) {
            // Update quantity and reorder level
            inventory = existing.get();
            inventory.setQuantity(dto.getQuantity());
            inventory.setReorderLevel(dto.getReorderLevel());
        } else {
            inventory = new Inventory(product, warehouse, dto.getQuantity(), dto.getReorderLevel());
        }

        // Validate warehouse capacity
        validateCapacity(warehouse, inventory, dto.getQuantity());

        Inventory saved = inventoryRepository.save(inventory);
        return mapToDTO(saved);
    }

    public InventoryDTO updateInventory(Long id, InventoryDTO dto) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", dto.getProductId()));

        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", dto.getWarehouseId()));

        // If product or warehouse changed, ensure no duplicate
        if (!inventory.getProduct().getProductId().equals(dto.getProductId()) ||
                !inventory.getWarehouse().getWarehouseId().equals(dto.getWarehouseId())) {
            Optional<Inventory> existing = inventoryRepository.findByProductProductIdAndWarehouseWarehouseId(
                    dto.getProductId(), dto.getWarehouseId()
            );
            if (existing.isPresent() && !existing.get().getInventoryId().equals(id)) {
                throw new BadRequestException("Inventory record for this product and warehouse already exists");
            }
        }

        validateCapacity(warehouse, inventory, dto.getQuantity());

        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);
        inventory.setQuantity(dto.getQuantity());
        inventory.setReorderLevel(dto.getReorderLevel());

        Inventory updated = inventoryRepository.save(inventory);
        return mapToDTO(updated);
    }

    public void deleteInventory(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));
        inventoryRepository.delete(inventory);
    }

    @Transactional(readOnly = true)
    public List<InventoryDTO> getLowStockInventory() {
        return inventoryRepository.findLowStockItems().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countLowStockItems() {
        return inventoryRepository.countLowStockItems();
    }

    private void validateCapacity(Warehouse warehouse, Inventory currentInventory, int newQuantity) {
        int otherItemsTotal = inventoryRepository.findByWarehouseWarehouseId(warehouse.getWarehouseId()).stream()
                .filter(i -> currentInventory.getInventoryId() == null || !i.getInventoryId().equals(currentInventory.getInventoryId()))
                .mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0)
                .sum();

        if (otherItemsTotal + newQuantity > warehouse.getCapacity()) {
            throw new BadRequestException("Total stock (" + (otherItemsTotal + newQuantity) + ") exceeds warehouse capacity (" + warehouse.getCapacity() + ")");
        }
    }

    public InventoryDTO mapToDTO(Inventory entity) {
        return new InventoryDTO(
                entity.getInventoryId(),
                entity.getProduct().getProductId(),
                entity.getProduct().getProductName(),
                entity.getProduct().getSku(),
                entity.getProduct().getProductPrice(),
                entity.getWarehouse().getWarehouseId(),
                entity.getWarehouse().getWarehouseName(),
                entity.getWarehouse().getLocation(),
                entity.getQuantity(),
                entity.getReorderLevel()
        );
    }
}
