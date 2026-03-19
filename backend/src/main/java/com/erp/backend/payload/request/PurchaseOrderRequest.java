package com.erp.backend.payload.request;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class PurchaseOrderRequest {
    private Long supplierId;
    private Date expectedDeliveryDate;
    private List<PurchaseOrderItemRequest> items;
}
