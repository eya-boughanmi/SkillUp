package com.skillup.backend.exception;

import org.springframework.http.HttpStatus;

/** Erreur métier renvoyée au client avec un code HTTP clair. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
