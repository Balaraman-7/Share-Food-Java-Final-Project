package com.FoodShare.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "food_listings")
@Data
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;

    private Double quantity;

    private String type;

    private LocalDateTime safeToEatUntil;

    private String status;

    //Multiple food listing belongs to same donor
    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    @JsonBackReference
    private Donor donor;
}
