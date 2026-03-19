package com.erp.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "goods_receipt_notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GRN {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "purchase_order_id", nullable = false, unique = true)
    private PurchaseOrder purchaseOrder;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date receivedDate;

    private String remarks;

    @PrePersist
    protected void onCreate() {
        if (receivedDate == null) {
            receivedDate = new Date();
        }
    }
}
