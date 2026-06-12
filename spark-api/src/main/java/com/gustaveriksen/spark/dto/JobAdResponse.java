package com.gustaveriksen.spark.dto;

import com.gustaveriksen.spark.entity.JobAd;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
public class JobAdResponse {

    private final UUID id;
    private final String title;
    private final String companyName;
    private final String status;
    private final LocalDate postDate;
    private final LocalDate startDate;
    private final LocalDate appliedDate;
    private final String link;
    private final String description;
    private final List<String> tags;
    private final String priority;
    private final String salary;
    private final LocalDate applicationFollowUp;
    private final LocalDate interviewFollowUp;
    private final LocalDate interviewOffer;
    private final LocalDate jobOffer;

    public JobAdResponse(JobAd jobAd) {
        this.id = jobAd.getId();
        this.title = jobAd.getTitle();
        this.companyName = jobAd.getCompanyName();
        this.status = jobAd.getStatus();
        this.postDate = jobAd.getPostDate();
        this.startDate = jobAd.getStartDate();
        this.appliedDate = jobAd.getAppliedDate();
        this.link = jobAd.getLink();
        this.description = jobAd.getDescription();
        this.tags = jobAd.getTags();
        this.priority = jobAd.getPriority();
        this.salary = jobAd.getSalary();
        this.applicationFollowUp = jobAd.getApplicationFollowUp();
        this.interviewFollowUp = jobAd.getInterviewFollowUp();
        this.interviewOffer = jobAd.getInterviewOffer();
        this.jobOffer = jobAd.getJobOffer();
    }
}
