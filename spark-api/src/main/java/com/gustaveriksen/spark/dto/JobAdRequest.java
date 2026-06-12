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
public class JobAdRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String companyName;

    @NotBlank(message = "Status is required")
    private String status;

    private LocalDate postDate;
    private LocalDate startDate;
    private LocalDate appliedDate;
    private String link;
    private String description;
    private List<String> tags;
    private String priority;
    private String salary;
    private LocalDate applicationFollowUp;
    private LocalDate interviewFollowUp;
    private LocalDate interviewOffer;
    private LocalDate jobOffer;
}
