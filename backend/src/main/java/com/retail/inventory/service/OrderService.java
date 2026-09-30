package com.retail.inventory.service;

import com.retail.inventory.dto.OrderDTO;
import com.retail.inventory.dto.OrderItemDTO;
import com.retail.inventory.entity.*;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.OrderRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public OrderService(OrderRepository orderRepository,
                        WarehouseRepository warehouseRepository,
                        ProductRepository productRepository,
                        InventoryRepository inventoryRepository) {
        this.orderRepository = orderRepository;
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return mapToDTO(order);
    }

    public OrderDTO createOrder(OrderDTO dto) {
        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", dto.getWarehouseId()));

        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new BadRequestException("Order must have at least one item");
        }

        Order order = new Order();
        order.setWarehouse(warehouse);
        order.setStatus(dto.getStatus() != null ? dto.getStatus() : OrderStatus.PENDING);

        double total = 0.0;
        for (OrderItemDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemDto.getProductId()));

            double itemPrice = (itemDto.getPrice() != null && itemDto.getPrice() > 0)
                    ? itemDto.getPrice()
                    : product.getProductPrice();

            OrderItem item = new OrderItem(order, product, itemDto.getQuantity(), itemPrice);
            order.addOrderItem(item);
            total += itemPrice * itemDto.getQuantity();

            // Check if inventory exists in that warehouse
            Optional<Inventory> invOpt = inventoryRepository.findByProductProductIdAndWarehouseWarehouseId(
                    product.getProductId(), warehouse.getWarehouseId()
            );
            if (invOpt.isPresent()) {
                Inventory inv = invOpt.get();
                if (inv.getQuantity() < itemDto.getQuantity()) {
                    // Still allow order creation with warning or validate stock
                }
            }
        }

        order.setTotalAmount(Math.round(total * 100.0) / 100.0);
        Order saved = orderRepository.save(order);
        return mapToDTO(saved);
    }

    public OrderDTO updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        OrderStatus currentStatus = order.getStatus();

        // If completing order and wasn't previously completed, deduct stock
        if (newStatus == OrderStatus.COMPLETED && currentStatus != OrderStatus.COMPLETED) {
            for (OrderItem item : order.getOrderItems()) {
                Optional<Inventory> invOpt = inventoryRepository.findByProductProductIdAndWarehouseWarehouseId(
                        item.getProduct().getProductId(), order.getWarehouse().getWarehouseId()
                );
                if (invOpt.isPresent()) {
                    Inventory inv = invOpt.get();
                    int updatedQty = Math.max(0, inv.getQuantity() - item.getQuantity());
                    inv.setQuantity(updatedQty);
                    inventoryRepository.save(inv);
                }
            }
        }

        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);
        return mapToDTO(saved);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        orderRepository.delete(order);
    }

    public OrderDTO mapToDTO(Order order) {
        List<OrderItemDTO> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            items = order.getOrderItems().stream().map(i -> new OrderItemDTO(
                    i.getOrderItemId(),
                    i.getProduct().getProductId(),
                    i.getProduct().getProductName(),
                    i.getProduct().getSku(),
                    i.getQuantity(),
                    i.getPrice()
            )).collect(Collectors.toList());
        }

        return new OrderDTO(
                order.getOrderId(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getWarehouse().getWarehouseId(),
                order.getWarehouse().getWarehouseName(),
                items
        );
    }
}
