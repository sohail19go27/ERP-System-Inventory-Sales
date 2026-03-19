package com.erp.backend.services;

import com.erp.backend.entity.Customer;
import com.erp.backend.entity.Product;
import com.erp.backend.entity.SalesOrder;
import com.erp.backend.payload.request.SalesOrderItemRequest;
import com.erp.backend.payload.request.SalesOrderRequest;
import com.erp.backend.repository.CustomerRepository;
import com.erp.backend.repository.ProductRepository;
import com.erp.backend.repository.SalesOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SalesOrderServiceTest {

    @Mock
    private SalesOrderRepository salesOrderRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private SalesOrderService salesOrderService;

    private Customer customer;
    private Product product1;
    private Product product2;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setId(1L);

        product1 = new Product();
        product1.setId(10L);
        product1.setUnitPrice(50.0);

        product2 = new Product();
        product2.setId(20L);
        product2.setUnitPrice(30.0);
    }

    @Test
    void testCreateSalesOrder_TotalAmountCalculation() {
        SalesOrderRequest request = new SalesOrderRequest();
        request.setCustomerId(1L);
        
        SalesOrderItemRequest item1 = new SalesOrderItemRequest();
        item1.setProductId(10L);
        item1.setQuantity(2); // 2 * 50 = 100

        SalesOrderItemRequest item2 = new SalesOrderItemRequest();
        item2.setProductId(20L);
        item2.setQuantity(3); // 3 * 30 = 90

        request.setItems(Arrays.asList(item1, item2)); // Total expected: 190.0

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product1));
        when(productRepository.findById(20L)).thenReturn(Optional.of(product2));
        when(salesOrderRepository.save(any(SalesOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SalesOrder createdOrder = salesOrderService.createSalesOrder(request);

        assertEquals(190.0, createdOrder.getTotalAmount(), "Total amount should be sum of (price * qty) for all items");

        ArgumentCaptor<SalesOrder> orderCaptor = ArgumentCaptor.forClass(SalesOrder.class);
        verify(salesOrderRepository, times(1)).save(orderCaptor.capture());
        assertEquals(190.0, orderCaptor.getValue().getTotalAmount());
    }
}
