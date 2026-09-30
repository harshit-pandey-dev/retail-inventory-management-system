package com.retail.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class ProductDTO {

    private Long productId;

    @NotBlank(message = "Product name is required")
    @Size(max = 150, message = "Product name cannot exceed 150 characters")
    private String productName;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String productDescription;

    @NotNull(message = "Product price is required")
    @Positive(message = "Product price must be greater than zero")
    private Double productPrice;

    @NotBlank(message = "SKU is required")
    @Size(max = 60, message = "SKU cannot exceed 60 characters")
    private String sku;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String categoryName;

    public ProductDTO() {
    }

    public ProductDTO(Long productId, String productName, String productDescription, Double productPrice, String sku, Long categoryId, String categoryName) {
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.sku = sku;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public Double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
