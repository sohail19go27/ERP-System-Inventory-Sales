package com.erp.backend.controllers;

import com.erp.backend.entity.GRN;
import com.erp.backend.payload.request.GRNRequest;
import com.erp.backend.services.GRNService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/grns")
public class GRNController {

    @Autowired
    private GRNService grnService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PURCHASE_MANAGER') or hasRole('INVENTORY_MANAGER')")
    public List<GRN> getAllGRNs() {
        return grnService.getAllGRNs();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INVENTORY_MANAGER') or hasRole('PURCHASE_MANAGER')")
    public GRN createGRN(@RequestBody GRNRequest request) {
        return grnService.createGRN(request);
    }
}
