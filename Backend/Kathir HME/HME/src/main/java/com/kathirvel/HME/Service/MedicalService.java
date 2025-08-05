package com.kathirvel.HME.Service;

import com.kathirvel.HME.Model.MedicalItem;
import com.kathirvel.HME.Repositary.MedicalItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class MedicalService {
    @Autowired
    private MedicalItemRepository medicalItemRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<MedicalItem> getAllMedicalItems() {
        return medicalItemRepository.findAll();
    }

    public MedicalItem addMedicalItem(MedicalItem item, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String filename = fileStorageService.storeFile(imageFile);
            item.setImagePath(filename);
        }
        return medicalItemRepository.save(item);
    }

    public MedicalItem updateMedicalItem(Integer id, MedicalItem item, MultipartFile imageFile) throws IOException {
        MedicalItem existingItem = medicalItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical item not found"));

        existingItem.setName(item.getName());
        existingItem.setDescription(item.getDescription());
        existingItem.setCurrentStock(item.getCurrentStock());
        existingItem.setMinimumStockLevel(item.getMinimumStockLevel());

        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image if exists
            if (existingItem.getImagePath() != null) {
                fileStorageService.deleteFile(existingItem.getImagePath());
            }
            String filename = fileStorageService.storeFile(imageFile);
            existingItem.setImagePath(filename);
        }

        return medicalItemRepository.save(existingItem);
    }

    public void deleteMedicalItem(Integer id) throws IOException {
        MedicalItem item = medicalItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical item not found"));

        // Delete associated image
        if (item.getImagePath() != null) {
            fileStorageService.deleteFile(item.getImagePath());
        }

        medicalItemRepository.deleteById(id);
    }

    public List<MedicalItem> getLowStockItems() {
        return medicalItemRepository.findByCurrentStockLessThan(10);
    }

    @Transactional
    public boolean reduceStock(Integer itemId, Integer quantity) {
        MedicalItem item = medicalItemRepository.findById(itemId).orElse(null);
        if (item == null || item.getCurrentStock() < quantity) {
            return false;
        }
        item.setCurrentStock(item.getCurrentStock() - quantity);
        medicalItemRepository.save(item);
        return true;
    }
}