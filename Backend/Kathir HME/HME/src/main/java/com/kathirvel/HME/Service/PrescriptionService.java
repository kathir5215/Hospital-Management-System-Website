package com.kathirvel.HME.Service;

import com.kathirvel.HME.Model.*;
import com.kathirvel.HME.Repositary.*;
import com.kathirvel.HME.dto.PrescriptionDto;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private PrescriptionItemRepository prescriptionItemRepository;
    @Autowired
    private DoctorRepo doctorRepo;
    @Autowired
    private PatientRepo patientRepository;
    @Autowired
    private MedicalItemRepository medicalItemRepository;

    @Transactional
    public Prescription createPrescription(PrescriptionDto prescriptionDto) {
        // Initialize items if null
        if (prescriptionDto.getItems() == null) {
            prescriptionDto.setItems(new ArrayList<>());
        }

        Prescription prescription = new Prescription();
        prescription.setNotes(prescriptionDto.getNotes());

        // Set doctor and patient
        Doctor doctor = doctorRepo.findById(prescriptionDto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        prescription.setDoctor(doctor);

        Patient patient = patientRepository.findById(prescriptionDto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        prescription.setPatient(patient);

        // Create and set items
        List<PrescriptionItem> items = new ArrayList<>();
        for (PrescriptionDto.ItemDto itemDto : prescriptionDto.getItems()) {
            MedicalItem medicalItem = medicalItemRepository.findById(itemDto.getMedicalItemId())
                    .orElseThrow(() -> new RuntimeException(
                            "MedicalItem not found with ID: " + itemDto.getMedicalItemId()));

            // Check stock availability
            if (medicalItem.getCurrentStock() < itemDto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + medicalItem.getName() +
                        ". Available: " + medicalItem.getCurrentStock() +
                        ", Requested: " + itemDto.getQuantity());
            }

            // Update stock
            medicalItem.setCurrentStock(medicalItem.getCurrentStock() - itemDto.getQuantity());
            medicalItemRepository.save(medicalItem);

            PrescriptionItem item = new PrescriptionItem();
            item.setQuantity(itemDto.getQuantity());
            item.setDosage(itemDto.getDosage());
            item.setFrequency(itemDto.getFrequency());
            item.setTiming(itemDto.getTiming());
            item.setDuration(itemDto.getDuration());
            item.setMedicalItem(medicalItem);
            item.setPrescription(prescription);

            items.add(item);
        }

        prescription.setItems(items);
        return prescriptionRepository.save(prescription);
    }

    @Transactional(readOnly = true)
    public Prescription getPrescriptionByIdWithDetails(Integer id) {
        return prescriptionRepository.findById(id)
                .map(prescription -> {
                    // Initialize all relationships
                    Hibernate.initialize(prescription.getDoctor());
                    Hibernate.initialize(prescription.getPatient());
                    Hibernate.initialize(prescription.getItems());

                    if (prescription.getItems() != null) {
                        prescription.getItems().forEach(item -> {
                            Hibernate.initialize(item.getMedicalItem());
                        });
                    }
                    return prescription;
                })
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
    }
    @Transactional
    public Prescription updatePrescription(Integer id, Prescription prescriptionDetails) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        validatePrescriptionItems(prescriptionDetails);

        // Update basic fields
        prescription.setNotes(prescriptionDetails.getNotes());

        // Update doctor if changed (using != for primitive int comparison)
        if (prescription.getDoctor().getId() != prescriptionDetails.getDoctor().getId()) {
            Doctor doctor = doctorRepo.findById(prescriptionDetails.getDoctor().getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            prescription.setDoctor(doctor);
        }

        // Update patient if changed (using != for primitive int comparison)
        if (prescription.getPatient().getId() != prescriptionDetails.getPatient().getId()) {
            Patient patient = patientRepository.findById(prescriptionDetails.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            prescription.setPatient(patient);
        }

        // Clear existing items
        prescriptionItemRepository.deleteByPrescriptionId(id);
        prescription.getItems().clear();

        // Add new items
        processPrescriptionItems(prescriptionDetails, prescription);

        return prescriptionRepository.save(prescription);
    }

    @Transactional
    public void deletePrescription(Integer id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        // Return stock for each item
        for (PrescriptionItem item : prescription.getItems()) {
            MedicalItem medicalItem = medicalItemRepository.findById(item.getMedicalItem().getId())
                    .orElseThrow(() -> new RuntimeException("Medical item not found"));
            medicalItem.setCurrentStock(medicalItem.getCurrentStock() + item.getQuantity());
            medicalItemRepository.save(medicalItem);
        }

        prescriptionRepository.delete(prescription);
    }

    private void validatePrescriptionItems(Prescription prescription) {
        if (prescription.getItems() == null) {
            throw new RuntimeException("Prescription items cannot be null");
        }

        for (PrescriptionItem item : prescription.getItems()) {
            if (item.getMedicalItem() == null) {
                throw new RuntimeException("MedicalItem cannot be null for prescription item");
            }

            MedicalItem medicalItem = medicalItemRepository.findById(item.getMedicalItem().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "MedicalItem not found with ID: " + item.getMedicalItem().getId()));

            if (medicalItem.getCurrentStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + medicalItem.getName() +
                        ". Available: " + medicalItem.getCurrentStock() +
                        ", Requested: " + item.getQuantity());
            }
        }
    }

    private void processPrescriptionItems(Prescription source, Prescription target) {
        for (PrescriptionItem item : source.getItems()) {
            MedicalItem medicalItem = medicalItemRepository.findById(item.getMedicalItem().getId())
                    .orElseThrow(() -> new RuntimeException("MedicalItem not found"));

            medicalItem.setCurrentStock(medicalItem.getCurrentStock() - item.getQuantity());
            medicalItemRepository.save(medicalItem);

            item.setMedicalItem(medicalItem);
            item.setPrescription(target);
            prescriptionItemRepository.save(item);
            target.getItems().add(item);
        }
    }

    // Keep all other existing methods (getAllPrescriptions, getById, etc.)
    public Prescription getPrescriptionById(Integer id) {
        return prescriptionRepository.findById(id)
                .map(prescription -> {
                    // Trigger lazy loading
                    prescription.getDoctor().getName();
                    prescription.getPatient().getFirstName();
                    prescription.getItems().forEach(item -> {
                        item.getMedicalItem().getName();
                    });
                    return prescription;
                })
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Prescription> getPrescriptionsByDoctorId(Integer doctorId) {
        return prescriptionRepository.findByDoctor_Id(doctorId);
    }

    @Transactional(readOnly = true)
    public List<Prescription> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionRepository.findAll();

        for (Prescription p : prescriptions) {
            initializeLazyFields(p);
        }

        return prescriptions;
    }

    @Transactional(readOnly = true)
    public List<Prescription> getPrescriptionsByPatientId(Integer patientId) {
        return prescriptionRepository.findByPatient_Id(patientId);
    }

    private void initializeLazyFields(Prescription p) {
        if (p.getDoctor() != null) p.getDoctor().getName(); // triggers lazy load
        if (p.getPatient() != null) p.getPatient().getFirstName(); // triggers lazy load
        if (p.getItems() != null) {
            p.getItems().forEach(item -> {
                if (item.getMedicalItem() != null) item.getMedicalItem().getName(); // triggers lazy load
            });
        }
    }


    // Add this method to handle proper serialization
}