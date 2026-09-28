package com.FoodShare.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ngos")
@Data
public class NGO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    private String address;
}