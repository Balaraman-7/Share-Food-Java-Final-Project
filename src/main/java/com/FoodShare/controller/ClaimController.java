package com.FoodShare.controller;

import com.FoodShare.model.Claim;
import com.FoodShare.service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/claims")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    // GET - Get all claims
    // URL: GET /claims
    @GetMapping
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    // POST - Claim food
    //
    // Example:
    // POST /claims/food/1/ngo/2
    //
    // Food listing ID = 1
    // NGO ID = 2
    @PostMapping("/food/{foodListingId}/ngo/{ngoId}")
    public Claim createClaim(
            @PathVariable Long foodListingId,
            @PathVariable Long ngoId) {

        return claimService.createClaim(
                foodListingId,
                ngoId);
    }

    // DELETE - Delete claim
    // URL: DELETE /claims/1
    @DeleteMapping("/{id}")
    public String deleteClaim(@PathVariable Long id) {
        return claimService.deleteClaim(id);
    }
}