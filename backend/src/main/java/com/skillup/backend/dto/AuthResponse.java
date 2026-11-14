package com.skillup.backend.dto;

import com.skillup.backend.model.User;

/** Réponse renvoyée à Postman. Le mot de passe n'y figure jamais. */
public class AuthResponse {

    private String message;
    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private boolean active;

    public static AuthResponse of(String message, User user) {
        AuthResponse response = new AuthResponse();
        response.message = message;
        response.userId = user.getId();
        response.fullName = user.getFullName();
        response.email = user.getEmail();
        response.role = user.getRole().name();
        response.active = user.isActive();
        return response;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }
}
