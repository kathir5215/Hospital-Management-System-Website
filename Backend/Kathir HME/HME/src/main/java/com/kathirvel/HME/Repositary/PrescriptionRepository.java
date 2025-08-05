package com.kathirvel.HME.Repositary;

import com.kathirvel.HME.Model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    List<Prescription> findByPatient_Id(Integer patientId);
    List<Prescription> findByDoctor_Id(Integer doctorId);
}
