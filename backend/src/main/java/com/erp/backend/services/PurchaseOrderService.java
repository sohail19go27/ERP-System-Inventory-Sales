package com.erp.backend.services;

import com.erp.backend.entity.Product;
import com.erp.backend.entity.PurchaseOrder;
import com.erp.backend.entity.PurchaseOrderItem;
import com.erp.backend.entity.Supplier;
import com.erp.backend.payload.request.PurchaseOrderItemRequest;
import com.erp.backend.payload.request.PurchaseOrderRequest;
import com.erp.backend.repository.ProductRepository;
import com.erp.backend.repository.PurchaseOrderRepository;
import com.erp.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public Optional<PurchaseOrder> getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id);
    }

    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(supplier);
        order.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        order.setStatus("Ordered");

        List<PurchaseOrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (PurchaseOrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            PurchaseOrderItem orderItem = new PurchaseOrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            // Assume unitPrice at the time of purchase is the current unitPrice, or it can be fetched differently.
            orderItem.setUnitPrice(product.getUnitPrice()); 
            orderItem.setPurchaseOrder(order);

            totalAmount += (product.getUnitPrice() * itemReq.getQuantity());
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        return purchaseOrderRepository.save(order);
    }

    @Transactional
    public PurchaseOrder updateOrderStatus(Long id, String status) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found"));
        order.setStatus(status);
        return purchaseOrderRepository.save(order);
    }

    public void deletePurchaseOrder(Long id) {
        purchaseOrderRepository.deleteById(id);
    }
}
