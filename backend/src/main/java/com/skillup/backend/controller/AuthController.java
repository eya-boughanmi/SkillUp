package com.skillup.backend.controller;

import com.skillup.backend.dto.AuthResponse;
import com.skillup.backend.dto.LoginRequest;
import com.skillup.backend.dto.RegisterCandidateRequest;
import com.skillup.backend.dto.RegisterRecruiterRequest;
import com.skillup.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Trois adresses à tester dans Postman :
 * POST /api/auth/register/candidate   (JSON)
 * POST /api/auth/register/recruiter   (form-data + fichier PDF)
 * POST /api/auth/login                (JSON)
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/candidate")
    public ResponseEntity<AuthResponse> registerCandidate(@RequestBody RegisterCandidateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerCandidate(request));
    }

    @PostMapping(value = "/register/recruiter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuthResponse> registerRecruiter(
            @ModelAttribute RegisterRecruiterRequest request,
            @RequestParam("document") MultipartFile document) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerRecruiter(request, document));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
