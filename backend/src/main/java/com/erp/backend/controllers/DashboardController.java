package com.erp.backend.controllers;

import com.erp.backend.entity.Product;
import com.erp.backend.payload.response.SalesSummaryResponse;
import com.erp.backend.payload.response.TopProductResponse;
import com.erp.backend.repository.InvoiceRepository;
import com.erp.backend.repository.ProductRepository;
import com.erp.backend.repository.SalesOrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Analytics & Dashboard", description = "Endpoints for metrics and KPIs")
public class DashboardController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SalesOrderItemRepository salesOrderItemRepository;

    @GetMapping("/sales-summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE') or hasRole('ACCOUNTANT')")
    public SalesSummaryResponse getSalesSummary() {
        Double totalRevenue = invoiceRepository.getTotalRevenueThisMonth();
        if (totalRevenue == null) {
            totalRevenue = 0.0;
        }
        String currentMonth = LocalDate.now().getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        return new SalesSummaryResponse(currentMonth, totalRevenue);
    }

    @GetMapping("/stock-alerts")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INVENTORY_MANAGER')")
    public List<Product> getStockAlerts() {
        return productRepository.findProductsBelowReorderLevel();
    }

    @GetMapping("/top-products")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    public List<TopProductResponse> getTopProducts() {
        return salesOrderItemRepository.findTopSellingProducts(PageRequest.of(0, 5));
    }
}
