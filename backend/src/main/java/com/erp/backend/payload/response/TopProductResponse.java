package com.erp.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopProductResponse {
    private String productName;
    private Long quantitySold;
}
