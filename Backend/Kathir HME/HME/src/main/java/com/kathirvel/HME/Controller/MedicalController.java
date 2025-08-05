package com.kathirvel.HME.Controller;

import com.kathirvel.HME.Model.MedicalItem;
import com.kathirvel.HME.Service.MedicalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/Mapi/medical-items")
public class MedicalController {

    @Autowired
    private MedicalService medicalService;
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','DOCTOR','PATIENT')")
    @GetMapping
    public List<MedicalItem> getAllMedicalItems() {
        return medicalService.getAllMedicalItems();
    }
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public MedicalItem addMedicalItem(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("currentStock") int currentStock,
            @RequestParam("minimumStockLevel") int minimumStockLevel,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {

        MedicalItem item = new MedicalItem();
        item.setName(name);
        item.setDescription(description);
        item.setCurrentStock(currentStock);
        item.setMinimumStockLevel(minimumStockLevel);

        return medicalService.addMedicalItem(item, imageFile);
    }
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicalItem(@PathVariable Integer id) throws IOException {
        medicalService.deleteMedicalItem(id);
        return ResponseEntity.ok().build();
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','DOCTOR','PATIENT')")
    @GetMapping("/low-stock")
    public List<MedicalItem> getLowStockItems() {
        return medicalService.getLowStockItems();
    }
}