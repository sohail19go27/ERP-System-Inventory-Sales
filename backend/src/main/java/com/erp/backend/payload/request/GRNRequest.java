package com.erp.backend.payload.request;

import lombok.Data;

@Data
public class GRNRequest {
    private Long purchaseOrderId;
    private String remarks;
}
