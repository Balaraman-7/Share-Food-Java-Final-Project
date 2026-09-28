package com.FoodShare.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
@Data
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The food listing being claimed
    @OneToOne
    @JoinColumn(
            name = "food_listing_id",
            nullable = false,
            unique = true
    )
    private FoodListing foodListing;

    // NGO that claimed the food
    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private NGO ngo;

    // Date and time when the claim was made
    private LocalDateTime claimedAt;

    // CLAIMED, COMPLETED, CANCELLED
    private String status;
}