package com.kathirvel.HME.Service;

import com.kathirvel.HME.Model.Patient;
import com.kathirvel.HME.Repositary.PatientRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {
    @Autowired
    private PatientRepo pRepo;

    public Patient addPatient(Patient patient) {
        return pRepo.save(patient);
    }

    public List<Patient> getPatient() {
        return pRepo.findAll();
    }

    public Patient getPatientId(int id) {
        return pRepo.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public Patient updatePatient(int id, Patient updatePatient) {
        Patient patient = pRepo.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setFirstName(updatePatient.getFirstName());
        patient.setLastName(updatePatient.getLastName());
        patient.setPhone(updatePatient.getPhone());
        patient.setAddress(updatePatient.getAddress());
        patient.setGender(updatePatient.getGender());
        return pRepo.save(patient);
    }
    @Transactional
    public Patient deletePatientById(int id) {
         Patient patient= pRepo.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
         pRepo.deleteById(id);
         return patient;
    }
}
