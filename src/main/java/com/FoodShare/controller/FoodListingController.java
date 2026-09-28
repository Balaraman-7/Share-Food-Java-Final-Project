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

    // GET - Get all food listings
    // URL: GET /food
    @GetMapping
    public List<FoodListing> getAllFoodListings() {
        return foodListingService.getAllFoodListings();
    }

    // GET - Get only available food
    // URL: GET /food/available
    @GetMapping("/available")
    public List<FoodListing> getAvailableFoodListings() {
        return foodListingService.getAvailableFoodListings();
    }

    // GET - Get food listing by ID
    // URL: GET /food/1
    @GetMapping("/{id}")
    public FoodListing getFoodListingById(
            @PathVariable Long id) {

        return foodListingService.getFoodListingById(id);
    }

    // POST - Add food listing
    // URL: POST /food
    @PostMapping
    public FoodListing addFoodListing(
            @RequestBody FoodListing foodListing) {

        return foodListingService.addFoodListing(foodListing);
    }

    // PUT - Update food listing
    // URL: PUT /food/1
    @PutMapping("/{id}")
    public FoodListing updateFoodListing(
            @PathVariable Long id,
            @RequestBody FoodListing foodListing) {

        return foodListingService.updateFoodListing(
                id, foodListing);
    }

    // DELETE - Delete food listing
    // URL: DELETE /food/1
    @DeleteMapping("/{id}")
    public String deleteFoodListing(
            @PathVariable Long id) {

        return foodListingService.deleteFoodListing(id);
    }
}