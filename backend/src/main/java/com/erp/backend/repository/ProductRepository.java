package com.erp.backend.repository;

import com.erp.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);

    @Query("SELECT p FROM Product p WHERE p.currentStock <= p.reorderLevel")
    List<Product> findProductsBelowReorderLevel();
}
