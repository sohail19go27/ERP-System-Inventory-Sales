package com.erp.backend.controllers;

import com.erp.backend.entity.PurchaseOrder;
import com.erp.backend.payload.request.PurchaseOrderRequest;
import com.erp.backend.services.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/purchase-orders")
@Tag(name = "Purchases Module", description = "Endpoints for creating and tracking Purchase Orders")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PURCHASE_MANAGER') or hasRole('INVENTORY_MANAGER')")
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PURCHASE_MANAGER') or hasRole('INVENTORY_MANAGER')")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderById(@PathVariable Long id) {
        return purchaseOrderService.getPurchaseOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PURCHASE_MANAGER')")
    public PurchaseOrder createPurchaseOrder(@RequestBody PurchaseOrderRequest request) {
        return purchaseOrderService.createPurchaseOrder(request);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PURCHASE_MANAGER')")
    public ResponseEntity<PurchaseOrder> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            PurchaseOrder updatedOrder = purchaseOrderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrder(id);
        return ResponseEntity.noContent().build();
    }
}
