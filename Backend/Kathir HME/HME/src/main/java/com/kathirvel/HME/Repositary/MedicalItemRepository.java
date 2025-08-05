package com.kathirvel.HME.Repositary;

import com.kathirvel.HME.Model.MedicalItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MedicalItemRepository extends JpaRepository<MedicalItem, Integer> {
    List<MedicalItem> findByCurrentStockLessThan(Integer minimumStockLevel);

    @Query("SELECT m FROM MedicalItem m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<MedicalItem> searchByName(String query);
}
