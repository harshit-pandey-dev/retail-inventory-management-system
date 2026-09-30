package com.retail.inventory.repository;

import com.retail.inventory.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findBySupplierEmail(String supplierEmail);
    boolean existsBySupplierEmail(String supplierEmail);
}
