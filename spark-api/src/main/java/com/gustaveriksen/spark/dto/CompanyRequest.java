package com.gustaveriksen.spark.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    private String description;
    private String size;
    private List<String> tags;
    private String address;
    private String websiteUrl;

    @NotBlank(message = "Status is required")
    private String status;

    private Integer priority;
    private Integer relevance;
    private String salary;
    private LocalDate interviewDate;
    private LocalDate offerDate;
    private LocalDate followUpDate;
}
