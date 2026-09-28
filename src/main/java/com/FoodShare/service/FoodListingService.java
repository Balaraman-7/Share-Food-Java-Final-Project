package com.FoodShare.service;

import com.FoodShare.model.FoodListing;
import com.FoodShare.repository.FoodListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodListingService {

    @Autowired
    private FoodListingRepository foodListingRepository;

    // Get all food listings
    public List<FoodListing> getAllFoodListings() {
        return foodListingRepository.findAll();
    }

    // Get available food listings
    public List<FoodListing> getAvailableFoodListings() {

        List<FoodListing> listings = foodListingRepository.findAll();

        return listings.stream()
                .filter(food -> food.getStatus().equalsIgnoreCase("AVAILABLE"))
                .filter(food -> food.getSafeToEatUntil() != null)
                .filter(food -> food.getSafeToEatUntil()
                        .isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    // Get food listing by ID
    public FoodListing getFoodListingById(Long id) {

        return foodListingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Food listing not found"));
    }

    // Add food listing
    public FoodListing addFoodListing(FoodListing foodListing) {

        if (foodListing.getStatus() == null) {
            foodListing.setStatus("AVAILABLE");
        }

        return foodListingRepository.save(foodListing);
    }

    // Update food listing
    public FoodListing updateFoodListing(
            Long id,
            FoodListing foodListing) {

        FoodListing existingListing =
                foodListingRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Food listing not found"));

        existingListing.setFoodName(foodListing.getFoodName());
        existingListing.setQuantity(foodListing.getQuantity());
        existingListing.setType(foodListing.getType());
        existingListing.setSafeToEatUntil(
                foodListing.getSafeToEatUntil());

        return foodListingRepository.save(existingListing);
    }

    // Delete food listing
    public String deleteFoodListing(Long id) {

        if (!foodListingRepository.existsById(id)) {
            return "Food listing not found";
        }

        foodListingRepository.deleteById(id);

        return "Food listing deleted successfully";
    }
}