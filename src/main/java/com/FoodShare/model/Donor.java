package com.FoodShare.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "donors")
@Data
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    private String password;

    // One donor can create many food listings
    @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<FoodListing> foodListings;
}