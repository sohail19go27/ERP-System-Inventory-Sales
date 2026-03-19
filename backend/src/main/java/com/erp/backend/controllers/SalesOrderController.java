package com.erp.backend.controllers;

import com.erp.backend.entity.SalesOrder;
import com.erp.backend.payload.request.SalesOrderRequest;
import com.erp.backend.services.SalesOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sales")
@Tag(name = "Sales Module", description = "Endpoints for creating and managing Sales Orders")
public class SalesOrderController {

    @Autowired
    private SalesOrderService salesOrderService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE') or hasRole('INVENTORY_MANAGER')")
    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderService.getAllSalesOrders();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    public ResponseEntity<SalesOrder> getSalesOrderById(@PathVariable Long id) {
        return salesOrderService.getSalesOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    public SalesOrder createSalesOrder(@RequestBody SalesOrderRequest request) {
        return salesOrderService.createSalesOrder(request);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_EXECUTIVE')")
    public ResponseEntity<SalesOrder> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            SalesOrder updatedOrder = salesOrderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSalesOrder(@PathVariable Long id) {
        salesOrderService.deleteSalesOrder(id);
        return ResponseEntity.noContent().build();
    }
}
