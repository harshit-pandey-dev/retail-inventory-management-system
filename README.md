# Retail Inventory Management System (Project ID: P_022)

> A modern, robust, full-stack Retail Inventory Management System designed with clean layered architecture, automated low-stock detection, multi-warehouse stock allocations, order fulfillment, and containerized deployment.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Project Structure](#project-structure)
6. [Database Schema & Entities](#database-schema--entities)
7. [REST API Endpoints](#rest-api-endpoints)
8. [Local Development Setup](#local-development-setup)
9. [Running with Docker & Docker Compose](#running-with-docker--docker-compose)
10. [Automated Testing & CI/CD](#automated-testing--cicd)
11. [Academic Viva & Demonstration Notes](#academic-viva--demonstration-notes)

---

## 🌟 Project Overview
The **Retail Inventory Management System** streamlines end-to-end retail supply chain operations. It allows warehouse managers, inventory officers, and administrators to track products across physical facilities, monitor critical safety stock levels, manage verified suppliers, and process customer orders with automated inventory reconciliation.

---

## 🚀 Key Features

- **Executive KPI Dashboard**: Instant visibility into total products, facilities, suppliers, processed orders, and real-time low-stock alerts.
- **Dynamic Low-Stock Detection**: Automatic threshold triggers whenever `quantity <= reorderLevel`, displaying visual badges and dedicated restock tables.
- **Product & SKU Catalog**: Full CRUD for products with unique SKU enforcement, pricing, and category mapping.
- **Category Management**: Hierarchical product classification with real-time product count aggregations.
- **Multi-Warehouse Allocation**: Manage physical distribution centers, track capacity limits, and prevent over-allocation.
- **Inventory Matrix**: Many-to-Many product-to-warehouse mapping through inventory records with quick adjustment modals.
- **Supplier Directory**: Vendor contact details, purchase emails, phone numbers, and physical facility locations.
- **Order Processing & Fulfillment**: Multi-item customer order creation, line-item pricing, real-time status transitions (`PENDING` &rarr; `PROCESSING` &rarr; `COMPLETED` &rarr; `CANCELLED`), and automated inventory deduction upon completion.
- **Zero-Friction Demo Seeding**: Automatic sample database seeding on startup for immediate demonstration.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: JavaScript (ES6+)
- **Styling**: Modern Responsive CSS3 (CSS Variables, Flexbox, Grid)
- **Icons**: Lucide React
- **API Client**: Axios with centralized error interceptors

### Backend
- **Framework**: Java 21 / 25, Spring Boot 4.x
- **Modules**: Spring Web, Spring Data JPA, Hibernate, Bean Validation (`jakarta.validation`)
- **Build Tool**: Apache Maven
- **Architecture**: Strict Layered Architecture (`controller`, `service`, `repository`, `entity`, `dto`, `exception`, `config`)

### Database
- **Production / Container**: PostgreSQL 16
- **Test Suite**: H2 In-Memory Database (PostgreSQL dialect mode)

### DevOps & Containerization
- **Docker**: Multi-stage Dockerfiles for backend (Temurin JRE) and frontend (Nginx)
- **Orchestration**: Docker Compose with health checks and network bridging
- **CI/CD**: GitHub Actions automated pipeline (`ci.yml`)

---

## 🏗 System Architecture

```text
React Frontend (Vite, Single Page Application)
        │
        │ HTTP / REST APIs (JSON)
        ▼
Spring Boot REST Controllers (Cross-Origin Enabled)
        │
        │ DTOs with Bean Validation
        ▼
Service Layer (Business Logic & Low-Stock Calculations)
        │
        │ Entities
        ▼
Repository Layer (Spring Data JPA / Hibernate)
        │
        ▼
PostgreSQL Database (or H2 in test/offline modes)
```

---

## 📁 Project Structure

```text
retail-inventory-management-system/
├── backend/
│   ├── mvnw                               # Portable Maven wrapper
│   ├── pom.xml                            # Spring Boot dependencies & build config
│   ├── Dockerfile                         # Multi-stage Java Docker build
│   └── src/
│       ├── main/
│       │   ├── java/com/retail/inventory/
│       │   │   ├── RetailInventoryApplication.java
│       │   │   ├── config/                # CorsConfig, DataInitializer
│       │   │   ├── controller/            # 7 REST Controllers + DashboardController
│       │   │   ├── dto/                   # Request/Response DTOs & ApiResponse
│       │   │   ├── entity/                # JPA Entities & OrderStatus enum
│       │   │   ├── exception/             # GlobalExceptionHandler, Custom Exceptions
│       │   │   ├── repository/            # Spring Data JPA Repositories
│       │   │   └── service/               # Business logic services
│       │   └── resources/
│       │       └── application.properties # PostgreSQL config & env variables
│       └── test/
│           ├── java/com/retail/inventory/ # Unit & Integration test suite
│           └── resources/
│               └── application.properties # H2 test database profile
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf                         # Production Nginx reverse proxy
│   ├── Dockerfile                         # Multi-stage Node/Nginx container
│   ├── index.html
│   └── src/
│       ├── App.jsx                        # Master layout & state coordinator
│       ├── main.jsx                       # React entry point
│       ├── index.css                      # Modern design system stylesheet
│       ├── components/                    # Sidebar, Header, Modal, StatCard
│       ├── pages/                         # Dashboard, Products, Categories,
│       │                                  # Warehouses, Inventory, Suppliers, Orders
│       └── services/
│           └── api.js                     # Axios REST API client
├── .github/
│   └── workflows/
│       └── ci.yml                         # Automated GitHub Actions pipeline
├── docker-compose.yml                     # Multi-container orchestration
├── .env.example                           # Configuration environment template
├── .gitignore
└── README.md
```

---

## 🗄 Database Schema & Entities

| Entity | Primary Key | Key Attributes | Relationships |
| :--- | :--- | :--- | :--- |
| **Category** | `categoryId` | `name` (Unique), `description` | One-to-Many &rarr; Product |
| **Product** | `productId` | `productName`, `sku` (Unique), `productPrice`, `productDescription` | Many-to-One &rarr; Category |
| **Warehouse** | `warehouseId` | `warehouseName`, `location`, `capacity` | One-to-Many &rarr; Inventory, Orders |
| **Inventory** | `inventoryId` | `quantity`, `reorderLevel` | Many-to-One &rarr; Product, Warehouse |
| **Supplier** | `supplierId` | `supplierName`, `supplierEmail` (Unique), `supplierPhone`, `supplierAddress` | Standalone vendor record |
| **Order** | `orderId` | `orderDate`, `status` (`PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED`), `totalAmount` | Many-to-One &rarr; Warehouse; One-to-Many &rarr; OrderItem |
| **OrderItem** | `orderItemId` | `quantity`, `price` | Many-to-One &rarr; Order, Product |

> **SQL Reserved Words Note**: Order tables are explicitly named `@Table(name = "orders")` and `@Table(name = "order_items")` to eliminate SQL keyword conflicts.

---

## 🌐 REST API Endpoints

### 1. Dashboard Summary
- `GET /api/dashboard/summary` - Returns KPIs (total counts for all entities, low stock count, and low stock item list)

### 2. Products
- `GET /api/products` - List all products (supports optional `?categoryId=1` filter)
- `GET /api/products/{id}` - Retrieve single product
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### 3. Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/{id}` - Retrieve category
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### 4. Warehouses
- `GET /api/warehouses` - List all warehouses with current occupied stock calculation
- `GET /api/warehouses/{id}` - Retrieve warehouse
- `POST /api/warehouses` - Create new warehouse
- `PUT /api/warehouses/{id}` - Update warehouse
- `DELETE /api/warehouses/{id}` - Delete warehouse

### 5. Inventory
- `GET /api/inventory` - List inventory allocations (supports `?lowStockOnly=true`)
- `GET /api/inventory/{id}` - Retrieve single inventory record
- `GET /api/inventory/low-stock` - Retrieve items where `quantity <= reorderLevel`
- `POST /api/inventory` - Create or update stock allocation
- `PUT /api/inventory/{id}` - Update stock quantity or reorder level
- `DELETE /api/inventory/{id}` - Delete inventory record

### 6. Suppliers
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/{id}` - Retrieve supplier
- `POST /api/suppliers` - Register new supplier
- `PUT /api/suppliers/{id}` - Update supplier details
- `DELETE /api/suppliers/{id}` - Delete supplier

### 7. Orders
- `GET /api/orders` - List all orders (sorted newest first)
- `GET /api/orders/{id}` - Retrieve order details and items
- `POST /api/orders` - Submit new order with dynamic item list
- `PUT /api/orders/{id}/status` - Update status (`PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED`)
- `DELETE /api/orders/{id}` - Delete order

---

## 💻 Local Development Setup

### Prerequisites
- Java JDK 21 or higher
- Node.js 18+ and npm
- PostgreSQL running locally (or Docker)

### 1. Database Setup
Create the PostgreSQL database:
```sql
CREATE DATABASE retail_inventory;
```

### 2. Run Backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend will start on `http://localhost:8080`. Sample data is automatically seeded on the first boot.

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be accessible at `http://localhost:5173`.

---

## 🐳 Running with Docker & Docker Compose

Launch the complete stack (PostgreSQL + Spring Boot Backend + React Frontend) with a single command:

```bash
docker-compose up --build -d
```

### Ports Exposed:
- **Frontend Dashboard**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:8080`
- **PostgreSQL Database**: `localhost:5432`

To shut down:
```bash
docker-compose down -v
```

---

## 🧪 Automated Testing & CI/CD

### Backend Tests
Execute the automated test suite powered by JUnit 5, Mockito, and Spring Boot Test:
```bash
cd backend
./mvnw clean test
```

Tests verify:
- Product creation and retrieval with SKU uniqueness constraints
- Low-stock threshold logic (`quantity <= reorderLevel`)
- Aggregated dashboard summary calculations
- Order line-item total calculations and status transitions

### Frontend Production Build
```bash
cd frontend
npm run build
```

### GitHub Actions CI
The `.github/workflows/ci.yml` pipeline automatically runs on every push and pull request to validate backend compilation, unit/integration tests, and the frontend Vite production build.

---

## 🎓 Academic Viva & Demonstration Notes

1. **Layered Architecture Principle**: Controllers remain clean by accepting DTOs and delegating business rules to Service classes. Repositories handle database persistence via Spring Data JPA.
2. **Low-Stock Logic**: Demonstrates business rule execution inside Java Service and JPA query layers:
   $$\text{Low Stock} \iff \text{quantity} \le \text{reorderLevel}$$
3. **Data Integrity & Consistency**: Enforces unique constraints on Product SKUs and Category names, and cascades order items safely. Completing an order triggers automated stock deduction from the targeted warehouse.
