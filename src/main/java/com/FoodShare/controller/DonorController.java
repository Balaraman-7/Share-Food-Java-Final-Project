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

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorService.getAllDonors();
    }

    @GetMapping("/{id}")
    public Donor getDonorById(@PathVariable Long id) {
        return donorService.getDonorById(id)
                .orElseThrow(() ->
                        new RuntimeException("Donor not found"));
    }

    @PostMapping
    public Donor addDonor(@RequestBody Donor donor) {
        return donorService.addDonor(donor);
    }

    @PutMapping("/{id}")
    public Donor updateDonor(
            @PathVariable Long id,
            @RequestBody Donor donor) {

        return donorService.updateDonor(id, donor);
    }

    @DeleteMapping("/{id}")
    public String deleteDonor(@PathVariable Long id) {
        return donorService.deleteDonor(id);
    }
}