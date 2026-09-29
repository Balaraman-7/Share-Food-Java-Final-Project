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

    @GetMapping
    public List<NGO> getAllNGOs() {
        return ngoService.getAllNGOs();
    }

    @GetMapping("/{id}")
    public NGO getNGOById(@PathVariable Long id) {

        return ngoService.getNGOById(id)
                .orElseThrow(() ->
                        new RuntimeException("NGO not found"));
    }

    @PostMapping
    public NGO addNGO(@RequestBody NGO ngo) {
        return ngoService.addNGO(ngo);
    }

    @PutMapping("/{id}")
    public NGO updateNGO(
            @PathVariable Long id,
            @RequestBody NGO ngo) {

        return ngoService.updateNGO(id, ngo);
    }

    @DeleteMapping("/{id}")
    public String deleteNGO(@PathVariable Long id) {
        return ngoService.deleteNGO(id);
    }
}