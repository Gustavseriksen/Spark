package com.gustaveriksen.spark.controller;

import com.gustaveriksen.spark.dto.CompanyRequest;
import com.gustaveriksen.spark.dto.CompanyResponse;
import com.gustaveriksen.spark.entity.User;
import com.gustaveriksen.spark.repository.UserRepository;
import com.gustaveriksen.spark.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final UserRepository userRepository;

    // Returns all companies for the logged-in user
    @GetMapping
    public ResponseEntity<List<CompanyResponse>> list() {
        return ResponseEntity.ok(companyService.list(currentUserId()));
    }

    // Creates a new company for the logged-in user
    @PostMapping
    public ResponseEntity<CompanyResponse> create(@Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.create(currentUserId(), request));
    }

    // Returns a single company by ID
    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(companyService.get(currentUserId(), id));
    }

    // Updates an existing company by ID
    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> update(@PathVariable UUID id,
                                                  @Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.ok(companyService.update(currentUserId(), id, request));
    }

    // Deletes a company by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        companyService.delete(currentUserId(), id);
        return ResponseEntity.noContent().build();
    }

    // Resolves the currently authenticated user's UUID from the security context
    private UUID currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));
        return user.getId();
    }

    // Returns 400 with the first validation error message
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(err -> err.getDefaultMessage())
                .orElse("Invalid request");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
    }
}
