package com.kathirvel.HME.Service;

import com.kathirvel.HME.Model.Doctor;
import com.kathirvel.HME.Repositary.DoctorRepo;
import jakarta.transaction.Transactional;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepo dRepo;


    public Doctor addDoctor(Doctor doctor) {
        return dRepo.save(doctor);
    }

    public List<Doctor> getDoctor() {
        return dRepo.findAll();
    }

    public Doctor getDoctoryById(int id) {
        return dRepo.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
    }
    public Doctor updateDoctorById(int id,Doctor doctor) {
        Doctor updateDoctor = dRepo.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
        updateDoctor.setName(doctor.getName());
        updateDoctor.setPhone(doctor.getPhone());
        updateDoctor.setGender(doctor.getGender());
        updateDoctor.setAvailable(doctor.getAvailable());
        return dRepo.save(updateDoctor);
    }

    @Transactional
    public void deleteDoctorById(int id) {
        Doctor doctor = dRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        dRepo.delete(doctor);
    }


}
