package com.kathirvel.HME.Controller;

import com.kathirvel.HME.Model.PrescriptionItem;
import com.kathirvel.HME.Service.PrescriptionItemService;
import com.kathirvel.HME.dto.PrescriptionItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescription-items")
@CrossOrigin(origins = "*")
public class PrescriptionItemController {

    @Autowired
    private PrescriptionItemService prescriptionItemService;
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','DOCTOR','PATIENT')")
    // Get all items for a prescription - accessible by patient, doctor, and super_admin
    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<List<PrescriptionItem>> getItemsByPrescriptionId(@PathVariable Integer prescriptionId) {
        return ResponseEntity.ok(prescriptionItemService.getItemsByPrescriptionId(prescriptionId));
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','DOCTOR','PATIENT')")
    // Get single item - accessible by patient, doctor, and super_admin
    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionItem> getItemById(@PathVariable Integer id) {
        return ResponseEntity.ok(prescriptionItemService.getItemById(id));
    }

    // Create item - only doctor can create
    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionItem> createItem(@RequestBody PrescriptionItemDto itemDto) {
        return ResponseEntity.ok(prescriptionItemService.createItem(itemDto));
    }

    // Update item - only doctor can update
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionItem> updateItem(
            @PathVariable Integer id,
            @RequestBody PrescriptionItemDto itemDto) {
        return ResponseEntity.ok(prescriptionItemService.updateItem(id, itemDto));
    }

    // Delete item - only doctor can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Void> deleteItem(@PathVariable Integer id) {
        prescriptionItemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}