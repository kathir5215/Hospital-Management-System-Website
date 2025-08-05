package com.kathirvel.HME.Controller;

import com.kathirvel.HME.Model.Prescription;
import com.kathirvel.HME.Service.PrescriptionService;
import com.kathirvel.HME.dto.PrescriptionDto;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','DOCTOR','PATIENT')")
    @GetMapping
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','DOCTOR','PATIENT')")
    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Integer id) {
        Prescription prescription = prescriptionService.getPrescriptionByIdWithDetails(id);
        return ResponseEntity.ok(prescription);
    }
    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionDto prescriptionDto) {
        return ResponseEntity.ok(prescriptionService.createPrescription(prescriptionDto));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(
            @PathVariable Integer id,
            @RequestBody Prescription prescription) {
        return ResponseEntity.ok(prescriptionService.updatePrescription(id, prescription));
    }
    @PreAuthorize("hasRole('DOCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Integer id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','DOCTOR','PATIENT')")
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getByDoctor(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByDoctorId(doctorId));
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','DOCTOR','PATIENT')")
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getByPatient(@PathVariable Integer patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatientId(patientId));
    }
}