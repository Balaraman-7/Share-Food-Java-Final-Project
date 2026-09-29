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

    @OneToOne // One food listing is belongs to one claim
    @JoinColumn(
            name = "food_listing_id",
            nullable = false,
            unique = true
    )
    private FoodListing foodListing;

    @ManyToOne // NGO can claim many food listings
    @JoinColumn(name = "ngo_id", nullable = false)
    private NGO ngo;

    private LocalDateTime claimedAt;

    private String status;
}