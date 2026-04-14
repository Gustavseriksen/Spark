package com.gustaveriksen.spark.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "weekly_goal", nullable = false)
    private Integer weeklyGoal = 10;

    @Column(name = "weight_salary")
    private Integer weightSalary;

    @Column(name = "weight_commute")
    private Integer weightCommute;

    @Column(name = "weight_size")
    private Integer weightSize;
}