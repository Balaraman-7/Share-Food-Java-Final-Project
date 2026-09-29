package com.FoodShare.service;

import com.FoodShare.model.Claim;
import com.FoodShare.model.FoodListing;
import com.FoodShare.model.NGO;
import com.FoodShare.repository.ClaimRepository;
import com.FoodShare.repository.FoodListingRepository;
import com.FoodShare.repository.NGORepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private FoodListingRepository foodListingRepository;

    @Autowired
    private NGORepository ngoRepository;

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim createClaim(Long foodListingId, Long ngoId) {

        // Find food listing
        FoodListing foodListing =
                foodListingRepository.findById(foodListingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Food listing not found"));

        // Find NGO
        NGO ngo =
                ngoRepository.findById(ngoId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "NGO not found"));

        // Check food status
        if (!"AVAILABLE".equalsIgnoreCase(
                foodListing.getStatus())) {

            throw new RuntimeException(
                    "Food is not available for claiming");
        }

        // Check expiry
        if (foodListing.getSafeToEatUntil() == null ||
                foodListing.getSafeToEatUntil()
                        .isBefore(LocalDateTime.now())) {

            foodListing.setStatus("EXPIRED");

            foodListingRepository.save(foodListing);

            throw new RuntimeException(
                    "Food listing has expired");
        }

        // Create claim
        Claim claim = new Claim();

        claim.setFoodListing(foodListing);
        claim.setNgo(ngo);
        claim.setClaimedAt(LocalDateTime.now());
        claim.setStatus("CLAIMED");

        // Change food status
        foodListing.setStatus("CLAIMED");

        foodListingRepository.save(foodListing);

        return claimRepository.save(claim);
    }

    public String deleteClaim(Long id) {

        if (!claimRepository.existsById(id)) {
            return "Claim not found";
        }

        claimRepository.deleteById(id);

        return "Claim deleted successfully";
    }
}