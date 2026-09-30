package com.retail.inventory.dto;

import com.retail.inventory.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateDTO {

    @NotNull(message = "Order status is required")
    private OrderStatus status;

    public OrderStatusUpdateDTO() {
    }

    public OrderStatusUpdateDTO(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
