package com.kathirvel.HME.Repositary;

import com.kathirvel.HME.Model.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Integer> {
        // Add this method
        void deleteByPrescriptionId(Integer prescriptionId);

        List<PrescriptionItem> findByPrescriptionId(Integer prescriptionId);

        // Your other repository methods...

}