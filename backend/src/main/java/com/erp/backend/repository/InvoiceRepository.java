package com.erp.backend.repository;

import com.erp.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findBySalesOrderId(Long salesOrderId);

    @Query("SELECT SUM(i.totalPayable) FROM Invoice i WHERE MONTH(i.creationDate) = MONTH(CURRENT_DATE) AND YEAR(i.creationDate) = YEAR(CURRENT_DATE)")
    Double getTotalRevenueThisMonth();
}
