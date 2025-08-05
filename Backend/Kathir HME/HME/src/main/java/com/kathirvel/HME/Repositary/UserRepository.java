package com.kathirvel.HME.Repositary;

import com.kathirvel.HME.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

   Optional<User> findByUsername(String username);

   Optional<User> findByEmail(String email);

   Optional<User> findByResetToken(String resetToken);

   List<User> findByApprovedFalse();

//   List<User> findByTokenExpiryBefore(Date now);

   // For checking existing username or email during registration
//   boolean existsByUsername(String username);
//   boolean existsByEmail(String email);

   // For admin approval dashboard
   List<User> findByApproved(boolean approved);

   // For verification token check
//   Optional<User> findByVerificationToken(String token);
}