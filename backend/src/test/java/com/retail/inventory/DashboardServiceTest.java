package com.retail.inventory;

import com.retail.inventory.dto.DashboardSummaryDTO;
import com.retail.inventory.service.DashboardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class DashboardServiceTest {

    @Autowired
    private DashboardService dashboardService;

    @Test
    @DisplayName("Should retrieve complete dashboard summary metrics")
    void testGetDashboardSummary() {
        DashboardSummaryDTO summary = dashboardService.getDashboardSummary();

        assertNotNull(summary);
        assertTrue(summary.getTotalProducts() >= 0);
        assertTrue(summary.getTotalCategories() >= 0);
        assertTrue(summary.getTotalWarehouses() >= 0);
        assertTrue(summary.getTotalSuppliers() >= 0);
        assertTrue(summary.getTotalOrders() >= 0);
        assertTrue(summary.getTotalInventoryItems() >= 0);
        assertTrue(summary.getLowStockItems() >= 0);
        assertNotNull(summary.getLowStockDetails());
    }
}
