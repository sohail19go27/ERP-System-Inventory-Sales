package com.erp.backend.repository;

import com.erp.backend.entity.SalesOrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.erp.backend.payload.response.TopProductResponse;

@Repository
public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Long> {

    @Query("SELECT new com.erp.backend.payload.response.TopProductResponse(i.product.name, SUM(i.quantity)) FROM SalesOrderItem i GROUP BY i.product.name ORDER BY SUM(i.quantity) DESC")
    List<TopProductResponse> findTopSellingProducts(Pageable pageable);
}
