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

    //One donor can list mutiple foods
    @OneToMany(mappedBy = "donor")
    @JsonManagedReference
    private List<FoodListing> foodListings;
}