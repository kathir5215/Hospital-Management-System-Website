package com.kathirvel.HME.Repositary;

import com.kathirvel.HME.Model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepo extends JpaRepository<Appointment,Integer> {

}
