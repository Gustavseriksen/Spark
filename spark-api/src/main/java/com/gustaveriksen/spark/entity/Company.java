package com.gustaveriksen.spark.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String size;

    @ElementCollection
    @CollectionTable(name = "company_tags", joinColumns = @JoinColumn(name = "company_id"))
    @Column(name = "tag")
    private List<String> tags;

    @Column(length = 555)
    private String address;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(nullable = false, length = 50)
    private String status;

    private Integer priority;
    private Integer relevance;
    private String salary;

    @Column(name = "has_interview")
    private Boolean hasInterview = false;

    @Column(name = "has_offer")
    private Boolean hasOffer = false;
}