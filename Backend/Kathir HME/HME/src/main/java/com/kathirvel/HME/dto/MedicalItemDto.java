package com.kathirvel.HME.dto;

import lombok.Data;

@Data
public class MedicalItemDto {
    private Integer id;
    private String name;
    private String description;
    private String imageUrl;
    private Integer currentStock;
    private Integer minimumStockLevel;
}