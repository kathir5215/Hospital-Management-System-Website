package com.kathirvel.HME.dto;

import com.kathirvel.HME.Model.Roles;
import java.util.Set;
import java.util.stream.Collectors;

public class UserDto {
    private int id;
    private String username;
    private String email;
    private Set<String> roles;
    private boolean approved;

    // Constructor with all fields
    public UserDto(int id, String username, String email, Set<Roles> roles, boolean approved) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles.stream()
                .map(Enum::name)
                .collect(Collectors.toSet());
        this.approved = approved;
    }

    // Getters
    public int getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public Set<String> getRoles() { return roles; }
    public boolean isApproved() { return approved; }
}