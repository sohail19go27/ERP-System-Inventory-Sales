package com.erp.backend.repository;

import com.erp.backend.entity.GRN;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GRNRepository extends JpaRepository<GRN, Long> {
}
