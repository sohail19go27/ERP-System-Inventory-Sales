package com.erp.backend.payload.request;

import lombok.Data;
import java.util.List;

@Data
public class SalesOrderRequest {
    private Long customerId;
    private List<SalesOrderItemRequest> items;
}
