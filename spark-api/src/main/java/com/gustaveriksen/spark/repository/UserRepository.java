package com.gustaveriksen.spark.repository;

import com.gustaveriksen.spark.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    // Spring Data JPA magically writes the SQL query for this method behind the scenes
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
}