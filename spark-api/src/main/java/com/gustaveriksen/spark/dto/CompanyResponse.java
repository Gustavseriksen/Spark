package com.gustaveriksen.spark.dto;

import com.gustaveriksen.spark.entity.Company;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
public class CompanyResponse {

    private final UUID id;
    private final String name;
    private final String description;
    private final String size;
    private final List<String> tags;
    private final String address;
    private final String websiteUrl;
    private final String status;
    private final Integer priority;
    private final Integer relevance;
    private final String salary;
    private final LocalDate interviewDate;
    private final LocalDate offerDate;
    private final LocalDate followUpDate;

    public CompanyResponse(Company company) {
        this.id = company.getId();
        this.name = company.getName();
        this.description = company.getDescription();
        this.size = company.getSize();
        this.tags = company.getTags();
        this.address = company.getAddress();
        this.websiteUrl = company.getWebsiteUrl();
        this.status = company.getStatus();
        this.priority = company.getPriority();
        this.relevance = company.getRelevance();
        this.salary = company.getSalary();
        this.interviewDate = company.getInterviewDate();
        this.offerDate = company.getOfferDate();
        this.followUpDate = company.getFollowUpDate();
    }
}
