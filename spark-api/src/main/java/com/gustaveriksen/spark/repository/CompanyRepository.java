package com.gustaveriksen.spark.repository;

import com.gustaveriksen.spark.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    // Finds all unsolicited companies tracked by a specific user
    List<Company> findByUserId(UUID userId);
}