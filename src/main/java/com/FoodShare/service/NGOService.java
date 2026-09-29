package com.FoodShare.service;

import com.FoodShare.model.NGO;
import com.FoodShare.repository.NGORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NGOService {

    @Autowired
    private NGORepository ngoRepository;

    public List<NGO> getAllNGOs() {
        return ngoRepository.findAll();
    }

    public Optional<NGO> getNGOById(Long id) {
        return ngoRepository.findById(id);
    }

    public NGO addNGO(NGO ngo) {
        return ngoRepository.save(ngo);
    }

    public NGO updateNGO(Long id, NGO ngo) {

        NGO existingNGO = ngoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("NGO not found"));

        existingNGO.setName(ngo.getName());
        existingNGO.setEmail(ngo.getEmail());
        existingNGO.setPhone(ngo.getPhone());
        existingNGO.setAddress(ngo.getAddress());

        return ngoRepository.save(existingNGO);
    }

    public String deleteNGO(Long id) {

        if (!ngoRepository.existsById(id)) {
            return "NGO not found";
        }

        ngoRepository.deleteById(id);

        return "NGO deleted successfully";
    }
}