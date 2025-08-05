package com.kathirvel.HME.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;
import jakarta.validation.constraints.*;

@Data
public class PrescriptionDto {
    @NotNull(message = "Patient ID must not be null")
    private Integer patientId;

    @NotNull(message = "Doctor ID must not be null")
    private Integer doctorId;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;

    @Valid
    @Size(min = 1, message = "Prescription must contain at least one item")
        private List<ItemDto> items;

    @Data

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ItemDto {
        private String medicalItemName;
        @NotNull(message = "Medical item ID must not be null")
        private Integer medicalItemId;

        @NotNull(message = "Quantity must not be null")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        @Size(max = 50, message = "Dosage cannot exceed 50 characters")
        private String dosage;

        @Size(max = 20, message = "Frequency cannot exceed 20 characters")
        private String frequency;

        @Size(max = 20, message = "Timing cannot exceed 20 characters")
        private String timing;

        @Pattern(regexp = "^(\\d+\\s(day|week|month)s?|As needed)$",
                message = "Invalid duration format. Use 'X days/weeks/months' or 'As needed'")
        private String duration;
    }
}