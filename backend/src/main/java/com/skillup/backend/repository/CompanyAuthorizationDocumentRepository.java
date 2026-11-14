package com.skillup.backend.repository;

import com.skillup.backend.model.CompanyAuthorizationDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyAuthorizationDocumentRepository extends JpaRepository<CompanyAuthorizationDocument, Long> {
}
