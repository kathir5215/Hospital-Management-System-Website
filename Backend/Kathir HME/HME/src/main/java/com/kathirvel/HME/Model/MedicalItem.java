package com.kathirvel.HME.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@Entity
@Table(name = "medical_items")
public class MedicalItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String description;
    @Column(name = "image_path")
    private String imagePath;  // URL to the tablet image
    private Integer currentStock;
    private Integer minimumStockLevel;

    @OneToMany(mappedBy = "medicalItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("medical-item")
    @ToString.Exclude
    private List<PrescriptionItem> items;
}