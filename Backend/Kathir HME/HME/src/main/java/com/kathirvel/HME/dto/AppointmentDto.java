package com.kathirvel.HME.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kathirvel.HME.Model.Appointment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private int id;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime appointmentTime;

    private int doctorId;
    private String doctorName;

    private int patientId;
    private String patientFirstName;
    private String patientLastName;

    public AppointmentDto(Appointment appointment) {
        this.id = appointment.getId();
        this.appointmentTime = appointment.getAppointmentTime();

        if (appointment.getDoctor() != null) {
            this.doctorId = appointment.getDoctor().getId();
            this.doctorName = appointment.getDoctor().getName();
        }

        if (appointment.getPatient() != null) {
            this.patientId = appointment.getPatient().getId();
            this.patientFirstName = appointment.getPatient().getFirstName();
            this.patientLastName = appointment.getPatient().getLastName();
        }
    }
}
