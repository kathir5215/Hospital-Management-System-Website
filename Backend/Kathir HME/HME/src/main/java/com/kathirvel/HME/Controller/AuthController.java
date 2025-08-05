package com.kathirvel.HME.Controller;

import com.kathirvel.HME.Config.CustomUserDetails;
import com.kathirvel.HME.Config.JwtUtil;
import com.kathirvel.HME.Model.Roles;
import com.kathirvel.HME.Model.User;
import com.kathirvel.HME.Repositary.UserRepository;
import com.kathirvel.HME.dto.AuthDto;
import com.kathirvel.HME.dto.UserDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                          UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDto.LoginRequest request) {
        System.out.println("Login attempt for user: " + request.getUsername());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()
                    )
            );

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getApproved() == null || !user.getApproved()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Collections.singletonMap("message", "Account not approved"));
            }

            Set<String> roleNames = user.getRoles().stream()
                    .map(Enum::name)
                    .collect(Collectors.toSet());

            String token = jwtUtil.generateToken(user.getUsername(), roleNames);

            System.out.println("Login successful for user: " + request.getUsername());

            return ResponseEntity.ok(new LoginResponse(token, roleNames));

        } catch (BadCredentialsException e) {
            System.out.println("Bad credentials for user: " + request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid credentials"));
        } catch (DisabledException e) {
            System.out.println("Disabled user: " + request.getUsername());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Collections.singletonMap("message", "Account disabled"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Login failed: " + e.getMessage()));
        }
    }


    public static class LoginResponse {
        private String token;
        private Set<String> roles;

        public LoginResponse(String token, Set<String> roles) {
            this.token = token;
            this.roles = roles;
        }

        public String getToken() {
            return token;
        }

        public Set<String> getRoles() {
            return roles;
        }
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername() != null ? user.getUsername() : "",
                user.getEmail() != null ? user.getEmail() : "",
                user.getRoles() != null ? user.getRoles() : Collections.emptySet(),
                user.isApproved()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDto.RegisterRequest request) {
        try {
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }

            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already registered");
            }

            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            // Use the role from request, validate it carefully
            try {
                Roles role = Roles.valueOf(request.getRole().toUpperCase());
                user.setRoles(Set.of(role));
            } catch (Exception e) {
                // If role not valid or missing, fallback to default (e.g. DOCTOR)
                user.setRoles(Set.of(Roles.DOCTOR));
            }

            user.setApproved(false); // Needs approval
            user.setVerificationToken(UUID.randomUUID().toString());

            userRepository.save(user);
            return ResponseEntity.ok("Registration successful. Waiting for admin approval.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }


    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/users/pending")
    public List<UserDto> getPendingUsers() {
        return userRepository.findByApprovedFalse().stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRoles(),
                        user.isApproved()))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PatchMapping("/users/{id}/approve")
    public ResponseEntity<?> approveUser(
            @PathVariable int id,
            @RequestBody(required = false) Map<String, Object> payload) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setApproved(true);

        // ✅ Optional: update role if provided
        if (payload != null && payload.containsKey("role")) {
            try {
                String roleString = payload.get("role").toString();
                Roles newRole = Roles.valueOf(roleString.toUpperCase());
                user.setRoles(Set.of(newRole));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid role specified");
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok("User approved successfully");
    }


    @GetMapping("/users")
    public List<UserDto> getUsers(@RequestParam(required = false) Boolean approved) {
        if (approved != null) {
            return userRepository.findByApproved(approved).stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody AuthDto.UpdatedRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("Changing role to: " + request.getRole());

        Set<Roles> newRoles = new HashSet<>();
        newRoles.add(Roles.valueOf(request.getRole()));
        user.setRoles(newRoles);

        userRepository.save(user);

        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setTokenExpiry(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)));
        userRepository.save(user);

        // Send email with reset link (implement this)
        // emailService.sendPasswordResetEmail(user.getEmail(), token);

        return ResponseEntity.ok("Password reset link sent to your email");
    }

    @GetMapping("/validate-reset-token/{token}")
    public ResponseEntity<?> validateResetToken(@PathVariable String token) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getTokenExpiry().before(new Date())) {
            throw new RuntimeException("Token expired");
        }

        return ResponseEntity.ok("Token is valid");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token,
                                           @RequestParam String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getTokenExpiry().before(new Date())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successfully");
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Prevent deleting super admin
            if (user.getRoles().contains(Roles.SUPER_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Cannot delete super admin");
            }

            userRepository.delete(user);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete user: " + e.getMessage());
        }
    }

    @GetMapping("/users/check-approval/{username}")
    public ResponseEntity<?> checkUserApproval(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(Collections.singletonMap("approved", user.isApproved()));
    }


    // ======= New endpoint to get logged-in user info =======
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            User loggedInUser = customUserDetails.getUser();

            UserDto dto = convertToDto(loggedInUser);
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }
}
