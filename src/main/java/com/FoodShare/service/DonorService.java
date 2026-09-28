package com.FoodShare.service;

import com.FoodShare.model.Donor;
import com.FoodShare.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    // Get all donors
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    // Get donor by ID
    public Optional<Donor> getDonorById(Long id) {
        return donorRepository.findById(id);
    }

    // Add donor
    public Donor addDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    // Update donor
    public Donor updateDonor(Long id, Donor donor) {

        Donor existingDonor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        existingDonor.setName(donor.getName());
        existingDonor.setEmail(donor.getEmail());
        existingDonor.setPhone(donor.getPhone());
        existingDonor.setPassword(donor.getPassword());

        return donorRepository.save(existingDonor);
    }

    // Delete donor
    public String deleteDonor(Long id) {

        if (!donorRepository.existsById(id)) {
            return "Donor not found";
        }

        donorRepository.deleteById(id);

        return "Donor deleted successfully";
    }
}