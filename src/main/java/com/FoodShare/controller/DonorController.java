package com.FoodShare.controller;

import com.FoodShare.model.Donor;
import com.FoodShare.service.DonorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donors")
public class DonorController {

    @Autowired
    private DonorService donorService;

    // GET - Get all donors
    // URL: GET /donors
    @GetMapping
    public List<Donor> getAllDonors() {
        return donorService.getAllDonors();
    }

    // GET - Get donor by ID
    // URL: GET /donors/1
    @GetMapping("/{id}")
    public Donor getDonorById(@PathVariable Long id) {
        return donorService.getDonorById(id)
                .orElseThrow(() ->
                        new RuntimeException("Donor not found"));
    }

    // POST - Add donor
    // URL: POST /donors
    @PostMapping
    public Donor addDonor(@RequestBody Donor donor) {
        return donorService.addDonor(donor);
    }

    // PUT - Update donor
    // URL: PUT /donors/1
    @PutMapping("/{id}")
    public Donor updateDonor(
            @PathVariable Long id,
            @RequestBody Donor donor) {

        return donorService.updateDonor(id, donor);
    }

    // DELETE - Delete donor
    // URL: DELETE /donors/1
    @DeleteMapping("/{id}")
    public String deleteDonor(@PathVariable Long id) {
        return donorService.deleteDonor(id);
    }
}