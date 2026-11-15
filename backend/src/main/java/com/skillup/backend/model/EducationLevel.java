package com.skillup.backend.model;

/**
 * Valeurs acceptées par la colonne candidate_profiles.education_level.
 * Le formulaire envoie des libellés ("Bachelor's Degree") : fromInput les convertit.
 */
public enum EducationLevel {
    HIGH_SCHOOL,
    ASSOCIATE,
    BACHELOR,
    MASTER,
    ENGINEERING,
    DOCTORATE,
    OTHER;

    public static EducationLevel fromInput(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String text = value.trim().toLowerCase();
        return switch (text) {
            case "high school", "high_school" -> HIGH_SCHOOL;
            case "associate", "associate degree" -> ASSOCIATE;
            case "bachelor", "bachelor's degree", "bachelors degree" -> BACHELOR;
            case "master", "master's degree", "masters degree" -> MASTER;
            case "engineering", "engineering degree" -> ENGINEERING;
            case "phd", "doctorate" -> DOCTORATE;
            case "other" -> OTHER;
            default -> fromEnumName(value);
        };
    }

    private static EducationLevel fromEnumName(String value) {
        try {
            return EducationLevel.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
