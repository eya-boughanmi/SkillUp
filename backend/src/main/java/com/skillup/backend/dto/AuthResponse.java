package com.skillup.backend.dto;

import com.skillup.backend.model.User;

public class AuthResponse {
    private String message;
    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private boolean active;
    private String companyName;

    public static AuthResponse of(String message, User user) {
        return of(message, user, null);
    }

    public static AuthResponse of(String message, User user, String companyName) {
        AuthResponse response = new AuthResponse();
        response.message = message;
        response.userId = user.getId();
        response.fullName = user.getFullName();
        response.email = user.getEmail();
        response.role = user.getRole().name();
        response.active = user.isActive();
        response.companyName = companyName;
        return response;
    }

    public String getMessage() { return message; }
    public Long getUserId() { return userId; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isActive() { return active; }
    public String getCompanyName() { return companyName; }
}
