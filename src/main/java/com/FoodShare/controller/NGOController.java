package com.FoodShare.controller;

import com.FoodShare.model.NGO;
import com.FoodShare.service.NGOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ngos")
public class NGOController {

    @Autowired
    private NGOService ngoService;

    // GET - Get all NGOs
    // URL: GET /ngos
    @GetMapping
    public List<NGO> getAllNGOs() {
        return ngoService.getAllNGOs();
    }

    // GET - Get NGO by ID
    // URL: GET /ngos/1
    @GetMapping("/{id}")
    public NGO getNGOById(@PathVariable Long id) {

        return ngoService.getNGOById(id)
                .orElseThrow(() ->
                        new RuntimeException("NGO not found"));
    }

    // POST - Add NGO
    // URL: POST /ngos
    @PostMapping
    public NGO addNGO(@RequestBody NGO ngo) {
        return ngoService.addNGO(ngo);
    }

    // PUT - Update NGO
    // URL: PUT /ngos/1
    @PutMapping("/{id}")
    public NGO updateNGO(
            @PathVariable Long id,
            @RequestBody NGO ngo) {

        return ngoService.updateNGO(id, ngo);
    }

    // DELETE - Delete NGO
    // URL: DELETE /ngos/1
    @DeleteMapping("/{id}")
    public String deleteNGO(@PathVariable Long id) {
        return ngoService.deleteNGO(id);
    }
}