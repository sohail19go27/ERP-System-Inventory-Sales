package com.erp.backend.payload.request;

import lombok.Data;

@Data
public class SalesOrderItemRequest {
    private Long productId;
    private Integer quantity;
}
