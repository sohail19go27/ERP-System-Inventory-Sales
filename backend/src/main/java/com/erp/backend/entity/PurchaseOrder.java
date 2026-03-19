package com.erp.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date orderDate;

    @Temporal(TemporalType.DATE)
    private Date expectedDeliveryDate;

    @Column(nullable = false)
    private String status; // Ordered, Received

    private Double totalAmount;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("purchaseOrder")
    private List<PurchaseOrderItem> items;

    @PrePersist
    protected void onCreate() {
        if (orderDate == null) {
            orderDate = new Date();
        }
        if (status == null) {
            status = "Ordered";
        }
    }
}
