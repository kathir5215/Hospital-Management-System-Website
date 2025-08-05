package com.kathirvel.HME.Repositary;

import com.kathirvel.HME.Model.Doctor;
import com.kathirvel.HME.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepo extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByUser_Username(String username);


    Optional<Doctor> findByUser(User user);
}
