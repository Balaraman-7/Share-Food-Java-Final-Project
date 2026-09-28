package com.FoodShare.repository;

import com.FoodShare.model.FoodListing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodListingRepository extends JpaRepository<FoodListing, Long> {
}