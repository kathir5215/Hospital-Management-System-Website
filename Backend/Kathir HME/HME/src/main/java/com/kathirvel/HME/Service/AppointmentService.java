package com.kathirvel.HME.Service;

import com.kathirvel.HME.Model.Appointment;
import com.kathirvel.HME.Model.Doctor;
import com.kathirvel.HME.Model.Patient;
import com.kathirvel.HME.Repositary.AppointmentRepo;
import com.kathirvel.HME.Repositary.DoctorRepo;
import com.kathirvel.HME.Repositary.PatientRepo;
import com.kathirvel.HME.dto.AppointmentDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepo aRepo;

    @Autowired
    private DoctorRepo dRepo;

    @Autowired
    private PatientRepo pRepo;

    public List<AppointmentDto> getAppointments() {
        return aRepo.findAll().stream()
                .map(AppointmentDto::new)
                .collect(Collectors.toList());
    }

    public Appointment addAppointment(AppointmentDto dto) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentTime(dto.getAppointmentTime());

        Doctor doctor = dRepo.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Patient patient = pRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        appointment.setDoctor(doctor);
        appointment.setPatient(patient);

        return aRepo.save(appointment);
    }

    public Appointment getAppointmentsById(int id) {
        return aRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public Appointment updateAppointment(int id, AppointmentDto dto) {
        Appointment existing = aRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        existing.setAppointmentTime(dto.getAppointmentTime());

        Doctor doctor = dRepo.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Patient patient = pRepo.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        existing.setDoctor(doctor);
        existing.setPatient(patient);

        return aRepo.save(existing);
    }

    @Transactional
    public void deleteAppointmentById(int id) {
        Appointment appointment = aRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        aRepo.delete(appointment);
    }
}

