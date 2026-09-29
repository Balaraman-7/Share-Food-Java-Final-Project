package com.FoodShare.controller;

import com.FoodShare.model.FoodListing;
import com.FoodShare.service.FoodListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/food")
public class FoodListingController {

    @Autowired
    private FoodListingService foodListingService;

    @GetMapping
    public List<FoodListing> getAllFoodListings() {
        return foodListingService.getAllFoodListings();
    }

    @GetMapping("/available")
    public List<FoodListing> getAvailableFoodListings() {
        return foodListingService.getAvailableFoodListings();
    }

    @GetMapping("/{id}")
    public FoodListing getFoodListingById(
            @PathVariable Long id) {

        return foodListingService.getFoodListingById(id);
    }


    @PostMapping
    public FoodListing addFoodListing(
            @RequestBody FoodListing foodListing) {

        return foodListingService.addFoodListing(foodListing);
    }

    @PutMapping("/{id}")
    public FoodListing updateFoodListing(
            @PathVariable Long id,
            @RequestBody FoodListing foodListing) {

        return foodListingService.updateFoodListing(
                id, foodListing);
    }

    @DeleteMapping("/{id}")
    public String deleteFoodListing(
            @PathVariable Long id) {

        return foodListingService.deleteFoodListing(id);
    }
}