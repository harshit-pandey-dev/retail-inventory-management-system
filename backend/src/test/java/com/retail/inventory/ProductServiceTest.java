package com.retail.inventory;

import com.retail.inventory.dto.CategoryDTO;
import com.retail.inventory.dto.ProductDTO;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.service.CategoryService;
import com.retail.inventory.service.ProductService;
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
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    private Long categoryId;

    @BeforeEach
    void setUp() {
        CategoryDTO catDto = new CategoryDTO();
        catDto.setName("Electronics Test");
        catDto.setDescription("Electronics test description");
        CategoryDTO createdCat = categoryService.createCategory(catDto);
        categoryId = createdCat.getCategoryId();
    }

    @Test
    @DisplayName("Should create product successfully with valid details")
    void testCreateProduct() {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductName("Test Monitor");
        productDTO.setProductDescription("High-resolution IPS display");
        productDTO.setProductPrice(299.99);
        productDTO.setSku("SKU-TEST-001");
        productDTO.setCategoryId(categoryId);

        ProductDTO created = productService.createProduct(productDTO);

        assertNotNull(created.getProductId());
        assertEquals("Test Monitor", created.getProductName());
        assertEquals(299.99, created.getProductPrice());
        assertEquals("SKU-TEST-001", created.getSku());
        assertEquals("Electronics Test", created.getCategoryName());
    }

    @Test
    @DisplayName("Should retrieve created product by ID")
    void testGetProductById() {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductName("Test Keyboard");
        productDTO.setProductDescription("RGB Mechanical");
        productDTO.setProductPrice(79.99);
        productDTO.setSku("SKU-TEST-002");
        productDTO.setCategoryId(categoryId);

        ProductDTO created = productService.createProduct(productDTO);
        ProductDTO found = productService.getProductById(created.getProductId());

        assertNotNull(found);
        assertEquals(created.getProductId(), found.getProductId());
        assertEquals("SKU-TEST-002", found.getSku());
    }

    @Test
    @DisplayName("Should reject duplicate SKU creation")
    void testDuplicateSkuThrowsException() {
        ProductDTO p1 = new ProductDTO();
        p1.setProductName("Mouse A");
        p1.setProductPrice(25.0);
        p1.setSku("SKU-DUP-01");
        p1.setCategoryId(categoryId);
        productService.createProduct(p1);

        ProductDTO p2 = new ProductDTO();
        p2.setProductName("Mouse B");
        p2.setProductPrice(35.0);
        p2.setSku("SKU-DUP-01");
        p2.setCategoryId(categoryId);

        assertThrows(BadRequestException.class, () -> productService.createProduct(p2));
    }
}
