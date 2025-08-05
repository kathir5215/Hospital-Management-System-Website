package com.kathirvel.HME.Model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@Table(name = "prescription_items")
public class PrescriptionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer quantity;
    private String dosage;
    private String frequency;
    private String timing;
    private String duration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medical_item_id")
    @JsonBackReference("medical-item")
    @ToString.Exclude
    private MedicalItem medicalItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    @JsonBackReference("prescription-item")
    @ToString.Exclude
    private Prescription prescription;
}