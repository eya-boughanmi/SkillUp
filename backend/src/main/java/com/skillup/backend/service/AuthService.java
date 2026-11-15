package com.skillup.backend.service;

import com.skillup.backend.dto.AuthResponse;
import com.skillup.backend.dto.LoginRequest;
import com.skillup.backend.dto.RegisterCandidateRequest;
import com.skillup.backend.dto.RegisterRecruiterRequest;
import com.skillup.backend.exception.ApiException;
import com.skillup.backend.model.CandidateProfile;
import com.skillup.backend.model.Company;
import com.skillup.backend.model.CompanyAuthorizationDocument;
import com.skillup.backend.model.DocumentStatus;
import com.skillup.backend.model.EducationLevel;
import com.skillup.backend.model.RecruiterProfile;
import com.skillup.backend.model.Role;
import com.skillup.backend.model.User;
import com.skillup.backend.repository.CandidateProfileRepository;
import com.skillup.backend.repository.CompanyAuthorizationDocumentRepository;
import com.skillup.backend.repository.CompanyRepository;
import com.skillup.backend.repository.RecruiterProfileRepository;
import com.skillup.backend.repository.UserRepository;
import com.skillup.backend.service.FileStorageService.StoredFile;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class AuthService {

    /** La base refuse une adresse vide. On met ce texte si le candidat n'en envoie pas. */
    private static final String MISSING_ADDRESS = "Non renseigné";

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyAuthorizationDocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public AuthService(UserRepository userRepository,
                       CandidateProfileRepository candidateProfileRepository,
                       CompanyRepository companyRepository,
                       RecruiterProfileRepository recruiterProfileRepository,
                       CompanyAuthorizationDocumentRepository documentRepository,
                       PasswordEncoder passwordEncoder,
                       FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.companyRepository = companyRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public AuthResponse registerCandidate(RegisterCandidateRequest request) {
        if (request == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Les informations d'inscription sont manquantes.");
        }

        String fullName = requireText(request.getFullName(), "Le nom complet est obligatoire.", 200);
        String email = requireEmail(request.getEmail());
        String phone = requireText(request.getPhone(), "Le numéro de téléphone est obligatoire.", 30);
        String password = requirePassword(request.getPassword(), request.getConfirmPassword());
        requireTerms(request.isTerms());

        EducationLevel level = EducationLevel.fromInput(request.getEducationLevel());
        if (level == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Le niveau d'études est invalide. Exemples : High School, Bachelor's Degree, Master's Degree, Engineering Degree, PhD, Other.");
        }
        String institution = requireText(request.getInstitution(), "L'établissement est obligatoire.", 200);
        String fieldOfStudy = requireText(request.getFieldOfStudy(), "Le domaine d'études est obligatoire.", 150);
        String address = optionalAddress(request.getAddress());

        ensureEmailIsFree(email);

        User user = newUser(fullName, email, password, Role.CANDIDATE, true);
        user = userRepository.save(user);

        CandidateProfile profile = new CandidateProfile();
        profile.setUser(user);
        profile.setEducationLevel(level);
        profile.setUniversity(institution);
        profile.setFieldOfStudy(fieldOfStudy);
        profile.setPhone(phone);
        profile.setAddress(address);
        candidateProfileRepository.save(profile);

        return AuthResponse.of("Compte candidat créé. Vous pouvez vous connecter.", user);
    }

    @Transactional
    public AuthResponse registerRecruiter(RegisterRecruiterRequest request, MultipartFile document) {
        if (request == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Les informations d'inscription sont manquantes.");
        }

        String fullName = requireText(request.getFullName(), "Le nom complet est obligatoire.", 200);
        String email = requireEmail(request.getEmail());
        String phone = requireText(request.getPhone(), "Le numéro de téléphone est obligatoire.", 30);
        String password = requirePassword(request.getPassword(), request.getConfirmPassword());
        requireTerms(request.isTerms());
        String companyName = requireText(request.getCompanyName(), "Le nom de l'entreprise est obligatoire.", 150);
        String jobPosition = requireText(request.getJobPosition(), "Le poste est obligatoire.", 100);
        String website = requireWebsite(request.getWebsite());
        String address = requireText(request.getAddress(), "L'adresse de l'entreprise est obligatoire.", 255);
        fileStorageService.validatePdf(document);
        ensureEmailIsFree(email);

        User user = newUser(fullName, email, password, Role.RECRUITER, false);
        user = userRepository.save(user);

        Company company = companyRepository.findByNameIgnoreCase(companyName).orElseGet(() -> {
            Company created = new Company();
            created.setName(companyName);
            created.setAddress(address);
            created.setWebsite(website);
            return companyRepository.save(created);
        });

        RecruiterProfile profile = new RecruiterProfile();
        profile.setUser(user);
        profile.setCompany(company);
        profile.setJobTitle(jobPosition);
        profile.setPhone(phone);
        profile = recruiterProfileRepository.save(profile);

        StoredFile stored = fileStorageService.storePdf(document);
        try {
            CompanyAuthorizationDocument savedDocument = new CompanyAuthorizationDocument();
            savedDocument.setRecruiterProfile(profile);
            savedDocument.setOriginalFilename(stored.originalFilename());
            savedDocument.setStoragePath(stored.storagePath());
            savedDocument.setContentType(stored.contentType());
            savedDocument.setFileSizeBytes(stored.size());
            savedDocument.setStatus(DocumentStatus.PENDING);
            documentRepository.save(savedDocument);
        } catch (RuntimeException ex) {
            fileStorageService.delete(stored.storagePath());
            throw ex;
        }

        return AuthResponse.of(
                "Demande envoyée. Votre compte recruteur est en attente de validation.",
                user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        if (request == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Les informations de connexion sont manquantes.");
        }

        String email = requireEmail(request.getEmail());
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Le mot de passe est obligatoire.");
        }
        Role role = Role.fromInput(request.getRole());
        if (role == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Le rôle est invalide. Utilisez CANDIDATE, RECRUITER ou ADMIN.");
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect."));

        if (user.getRole() != role) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Ce compte n'a pas le rôle demandé.");
        }

        boolean passwordMatches;
        try {
            passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        } catch (IllegalArgumentException ex) {
            passwordMatches = false;
        }
        if (!passwordMatches) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect.");
        }

        if (!user.isActive()) {
            if (user.getRole() == Role.RECRUITER) {
                throw new ApiException(HttpStatus.FORBIDDEN,
                        "Votre compte recruteur est en attente de validation par un administrateur.");
            }
            throw new ApiException(HttpStatus.FORBIDDEN, "Ce compte est désactivé.");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String companyName = null;

        if (user.getRole() == Role.RECRUITER) {
            companyName = recruiterProfileRepository.findByUserId(user.getId())
                    .map(profile -> profile.getCompany().getName())
                    .orElse(null);
        }

        return AuthResponse.of("Connexion réussie.", user, companyName);
    }

    private User newUser(String fullName, String email, String password, Role role, boolean active) {
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);
        user.setTermsAccepted(true);
        user.setTermsAcceptedAt(LocalDateTime.now());
        user.setActive(active);
        return user;
    }

    private void ensureEmailIsFree(String email) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Cet email est déjà utilisé.");
        }
    }

    private void requireTerms(boolean terms) {
        if (!terms) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Vous devez accepter les conditions d'utilisation.");
        }
    }

    private String requirePassword(String password, String confirmPassword) {
        if (password == null || password.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Le mot de passe est obligatoire.");
        }
        if (password.length() < 8) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Le mot de passe doit contenir au moins 8 caractères.");
        }
        if (confirmPassword == null || !password.equals(confirmPassword)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Les deux mots de passe ne correspondent pas.");
        }
        return password;
    }

    private String requireEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "L'email est obligatoire.");
        }
        String cleaned = email.trim().toLowerCase();
        if (!cleaned.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "L'email n'est pas valide.");
        }
        return cleaned;
    }

    private String requireWebsite(String website) {
        String cleaned = requireText(website, "Le site web de l'entreprise est obligatoire.", 255);
        if (!cleaned.matches("^https?://.+\\..+")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Le site web doit commencer par http:// ou https://.");
        }
        return cleaned;
    }

    private String optionalAddress(String address) {
        if (address == null || address.isBlank()) {
            return MISSING_ADDRESS;
        }
        String cleaned = address.trim();
        if (cleaned.length() > 255) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "L'adresse ne doit pas dépasser 255 caractères.");
        }
        return cleaned;
    }

    private String requireText(String value, String requiredMessage, int maxLength) {
        if (value == null || value.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, requiredMessage);
        }
        String cleaned = value.trim();
        if (cleaned.length() > maxLength) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Ce champ ne doit pas dépasser " + maxLength + " caractères.");
        }
        return cleaned;
    }
}
