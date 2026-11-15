package com.skillup.backend.repository;

import com.skillup.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Accès à la table users.
 * Spring crée l'implémentation tout seul : pas besoin d'écrire du SQL.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
