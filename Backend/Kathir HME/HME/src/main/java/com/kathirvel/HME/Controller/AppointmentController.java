package com.kathirvel.HME.Controller;

import com.kathirvel.HME.Model.Appointment;
import com.kathirvel.HME.Service.AppointmentService;
import com.kathirvel.HME.dto.AppointmentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("/Aapi")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PostMapping("/appointments")
    public Appointment addAppointment(@RequestBody AppointmentDto dto) {
        return appointmentService.addAppointment(dto);
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','DOCTOR')")
    @GetMapping("/appointments")
    public List<AppointmentDto> getAppointments() {
        return appointmentService.getAppointments();
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','DOCTOR')")
    @GetMapping("/{id}")
    public AppointmentDto getAppointmentById(@PathVariable int id) {
        Appointment appointment = appointmentService.getAppointmentsById(id);
        return new AppointmentDto(appointment); // ✅ returns proper DTO
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PutMapping("/{id}")
    public Appointment updateAppointment(@PathVariable int id, @RequestBody AppointmentDto dto) {
        return appointmentService.updateAppointment(id, dto);
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointmentById(@PathVariable int id) {
        appointmentService.deleteAppointmentById(id);
        return ResponseEntity.ok("Appointment deleted successfully");
    }
}

