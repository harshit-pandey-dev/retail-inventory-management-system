package com.retail.inventory.config;

import com.retail.inventory.entity.*;
import com.retail.inventory.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;

    public DataInitializer(CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           WarehouseRepository warehouseRepository,
                           SupplierRepository supplierRepository,
                           InventoryRepository inventoryRepository,
                           OrderRepository orderRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return; // Data already present
        }

        // 1. Seed Categories
        Category electronics = categoryRepository.save(new Category("Electronics", "Gadgets, computing devices, and electronic accessories"));
        Category apparel = categoryRepository.save(new Category("Apparel & Footwear", "Clothing, casual wear, and seasonal shoes"));
        Category homeKitchen = categoryRepository.save(new Category("Home & Kitchen", "Cookware, appliances, and interior furnishings"));
        Category health = categoryRepository.save(new Category("Health & Personal Care", "Personal hygiene, grooming, and health monitors"));

        // 2. Seed Products
        Product p1 = productRepository.save(new Product("Wireless Noise-Canceling Headphones", "Bluetooth 5.3 active noise cancelling over-ear headphones", 129.99, "SKU-ELEC-001", electronics));
        Product p2 = productRepository.save(new Product("27-inch 4K IPS Monitor", "Ultra HD HDR 144Hz professional color calibrated monitor", 349.50, "SKU-ELEC-002", electronics));
        Product p3 = productRepository.save(new Product("Ergonomic Mechanical Keyboard", "RGB backlit hot-swappable mechanical keyboard", 89.00, "SKU-ELEC-003", electronics));
        Product p4 = productRepository.save(new Product("Premium Organic Cotton T-Shirt", "100% combed ringspun organic cotton crewneck tee", 24.99, "SKU-APP-001", apparel));
        Product p5 = productRepository.save(new Product("Stainless Steel Cookware Set (10-Piece)", "Tri-ply encapsulated base induction compatible cookware", 189.95, "SKU-HOME-001", homeKitchen));
        Product p6 = productRepository.save(new Product("Sonic Electric Toothbrush", "Smart pressure sensor sonic toothbrush with timer", 49.99, "SKU-HLTH-001", health));

        // 3. Seed Warehouses
        Warehouse w1 = warehouseRepository.save(new Warehouse("Central Distribution Hub", "742 Evergreen Terrace, Chicago, IL", 10000));
        Warehouse w2 = warehouseRepository.save(new Warehouse("West Coast Logistics Center", "1200 Pacific Blvd, Los Angeles, CA", 15000));
        Warehouse w3 = warehouseRepository.save(new Warehouse("East Coast Regional Depot", "450 Atlantic Way, Newark, NJ", 8000));

        // 4. Seed Suppliers
        supplierRepository.save(new Supplier("Apex Tech Solutions", "supply@apextech.com", "+1-312-555-0144", "100 Industrial Parkway, Chicago, IL"));
        supplierRepository.save(new Supplier("Pacific Apparel Mills", "orders@pacificapparel.com", "+1-213-555-0188", "450 Fashion Ave, Los Angeles, CA"));
        supplierRepository.save(new Supplier("Heritage Kitchenware Ltd", "contact@heritagekitchen.com", "+1-201-555-0122", "88 Foundry Road, Newark, NJ"));
        supplierRepository.save(new Supplier("PureLife Health Goods", "sales@purelifehealth.com", "+1-415-555-0199", "320 Market Street, San Francisco, CA"));

        // 5. Seed Inventory (Notice: Some items intentionally have quantity <= reorderLevel to demonstrate Low Stock alert!)
        // Low stock: quantity (8) <= reorderLevel (15)
        inventoryRepository.save(new Inventory(p1, w1, 8, 15));
        // Normal stock: quantity (45) > reorderLevel (10)
        inventoryRepository.save(new Inventory(p2, w1, 45, 10));
        // Low stock: quantity (4) <= reorderLevel (20)
        inventoryRepository.save(new Inventory(p3, w1, 4, 20));
        // Normal stock: quantity (120) > reorderLevel (30)
        inventoryRepository.save(new Inventory(p4, w2, 120, 30));
        // Normal stock: quantity (35) > reorderLevel (10)
        inventoryRepository.save(new Inventory(p5, w3, 35, 10));
        // Low stock: quantity (5) <= reorderLevel (12)
        inventoryRepository.save(new Inventory(p6, w2, 5, 12));

        // 6. Seed Orders
        Order o1 = new Order(w1, OrderStatus.COMPLETED);
        o1.setOrderDate(LocalDateTime.now().minusDays(2));
        o1.addOrderItem(new OrderItem(o1, p1, 2, 129.99));
        o1.addOrderItem(new OrderItem(o1, p3, 1, 89.00));
        o1.setTotalAmount(348.98);
        orderRepository.save(o1);

        Order o2 = new Order(w2, OrderStatus.PROCESSING);
        o2.setOrderDate(LocalDateTime.now().minusHours(5));
        o2.addOrderItem(new OrderItem(o2, p4, 5, 24.99));
        o2.addOrderItem(new OrderItem(o2, p6, 2, 49.99));
        o2.setTotalAmount(224.93);
        orderRepository.save(o2);

        Order o3 = new Order(w3, OrderStatus.PENDING);
        o3.setOrderDate(LocalDateTime.now().minusHours(1));
        o3.addOrderItem(new OrderItem(o3, p5, 1, 189.95));
        o3.setTotalAmount(189.95);
        orderRepository.save(o3);
    }
}
