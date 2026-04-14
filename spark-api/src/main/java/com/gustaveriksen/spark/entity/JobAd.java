package com.gustaveriksen.spark.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "job_ads")
@Getter
@Setter
@NoArgsConstructor
public class JobAd {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(name = "ad_url", length = 500)
    private String adUrl;

    @Column(name = "ad_description", columnDefinition = "TEXT")
    private String adDescription;

    @Column(name = "application_text", columnDefinition = "TEXT")
    private String applicationText;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "post_date")
    private LocalDate postDate;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "applied_date")
    private LocalDate appliedDate;

    @ElementCollection
    @CollectionTable(name = "job_ad_tags", joinColumns = @JoinColumn(name = "job_ad_id"))
    @Column(name = "tag")
    private List<String> tags;

    private Integer priority;
    private Integer relevance;
    private String salary;

    @Column(name = "has_interview")
    private Boolean hasInterview = false;

    @Column(name = "has_offer")
    private Boolean hasOffer = false;

    @Column(name = "match_score")
    private Double matchScore;
}