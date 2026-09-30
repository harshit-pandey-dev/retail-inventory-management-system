package com.retail.inventory;

import com.retail.inventory.dto.*;
import com.retail.inventory.entity.OrderStatus;
import com.retail.inventory.service.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private WarehouseService warehouseService;

    @Test
    @DisplayName("Should create order, calculate total amount, and update order status")
    void testCreateOrderAndStatusUpdate() {
        CategoryDTO cat = categoryService.createCategory(new CategoryDTO(null, "Order Cat", "Test"));
        ProductDTO prod = new ProductDTO();
        prod.setProductName("Order Product");
        prod.setProductPrice(50.0);
        prod.setSku("SKU-ORD-01");
        prod.setCategoryId(cat.getCategoryId());
        ProductDTO createdProd = productService.createProduct(prod);

        WarehouseDTO wh = warehouseService.createWarehouse(new WarehouseDTO(null, "Order WH", "Austin, TX", 2000));

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setWarehouseId(wh.getWarehouseId());
        orderDTO.setStatus(OrderStatus.PENDING);

        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setProductId(createdProd.getProductId());
        itemDTO.setQuantity(3);
        itemDTO.setPrice(50.0);
        orderDTO.setItems(Collections.singletonList(itemDTO));

        OrderDTO createdOrder = orderService.createOrder(orderDTO);

        assertNotNull(createdOrder.getOrderId());
        assertEquals(150.0, createdOrder.getTotalAmount());
        assertEquals(OrderStatus.PENDING, createdOrder.getStatus());
        assertEquals(1, createdOrder.getItems().size());

        // Update status
        OrderDTO updatedOrder = orderService.updateOrderStatus(createdOrder.getOrderId(), OrderStatus.COMPLETED);
        assertEquals(OrderStatus.COMPLETED, updatedOrder.getStatus());
    }
}
