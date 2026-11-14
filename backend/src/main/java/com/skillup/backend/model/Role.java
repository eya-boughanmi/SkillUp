package com.skillup.backend.model;

/**
 * Rôle d'un compte SkillUp.
 * Les valeurs sont exactement celles acceptées par la table MySQL "users".
 */
public enum Role {
    CANDIDATE,
    RECRUITER,
    ADMIN;

    /** Accepte "Candidate", "CANDIDATE", "Recruiter", "Admin", etc. */
    public static Role fromInput(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Role.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
