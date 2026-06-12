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

    @Column(nullable = false)
    private String title;

    @Column(name = "company_name")
    private String companyName;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "post_date")
    private LocalDate postDate;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "applied_date")
    private LocalDate appliedDate;

    @Column(name = "ad_url", length = 500)
    private String link;

    @Column(name = "ad_description", columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "job_ad_tags", joinColumns = @JoinColumn(name = "job_ad_id"))
    @Column(name = "tag")
    private List<String> tags;

    // String label ("Very High".."None"); new column because the legacy integer
    // "priority" column can't be type-altered by ddl-auto: update
    @Column(name = "priority_label", length = 20)
    private String priority;

    private String salary;

    @Column(name = "application_follow_up")
    private LocalDate applicationFollowUp;

    @Column(name = "interview_follow_up")
    private LocalDate interviewFollowUp;

    @Column(name = "interview_offer")
    private LocalDate interviewOffer;

    @Column(name = "job_offer")
    private LocalDate jobOffer;
}
