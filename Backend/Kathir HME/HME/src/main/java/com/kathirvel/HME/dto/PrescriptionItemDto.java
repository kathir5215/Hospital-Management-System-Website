package com.kathirvel.HME.dto;

import lombok.Data;

// In PrescriptionItemDto.java
@Data
public class PrescriptionItemDto {
    private Integer id;
    private Integer medicalItemId;  // This should match your frontend expectation
    private String medicalItemName; // Optional: if you want to send name too
    private Integer quantity;
    private String dosage;
    private String frequency;
    private String timing;
    private String duration;
    private Integer prescriptionId;
}