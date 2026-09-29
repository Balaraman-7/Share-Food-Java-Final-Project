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

    @GetMapping
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @PostMapping("/food/{foodListingId}/ngo/{ngoId}")
    public Claim createClaim(
            @PathVariable Long foodListingId,
            @PathVariable Long ngoId) {

        return claimService.createClaim(
                foodListingId,
                ngoId);
    }

    @DeleteMapping("/{id}")
    public String deleteClaim(@PathVariable Long id) {
        return claimService.deleteClaim(id);
    }
}