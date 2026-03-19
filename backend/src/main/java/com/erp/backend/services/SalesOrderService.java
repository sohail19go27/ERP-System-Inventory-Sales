package com.erp.backend.services;

import com.erp.backend.entity.Customer;
import com.erp.backend.entity.Product;
import com.erp.backend.entity.SalesOrder;
import com.erp.backend.entity.SalesOrderItem;
import com.erp.backend.payload.request.SalesOrderItemRequest;
import com.erp.backend.payload.request.SalesOrderRequest;
import com.erp.backend.repository.CustomerRepository;
import com.erp.backend.repository.ProductRepository;
import com.erp.backend.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class SalesOrderService {

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InvoiceService invoiceService;

    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderRepository.findAll();
    }

    public Optional<SalesOrder> getSalesOrderById(Long id) {
        return salesOrderRepository.findById(id);
    }

    @Transactional
    public SalesOrder createSalesOrder(SalesOrderRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        SalesOrder order = new SalesOrder();
        order.setCustomer(customer);
        order.setOrderDate(new Date());
        order.setStatus("Pending");

        List<SalesOrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (SalesOrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            SalesOrderItem orderItem = new SalesOrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setUnitPrice(product.getUnitPrice());
            orderItem.setSalesOrder(order);

            // Decrease inventory logic can be added here
            // product.setCurrentStock(product.getCurrentStock() - itemReq.getQuantity());
            // productRepository.save(product);

            totalAmount += (product.getUnitPrice() * itemReq.getQuantity());
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        return salesOrderRepository.save(order);
    }

    @Transactional
    public SalesOrder updateOrderStatus(Long id, String status) {
        SalesOrder order = salesOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales order not found"));
        
        // Auto-generate invoice when approved
        if ("Approved".equals(status) && !"Approved".equals(order.getStatus())) {
            invoiceService.generateInvoiceFromSalesOrder(order);
            
            // Stock Reduction Logic: reduce stock based on approved order
            for (SalesOrderItem item : order.getItems()) {
                Product product = item.getProduct();
                product.setCurrentStock(product.getCurrentStock() - item.getQuantity());
                productRepository.save(product);
            }
        }
        
        order.setStatus(status);
        return salesOrderRepository.save(order);
    }

    public void deleteSalesOrder(Long id) {
        salesOrderRepository.deleteById(id);
    }
}
