package com.erp.backend.services;

import com.erp.backend.entity.GRN;
import com.erp.backend.entity.Product;
import com.erp.backend.entity.PurchaseOrder;
import com.erp.backend.entity.PurchaseOrderItem;
import com.erp.backend.payload.request.GRNRequest;
import com.erp.backend.repository.GRNRepository;
import com.erp.backend.repository.ProductRepository;
import com.erp.backend.repository.PurchaseOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GRNServiceTest {

    @Mock
    private GRNRepository grnRepository;

    @Mock
    private PurchaseOrderRepository purchaseOrderRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private GRNService grnService;

    private PurchaseOrder purchaseOrder;
    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(10L);
        product.setCurrentStock(50); // Initial stock is 50

        PurchaseOrderItem item = new PurchaseOrderItem();
        item.setProduct(product);
        item.setQuantity(20); // Receiving 20 units

        purchaseOrder = new PurchaseOrder();
        purchaseOrder.setId(100L);
        purchaseOrder.setStatus("Ordered");
        
        List<PurchaseOrderItem> items = new ArrayList<>();
        items.add(item);
        purchaseOrder.setItems(items);
    }

    @Test
    void testCreateGRN_StockIncrease() {
        GRNRequest request = new GRNRequest();
        request.setPurchaseOrderId(100L);
        request.setRemarks("Received in good condition");

        when(purchaseOrderRepository.findById(100L)).thenReturn(Optional.of(purchaseOrder));
        when(grnRepository.save(any(GRN.class))).thenAnswer(i -> i.getArgument(0));

        grnService.createGRN(request);

        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository, times(1)).save(productCaptor.capture());
        
        Product updatedProduct = productCaptor.getValue();
        assertEquals(70, updatedProduct.getCurrentStock(), "Current stock should increase by received quantity (50 + 20 = 70)");
        
        verify(purchaseOrderRepository, times(1)).save(purchaseOrder);
        assertEquals("Received", purchaseOrder.getStatus());
    }
}
