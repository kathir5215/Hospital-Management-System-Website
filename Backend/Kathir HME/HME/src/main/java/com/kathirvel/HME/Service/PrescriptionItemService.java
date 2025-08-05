package com.kathirvel.HME.Service;

import com.kathirvel.HME.Model.*;
import com.kathirvel.HME.Repositary.*;
import com.kathirvel.HME.dto.PrescriptionItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PrescriptionItemService {

    @Autowired
    private PrescriptionItemRepository prescriptionItemRepository;

    @Autowired
    private MedicalItemRepository medicalItemRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Transactional(readOnly = true)
    public List<PrescriptionItem> getItemsByPrescriptionId(Integer prescriptionId) {
        List<PrescriptionItem> items = prescriptionItemRepository.findByPrescriptionId(prescriptionId);
        // Initialize lazy-loaded fields
        items.forEach(item -> {
            if (item.getMedicalItem() != null) item.getMedicalItem().getName();
        });
        return items;
    }

    @Transactional(readOnly = true)
    public PrescriptionItem getItemById(Integer id) {
        return prescriptionItemRepository.findById(id)
                .map(item -> {
                    // Initialize lazy-loaded fields
                    if (item.getMedicalItem() != null) item.getMedicalItem().getName();
                    if (item.getPrescription() != null) {
                        item.getPrescription().getId(); // Trigger lazy loading
                    }
                    return item;
                })
                .orElseThrow(() -> new RuntimeException("Prescription item not found with ID: " + id));
    }

    @Transactional
    public PrescriptionItem createItem(PrescriptionItemDto itemDto) {
        // Validate prescription exists
        Prescription prescription = prescriptionRepository.findById(itemDto.getPrescriptionId())
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + itemDto.getPrescriptionId()));

        // Validate medical item exists and has sufficient stock
        MedicalItem medicalItem = medicalItemRepository.findById(itemDto.getMedicalItemId())
                .orElseThrow(() -> new RuntimeException("Medical item not found with ID: " + itemDto.getMedicalItemId()));

        if (medicalItem.getCurrentStock() < itemDto.getQuantity()) {
            throw new RuntimeException("Insufficient stock for " + medicalItem.getName() +
                    ". Available: " + medicalItem.getCurrentStock() +
                    ", Requested: " + itemDto.getQuantity());
        }

        // Create new item
        PrescriptionItem item = new PrescriptionItem();
        item.setQuantity(itemDto.getQuantity());
        item.setDosage(itemDto.getDosage());
        item.setFrequency(itemDto.getFrequency());
        item.setTiming(itemDto.getTiming());
        item.setDuration(itemDto.getDuration());
        item.setMedicalItem(medicalItem);
        item.setPrescription(prescription);

        // Update stock
        medicalItem.setCurrentStock(medicalItem.getCurrentStock() - itemDto.getQuantity());
        medicalItemRepository.save(medicalItem);

        return prescriptionItemRepository.save(item);
    }

    @Transactional
    public PrescriptionItem updateItem(Integer id, PrescriptionItemDto itemDto) {
        PrescriptionItem item = prescriptionItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription item not found with ID: " + id));

        // Handle quantity changes
        if (itemDto.getQuantity() != null && !itemDto.getQuantity().equals(item.getQuantity())) {
            MedicalItem medicalItem = medicalItemRepository.findById(item.getMedicalItem().getId())
                    .orElseThrow(() -> new RuntimeException("Medical item not found"));

            int quantityDifference = itemDto.getQuantity() - item.getQuantity();
            if (medicalItem.getCurrentStock() < quantityDifference) {
                throw new RuntimeException("Insufficient stock for " + medicalItem.getName() +
                        ". Available: " + medicalItem.getCurrentStock() +
                        ", Requested adjustment: " + quantityDifference);
            }

            medicalItem.setCurrentStock(medicalItem.getCurrentStock() - quantityDifference);
            medicalItemRepository.save(medicalItem);
            item.setQuantity(itemDto.getQuantity());
        }

        // Update other fields
        if (itemDto.getDosage() != null) {
            item.setDosage(itemDto.getDosage());
        }
        if (itemDto.getFrequency() != null) {
            item.setFrequency(itemDto.getFrequency());
        }
        if (itemDto.getTiming() != null) {
            item.setTiming(itemDto.getTiming());
        }
        if (itemDto.getDuration() != null) {
            item.setDuration(itemDto.getDuration());
        }

        // If medical item is being changed
        if (itemDto.getMedicalItemId() != null &&
                !itemDto.getMedicalItemId().equals(item.getMedicalItem().getId())) {

            MedicalItem newMedicalItem = medicalItemRepository.findById(itemDto.getMedicalItemId())
                    .orElseThrow(() -> new RuntimeException("New medical item not found"));

            // Return stock for old item
            MedicalItem oldMedicalItem = item.getMedicalItem();
            oldMedicalItem.setCurrentStock(oldMedicalItem.getCurrentStock() + item.getQuantity());
            medicalItemRepository.save(oldMedicalItem);

            // Check stock for new item
            if (newMedicalItem.getCurrentStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + newMedicalItem.getName() +
                        ". Available: " + newMedicalItem.getCurrentStock() +
                        ", Requested: " + item.getQuantity());
            }

            // Deduct stock for new item
            newMedicalItem.setCurrentStock(newMedicalItem.getCurrentStock() - item.getQuantity());
            medicalItemRepository.save(newMedicalItem);

            item.setMedicalItem(newMedicalItem);
        }

        return prescriptionItemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Integer id) {
        PrescriptionItem item = prescriptionItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription item not found with ID: " + id));

        // Return stock
        MedicalItem medicalItem = item.getMedicalItem();
        medicalItem.setCurrentStock(medicalItem.getCurrentStock() + item.getQuantity());
        medicalItemRepository.save(medicalItem);

        prescriptionItemRepository.delete(item);
    }
}