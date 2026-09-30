package com.retail.inventory.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SupplierDTO {

    private Long supplierId;

    @NotBlank(message = "Supplier name is required")
    @Size(max = 150, message = "Supplier name cannot exceed 150 characters")
    private String supplierName;

    @NotBlank(message = "Supplier email is required")
    @Email(message = "Supplier email must be a valid email address")
    @Size(max = 150, message = "Supplier email cannot exceed 150 characters")
    private String supplierEmail;

    @Size(max = 30, message = "Phone cannot exceed 30 characters")
    private String supplierPhone;

    @Size(max = 300, message = "Address cannot exceed 300 characters")
    private String supplierAddress;

    public SupplierDTO() {
    }

    public SupplierDTO(Long supplierId, String supplierName, String supplierEmail, String supplierPhone, String supplierAddress) {
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.supplierEmail = supplierEmail;
        this.supplierPhone = supplierPhone;
        this.supplierAddress = supplierAddress;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getSupplierEmail() {
        return supplierEmail;
    }

    public void setSupplierEmail(String supplierEmail) {
        this.supplierEmail = supplierEmail;
    }

    public String getSupplierPhone() {
        return supplierPhone;
    }

    public void setSupplierPhone(String supplierPhone) {
        this.supplierPhone = supplierPhone;
    }

    public String getSupplierAddress() {
        return supplierAddress;
    }

    public void setSupplierAddress(String supplierAddress) {
        this.supplierAddress = supplierAddress;
    }
}
