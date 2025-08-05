package com.kathirvel.HME;

import com.kathirvel.HME.Model.Roles;
import com.kathirvel.HME.Model.User;
import com.kathirvel.HME.Repositary.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void createAdminUser() {
        userRepository.findByUsername("super_admin").ifPresentOrElse(
                user -> {},  // Admin already exists
                () -> {
                    User admin = new User();
                    admin.setUsername("super_admin");
                    admin.setPassword(passwordEncoder.encode("superadmin123"));
                    admin.setRoles(Set.of(Roles.SUPER_ADMIN));
                    admin.setApproved(true);  // Explicitly approve admin
                    userRepository.save(admin);
                }
        );
    }
}
