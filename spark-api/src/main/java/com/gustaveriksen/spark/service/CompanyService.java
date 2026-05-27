package com.gustaveriksen.spark.service;

import com.gustaveriksen.spark.dto.CompanyRequest;
import com.gustaveriksen.spark.dto.CompanyResponse;
import com.gustaveriksen.spark.entity.Company;
import com.gustaveriksen.spark.entity.User;
import com.gustaveriksen.spark.repository.CompanyRepository;
import com.gustaveriksen.spark.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    // Returns all companies belonging to the given user
    public List<CompanyResponse> list(UUID userId) {
        return companyRepository.findByUserId(userId).stream()
                .map(CompanyResponse::new)
                .toList();
    }

    // Creates a new company owned by the given user
    @Transactional
    public CompanyResponse create(UUID userId, CompanyRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Company company = new Company();
        company.setUser(user);
        applyRequest(company, request);

        return new CompanyResponse(companyRepository.save(company));
    }

    // Returns a single company by ID, verifying ownership
    public CompanyResponse get(UUID userId, UUID companyId) {
        return new CompanyResponse(findOwned(userId, companyId));
    }

    // Updates all fields on an existing company, verifying ownership
    @Transactional
    public CompanyResponse update(UUID userId, UUID companyId, CompanyRequest request) {
        Company company = findOwned(userId, companyId);
        applyRequest(company, request);
        return new CompanyResponse(companyRepository.save(company));
    }

    // Deletes a company by ID, verifying ownership
    @Transactional
    public void delete(UUID userId, UUID companyId) {
        companyRepository.delete(findOwned(userId, companyId));
    }

    // Fetches a company and throws 404 if it doesn't exist or isn't owned by userId
    private Company findOwned(UUID userId, UUID companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!company.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return company;
    }

    // Copies all request fields onto a Company entity (used by create and update)
    private void applyRequest(Company company, CompanyRequest request) {
        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setSize(request.getSize());
        company.setTags(request.getTags());
        company.setAddress(request.getAddress());
        company.setWebsiteUrl(request.getWebsiteUrl());
        company.setStatus(request.getStatus());
        company.setPriority(request.getPriority());
        company.setRelevance(request.getRelevance());
        company.setSalary(request.getSalary());
        company.setInterviewDate(request.getInterviewDate());
        company.setOfferDate(request.getOfferDate());
        company.setFollowUpDate(request.getFollowUpDate());
    }
}
