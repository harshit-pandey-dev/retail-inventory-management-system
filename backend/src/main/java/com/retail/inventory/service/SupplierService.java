package com.retail.inventory.service;

import com.retail.inventory.dto.SupplierDTO;
import com.retail.inventory.entity.Supplier;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SupplierDTO getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        return mapToDTO(supplier);
    }

    public SupplierDTO createSupplier(SupplierDTO dto) {
        if (supplierRepository.existsBySupplierEmail(dto.getSupplierEmail())) {
            throw new BadRequestException("Supplier with email '" + dto.getSupplierEmail() + "' already exists");
        }

        Supplier supplier = new Supplier();
        supplier.setSupplierName(dto.getSupplierName().trim());
        supplier.setSupplierEmail(dto.getSupplierEmail().trim().toLowerCase());
        supplier.setSupplierPhone(dto.getSupplierPhone());
        supplier.setSupplierAddress(dto.getSupplierAddress());

        Supplier saved = supplierRepository.save(supplier);
        return mapToDTO(saved);
    }

    public SupplierDTO updateSupplier(Long id, SupplierDTO dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));

        String newEmail = dto.getSupplierEmail().trim().toLowerCase();
        if (!supplier.getSupplierEmail().equalsIgnoreCase(newEmail) && supplierRepository.existsBySupplierEmail(newEmail)) {
            throw new BadRequestException("Supplier with email '" + dto.getSupplierEmail() + "' already exists");
        }

        supplier.setSupplierName(dto.getSupplierName().trim());
        supplier.setSupplierEmail(newEmail);
        supplier.setSupplierPhone(dto.getSupplierPhone());
        supplier.setSupplierAddress(dto.getSupplierAddress());

        Supplier updated = supplierRepository.save(supplier);
        return mapToDTO(updated);
    }

    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        supplierRepository.delete(supplier);
    }

    public SupplierDTO mapToDTO(Supplier entity) {
        return new SupplierDTO(
                entity.getSupplierId(),
                entity.getSupplierName(),
                entity.getSupplierEmail(),
                entity.getSupplierPhone(),
                entity.getSupplierAddress()
        );
    }
}
