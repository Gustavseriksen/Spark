package com.gustaveriksen.spark.repository;

import com.gustaveriksen.spark.entity.JobAd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobAdRepository extends JpaRepository<JobAd, UUID> {
    // Finds all specific job applications for a user
    List<JobAd> findByUserId(UUID userId);
}