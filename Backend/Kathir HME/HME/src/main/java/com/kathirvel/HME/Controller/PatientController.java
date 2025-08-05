package com.kathirvel.HME.Controller;

import com.kathirvel.HME.Model.Patient;
import com.kathirvel.HME.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/Papi")
public class PatientController {

    @Autowired
    PatientService pService;

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/patient")
    public Patient addPatient(@RequestBody Patient patient) {
        return pService.addPatient(patient);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','DOCTOR','PATIENT')")
    @GetMapping("/patient")
    public List<Patient> getAllPatients() {
        return pService.getPatient();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','DOCTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable int id) {
        Patient patient1 = pService.getPatientId(id);
        return ResponseEntity.ok().body(patient1);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable int id, @RequestBody Patient patient) {
        return pService.updatePatient(id, patient);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatientById(@PathVariable int id) {
        pService.deletePatientById(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }
}
