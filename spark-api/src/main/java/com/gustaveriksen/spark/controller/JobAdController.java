package com.gustaveriksen.spark.controller;

import com.gustaveriksen.spark.dto.JobAdRequest;
import com.gustaveriksen.spark.dto.JobAdResponse;
import com.gustaveriksen.spark.entity.User;
import com.gustaveriksen.spark.repository.UserRepository;
import com.gustaveriksen.spark.service.JobAdService;
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
@RequestMapping("/api/job-ads")
@RequiredArgsConstructor
public class JobAdController {

    private final JobAdService jobAdService;
    private final UserRepository userRepository;

    // Returns all job ads for the logged-in user
    @GetMapping
    public ResponseEntity<List<JobAdResponse>> list() {
        return ResponseEntity.ok(jobAdService.list(currentUserId()));
    }

    // Creates a new job ad for the logged-in user
    @PostMapping
    public ResponseEntity<JobAdResponse> create(@Valid @RequestBody JobAdRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobAdService.create(currentUserId(), request));
    }

    // Returns a single job ad by ID
    @GetMapping("/{id}")
    public ResponseEntity<JobAdResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(jobAdService.get(currentUserId(), id));
    }

    // Updates an existing job ad by ID
    @PutMapping("/{id}")
    public ResponseEntity<JobAdResponse> update(@PathVariable UUID id,
                                                @Valid @RequestBody JobAdRequest request) {
        return ResponseEntity.ok(jobAdService.update(currentUserId(), id, request));
    }

    // Deletes a job ad by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        jobAdService.delete(currentUserId(), id);
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
