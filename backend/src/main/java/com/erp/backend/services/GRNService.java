package com.erp.backend.services;

import com.erp.backend.entity.GRN;
import com.erp.backend.entity.Product;
import com.erp.backend.entity.PurchaseOrder;
import com.erp.backend.entity.PurchaseOrderItem;
import com.erp.backend.payload.request.GRNRequest;
import com.erp.backend.repository.GRNRepository;
import com.erp.backend.repository.ProductRepository;
import com.erp.backend.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class GRNService {

    @Autowired
    private GRNRepository grnRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<GRN> getAllGRNs() {
        return grnRepository.findAll();
    }

    @Transactional
    public GRN createGRN(GRNRequest request) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(request.getPurchaseOrderId())
                .orElseThrow(() -> new RuntimeException("Purchase order not found"));

        if (!"Ordered".equals(purchaseOrder.getStatus())) {
            throw new RuntimeException("Purchase order must be in Ordered status to create a GRN.");
        }

        GRN grn = new GRN();
        grn.setPurchaseOrder(purchaseOrder);
        grn.setReceivedDate(new Date());
        grn.setRemarks(request.getRemarks());

        // Update Stock Logic
        for (PurchaseOrderItem item : purchaseOrder.getItems()) {
            Product product = item.getProduct();
            product.setCurrentStock(product.getCurrentStock() + item.getQuantity());
            productRepository.save(product);
        }

        // Update PO Status
        purchaseOrder.setStatus("Received");
        purchaseOrderRepository.save(purchaseOrder);

        return grnRepository.save(grn);
    }
}
