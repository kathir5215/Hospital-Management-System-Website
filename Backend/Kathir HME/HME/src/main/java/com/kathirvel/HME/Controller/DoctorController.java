package com.kathirvel.HME.Controller;

import com.kathirvel.HME.Model.Doctor;
import com.kathirvel.HME.Model.Patient;
import com.kathirvel.HME.Service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/Dapi")
public class DoctorController {
    @Autowired
    DoctorService dService;

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PostMapping("/doctor")
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return dService.addDoctor(doctor);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','DOCTOR','PATIENT')")
    @GetMapping("/doctor")
    public List<Doctor> getAllDoctors() {
        return dService.getDoctor();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','DOCTOR','PATIENT')")
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable int id) {
       Doctor doctor = dService.getDoctoryById(id);
       return ResponseEntity.ok().body(doctor);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','DOCTOR')")
    @PutMapping("/{id}")
    public Doctor updateDoctorById(@PathVariable int id, @RequestBody Doctor doctor) {
        return dService.updateDoctorById(id,doctor);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctorById(@PathVariable int id) {
        dService.deleteDoctorById(id);
        return ResponseEntity.ok("Doctor deleted successfully");
    }

}


