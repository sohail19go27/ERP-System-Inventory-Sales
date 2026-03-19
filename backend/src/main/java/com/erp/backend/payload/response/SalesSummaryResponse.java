package com.erp.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SalesSummaryResponse {
    private String month;
    private Double totalRevenue;
}
