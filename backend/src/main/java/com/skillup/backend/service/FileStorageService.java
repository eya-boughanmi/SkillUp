package com.skillup.backend.service;

import com.skillup.backend.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.YearMonth;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${skillup.upload-dir}") String uploadDir) {
        this.uploadDir = Path.of(uploadDir);
    }

    public void validatePdf(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Le document PDF est obligatoire.");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Le fichier ne doit pas dépasser 5 Mo.");
        }
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        String type = file.getContentType() == null ? "" : file.getContentType();
        boolean pdf = name.endsWith(".pdf") || "application/pdf".equals(type);
        if (!pdf) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Le document doit être un fichier PDF.");
        }
    }

    /** Enregistre le PDF et retourne son chemin relatif, par exemple authorizations/2026/11/uuid.pdf */
    public StoredFile storePdf(MultipartFile file) {
        validatePdf(file);

        YearMonth now = YearMonth.now();
        String relativePath = "authorizations/" + now.getYear() + "/"
                + String.format("%02d", now.getMonthValue()) + "/"
                + UUID.randomUUID() + ".pdf";

        Path target = uploadDir.resolve(relativePath).normalize();
        try {
            Files.createDirectories(target.getParent());
            file.transferTo(target);
        } catch (IOException ex) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Impossible d'enregistrer le PDF.");
        }

        String original = file.getOriginalFilename() == null ? "document.pdf" : Path.of(file.getOriginalFilename()).getFileName().toString();
        String contentType = file.getContentType() == null ? "application/pdf" : file.getContentType();
        return new StoredFile(original, relativePath, contentType, file.getSize());
    }

    public void delete(String relativePath) {
        try {
            Files.deleteIfExists(uploadDir.resolve(relativePath).normalize());
        } catch (IOException ignored) {
            // Le fichier orphelin n'empêche pas de renvoyer l'erreur principale.
        }
    }

    public record StoredFile(String originalFilename, String storagePath, String contentType, long size) {
    }
}
