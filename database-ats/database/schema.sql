-- =====================================================================
--  SkillUp — Plateforme intelligente de recrutement
--  Schéma MySQL 8.0.16+  (InnoDB, utf8mb4)  — version 2 : nouveau
--  formulaire d'inscription Candidate / Recruiter
--  Équipe : Eya Boughanmi (BDD & ATS), Yasmine Ammari (Backend),
--           Yesmine Boukrayaa (Frontend)
--
--  Organisation du script :
--    1. Base de données
--    2. Noyau (Home / Inscription / Connexion)
--         users, candidate_profiles, companies, recruiter_profiles,
--         company_authorization_documents (NOUVEAU),
--         job_categories, skills, job_offers
--    2bis. Migration re-jouable de l'ancien schéma vers le nouveau
--    3. Offres, favoris, candidatures (visibles dans le prototype)
--    4. CV, analyse ATS, matching          (fonctionnalités futures)
--    5. Tests psychologiques               (fonctionnalités futures)
--    6. Vues (Home page)
--    7. Données de référence (catégories)
--
--  Conventions :
--    - Identifiants BIGINT AUTO_INCREMENT
--    - Énumérations stockées en VARCHAR + CHECK
--      (-> @Enumerated(EnumType.STRING) côté Java)
--    - created_at / updated_at gérés par MySQL
--    - Scores en DECIMAL(5,2), compris entre 0 et 100
--    - Mots de passe : hash BCrypt uniquement (jamais en clair)
--    - confirm_password n'existe JAMAIS en base (vérifié côté Backend)
--    - Fichiers uploadés : disque/stockage objet ; MySQL = métadonnées + chemin
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. BASE DE DONNÉES
-- ---------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS skillup
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE skillup;

-- ---------------------------------------------------------------------
-- (OPTIONNEL) Réinitialisation complète en développement.
-- Décommenter UNIQUEMENT sur une base locale : supprime toutes les données.
-- ---------------------------------------------------------------------
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP VIEW  IF EXISTS v_platform_stats, v_published_job_offers;
-- DROP TABLE IF EXISTS psychometric_results, psychometric_questions, psychometric_tests,
--                      job_matches, cv_analysis_skills, cv_analyses, cvs,
--                      applications, saved_jobs, candidate_skills, job_offer_skills,
--                      job_offers, skills, job_categories,
--                      company_authorization_documents,
--                      recruiter_profiles, companies, candidate_profiles, users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 2. NOYAU : COMPTES, PROFILS, ENTREPRISES, OFFRES
-- =====================================================================

-- ---------------------------------------------------------------------
-- users : comptes + authentification + rôle (un seul rôle par compte)
--   Données COMMUNES aux candidats et recruteurs (nom, email, mot de passe,
--   conditions). Les données métier sont dans les profils séparés.
--   L'email du recruteur ("Professional Email") est users.email.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id                 BIGINT       NOT NULL AUTO_INCREMENT,
    full_name          VARCHAR(200) NOT NULL COMMENT 'Full Name (formulaires Candidate et Recruiter)',
    email              VARCHAR(255) NOT NULL COMMENT 'Email / Professional Email - unique (insensible à la casse)',
    password_hash      VARCHAR(255) NOT NULL COMMENT 'Hash BCrypt (60 car.), jamais de texte clair',
    role               VARCHAR(20)  NOT NULL COMMENT 'CANDIDATE | RECRUITER | ADMIN',
    terms_accepted     BOOLEAN      NOT NULL DEFAULT 0 COMMENT 'Accept Terms and Conditions',
    terms_accepted_at  DATETIME     NULL     COMMENT 'Date/heure d''acceptation des conditions',
    is_active          BOOLEAN      NOT NULL DEFAULT 1 COMMENT '1 = actif, 0 = désactivé',
    last_login_at      DATETIME     NULL,
    created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('CANDIDATE', 'RECRUITER', 'ADMIN')),
    CONSTRAINT chk_users_terms CHECK (
            (terms_accepted = 0 AND terms_accepted_at IS NULL)
         OR (terms_accepted = 1 AND terms_accepted_at IS NOT NULL)),
    INDEX idx_users_role (role)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- candidate_profiles : profil du candidat (OneToOne avec users)
--   Rempli dès l'inscription : éducation, domaine, université, téléphone,
--   adresse (tous obligatoires). Le reste est complété plus tard.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id                  BIGINT       NOT NULL AUTO_INCREMENT,
    user_id             BIGINT       NOT NULL,
    education_level     VARCHAR(30)  NOT NULL COMMENT 'HIGH_SCHOOL | ASSOCIATE | BACHELOR | MASTER | ENGINEERING | DOCTORATE | OTHER',
    field_of_study      VARCHAR(150) NOT NULL COMMENT 'Field of Study / Education Domain',
    university          VARCHAR(200) NOT NULL,
    phone               VARCHAR(30)  NOT NULL,
    address             VARCHAR(255) NOT NULL,
    headline            VARCHAR(150) NULL COMMENT 'Ex : Frontend Developer',
    city                VARCHAR(100) NULL,
    country             VARCHAR(100) NULL,
    experience_level    VARCHAR(20)  NULL COMMENT 'JUNIOR | MID | SENIOR | LEAD',
    years_of_experience INT          NULL,
    summary             TEXT         NULL,
    linkedin_url        VARCHAR(255) NULL,
    avatar_url          VARCHAR(500) NULL,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_candidate_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_candidate_profiles_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT chk_candidate_education_level
        CHECK (education_level IN ('HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'ENGINEERING', 'DOCTORATE', 'OTHER')),
    CONSTRAINT chk_candidate_required_text
        CHECK (CHAR_LENGTH(TRIM(field_of_study)) > 0 AND CHAR_LENGTH(TRIM(university)) > 0
           AND CHAR_LENGTH(TRIM(phone)) > 0 AND CHAR_LENGTH(TRIM(address)) > 0),
    CONSTRAINT chk_candidate_experience_level
        CHECK (experience_level IS NULL OR experience_level IN ('JUNIOR', 'MID', 'SENIOR', 'LEAD')),
    CONSTRAINT chk_candidate_years CHECK (years_of_experience IS NULL OR years_of_experience >= 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- companies : entreprises (une entreprise a plusieurs recruteurs et offres)
--   address = "Company Address" ; website = "Company Website" (facultatif).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS companies (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    name          VARCHAR(150) NOT NULL,
    address       VARCHAR(255) NOT NULL COMMENT 'Company Address',
    website       VARCHAR(255) NULL     COMMENT 'Company Website (facultatif)',
    description   TEXT         NULL,
    industry      VARCHAR(100) NULL,
    logo_url      VARCHAR(500) NULL,
    city          VARCHAR(100) NULL,
    country       VARCHAR(100) NULL,
    company_size  VARCHAR(30)  NULL COMMENT 'Ex : 1-10, 11-50, 51-200, 201-500, 500+',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_companies_name UNIQUE (name),
    CONSTRAINT chk_companies_address CHECK (CHAR_LENGTH(TRIM(address)) > 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- recruiter_profiles : profil recruteur (OneToOne avec users,
--                      ManyToOne vers companies)
--   job_title = "Job Position" ; phone = "Phone Number" (obligatoires).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recruiter_profiles (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    user_id     BIGINT       NOT NULL,
    company_id  BIGINT       NOT NULL,
    job_title   VARCHAR(100) NOT NULL COMMENT 'Job Position. Ex : Head of Talent',
    phone       VARCHAR(30)  NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_recruiter_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_recruiter_profiles_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_recruiter_profiles_company
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE RESTRICT,
    CONSTRAINT chk_recruiter_required_text
        CHECK (CHAR_LENGTH(TRIM(job_title)) > 0 AND CHAR_LENGTH(TRIM(phone)) > 0),
    INDEX idx_recruiter_profiles_company (company_id)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- company_authorization_documents : document d'autorisation de l'entreprise
--   (NOUVEAU) Le fichier est stocké sur le serveur ; MySQL ne garde que
--   chemin, nom d'origine, type MIME, taille et date d'upload.
--   Rattaché au RECRUTEUR (ce document prouve qu'il peut agir pour
--   l'entreprise) ; l'entreprise s'obtient via recruiter_profiles.company_id.
--   Plusieurs lignes possibles par recruteur (re-soumission après refus) :
--   Spring prend la plus récente (ORDER BY uploaded_at DESC).
--   Le statut permet la validation par un administrateur.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_authorization_documents (
    id                   BIGINT       NOT NULL AUTO_INCREMENT,
    recruiter_profile_id BIGINT       NOT NULL,
    original_filename    VARCHAR(255) NOT NULL COMMENT 'Nom du fichier tel que envoyé par l''utilisateur',
    storage_path         VARCHAR(500) NOT NULL COMMENT 'Chemin RELATIF de stockage (nom généré, ex : authorizations/2026/11/uuid.pdf)',
    content_type         VARCHAR(100) NOT NULL COMMENT 'Type MIME (ex : application/pdf)',
    file_size_bytes      BIGINT       NOT NULL,
    uploaded_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date d''upload',
    status               VARCHAR(20)  NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING | APPROVED | REJECTED',
    reviewed_by_user_id  BIGINT       NULL     COMMENT 'Administrateur ayant validé / refusé',
    reviewed_at          DATETIME     NULL,
    rejection_reason     VARCHAR(500) NULL,
    created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_company_auth_docs_path UNIQUE (storage_path),
    CONSTRAINT fk_company_auth_docs_recruiter
        FOREIGN KEY (recruiter_profile_id) REFERENCES recruiter_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_company_auth_docs_reviewer
        FOREIGN KEY (reviewed_by_user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT chk_company_auth_docs_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT chk_company_auth_docs_size CHECK (file_size_bytes > 0),
    CONSTRAINT chk_company_auth_docs_names
        CHECK (CHAR_LENGTH(TRIM(original_filename)) > 0 AND CHAR_LENGTH(TRIM(storage_path)) > 0
           AND CHAR_LENGTH(TRIM(content_type)) > 0),
    INDEX idx_company_auth_docs_recruiter (recruiter_profile_id, uploaded_at),
    INDEX idx_company_auth_docs_status (status),
    INDEX idx_company_auth_docs_reviewer (reviewed_by_user_id)
) ENGINE = InnoDB;

-- =====================================================================
-- 2bis. MIGRATION RE-JOUABLE  (ancien schéma  ->  nouveau schéma)
--   - Sur une base NEUVE : toutes les étapes sont ignorées (rien à faire).
--   - Sur une base issue de l'ancien schema.sql : ajoute les colonnes,
--     reprend les données existantes, puis pose les contraintes.
--   - Peut être relancé autant de fois que nécessaire.
--   Technique : information_schema + PREPARE (MySQL n'a pas
--   "ADD COLUMN IF NOT EXISTS"). Aucun DELIMITER requis.
-- =====================================================================

-- ---- users : first_name + last_name  ->  full_name -------------------

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN full_name VARCHAR(200) NULL', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'full_name') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) > 0, 'UPDATE users SET full_name = TRIM(CONCAT(first_name, '' '', last_name)) WHERE id > 0 AND full_name IS NULL', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'first_name') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE users MODIFY full_name VARCHAR(200) NOT NULL;

SET @sql = (SELECT IF(COUNT(*) > 0, 'ALTER TABLE users DROP COLUMN first_name', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'first_name') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) > 0, 'ALTER TABLE users DROP COLUMN last_name', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'last_name') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN terms_accepted BOOLEAN NOT NULL DEFAULT 0', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'terms_accepted') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN terms_accepted_at DATETIME NULL', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'terms_accepted_at') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD CONSTRAINT chk_users_terms CHECK ((terms_accepted = 0 AND terms_accepted_at IS NULL) OR (terms_accepted = 1 AND terms_accepted_at IS NOT NULL))', 'DO 0') FROM (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND CONSTRAINT_NAME = 'chk_users_terms') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;


-- ---- candidate_profiles : nouveaux champs obligatoires ---------------

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE candidate_profiles ADD COLUMN education_level VARCHAR(30) NULL', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate_profiles' AND COLUMN_NAME = 'education_level') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE candidate_profiles ADD COLUMN field_of_study VARCHAR(150) NULL', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate_profiles' AND COLUMN_NAME = 'field_of_study') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE candidate_profiles ADD COLUMN university VARCHAR(200) NULL', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate_profiles' AND COLUMN_NAME = 'university') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE candidate_profiles ADD COLUMN address VARCHAR(255) NULL', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate_profiles' AND COLUMN_NAME = 'address') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Reprise des profils existants : valeur de repli là où l'info manque
UPDATE candidate_profiles SET education_level = 'OTHER'         WHERE id > 0 AND education_level IS NULL;
UPDATE candidate_profiles SET field_of_study  = 'Non renseigné' WHERE id > 0 AND (field_of_study IS NULL OR TRIM(field_of_study) = '');
UPDATE candidate_profiles SET university      = 'Non renseigné' WHERE id > 0 AND (university IS NULL OR TRIM(university) = '');
UPDATE candidate_profiles SET phone           = 'Non renseigné' WHERE id > 0 AND (phone IS NULL OR TRIM(phone) = '');
UPDATE candidate_profiles SET address         = TRIM(CONCAT_WS(', ', NULLIF(city, ''), NULLIF(country, '')))
                                                WHERE id > 0 AND (address IS NULL OR TRIM(address) = '');
UPDATE candidate_profiles SET address         = 'Non renseigné' WHERE id > 0 AND (address IS NULL OR TRIM(address) = '');
ALTER TABLE candidate_profiles
    MODIFY education_level VARCHAR(30)  NOT NULL,
    MODIFY field_of_study  VARCHAR(150) NOT NULL,
    MODIFY university      VARCHAR(200) NOT NULL,
    MODIFY phone           VARCHAR(30)  NOT NULL,
    MODIFY address         VARCHAR(255) NOT NULL;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE candidate_profiles ADD CONSTRAINT chk_candidate_education_level CHECK (education_level IN (''HIGH_SCHOOL'', ''ASSOCIATE'', ''BACHELOR'', ''MASTER'', ''ENGINEERING'', ''DOCTORATE'', ''OTHER''))', 'DO 0') FROM (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate_profiles' AND CONSTRAINT_NAME = 'chk_candidate_education_level') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE candidate_profiles ADD CONSTRAINT chk_candidate_required_text CHECK (CHAR_LENGTH(TRIM(field_of_study)) > 0 AND CHAR_LENGTH(TRIM(university)) > 0 AND CHAR_LENGTH(TRIM(phone)) > 0 AND CHAR_LENGTH(TRIM(address)) > 0)', 'DO 0') FROM (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'candidate_profiles' AND CONSTRAINT_NAME = 'chk_candidate_required_text') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;


-- ---- companies : adresse obligatoire ---------------------------------

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE companies ADD COLUMN address VARCHAR(255) NULL', 'DO 0') FROM (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'companies' AND COLUMN_NAME = 'address') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE companies SET address = TRIM(CONCAT_WS(', ', NULLIF(city, ''), NULLIF(country, '')))
                     WHERE id > 0 AND (address IS NULL OR TRIM(address) = '');
UPDATE companies SET address = 'Non renseignée' WHERE id > 0 AND (address IS NULL OR TRIM(address) = '');
ALTER TABLE companies MODIFY address VARCHAR(255) NOT NULL;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE companies ADD CONSTRAINT chk_companies_address CHECK (CHAR_LENGTH(TRIM(address)) > 0)', 'DO 0') FROM (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'companies' AND CONSTRAINT_NAME = 'chk_companies_address') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;


-- ---- recruiter_profiles : poste et téléphone obligatoires -------------

UPDATE recruiter_profiles SET job_title = 'Non renseigné' WHERE id > 0 AND (job_title IS NULL OR TRIM(job_title) = '');
UPDATE recruiter_profiles SET phone     = 'Non renseigné' WHERE id > 0 AND (phone IS NULL OR TRIM(phone) = '');
ALTER TABLE recruiter_profiles
    MODIFY job_title VARCHAR(100) NOT NULL,
    MODIFY phone     VARCHAR(30)  NOT NULL;

SET @sql = (SELECT IF(COUNT(*) = 0, 'ALTER TABLE recruiter_profiles ADD CONSTRAINT chk_recruiter_required_text CHECK (CHAR_LENGTH(TRIM(job_title)) > 0 AND CHAR_LENGTH(TRIM(phone)) > 0)', 'DO 0') FROM (SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'recruiter_profiles' AND CONSTRAINT_NAME = 'chk_recruiter_required_text') AS t);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;


-- ---------------------------------------------------------------------
-- job_categories : filtre "Category" de la page Find Jobs
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_categories (
    id    BIGINT       NOT NULL AUTO_INCREMENT,
    name  VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_job_categories_name UNIQUE (name)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- skills : référentiel unique de compétences
--          (utilisé par les offres, les candidats et l'ATS)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_skills_name UNIQUE (name)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- job_offers : offres d'emploi
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_offers (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    posted_by_id          BIGINT        NULL COMMENT 'recruiter_profiles.id (NULL si le recruteur est supprimé)',
    category_id           BIGINT        NULL,
    title                 VARCHAR(200)  NOT NULL,
    description           TEXT          NOT NULL,
    location              VARCHAR(100)  NULL COMMENT 'Ville (Tunis, Paris...) ou NULL si 100 % remote',
    is_remote             BOOLEAN       NOT NULL DEFAULT 0,
    contract_type         VARCHAR(20)   NOT NULL COMMENT 'FULL_TIME | PART_TIME | CONTRACT | INTERNSHIP',
    experience_level      VARCHAR(20)   NULL     COMMENT 'JUNIOR | MID | SENIOR | LEAD',
    salary_min            DECIMAL(12,2) NULL,
    salary_max            DECIMAL(12,2) NULL,
    salary_currency       CHAR(3)       NULL     COMMENT 'USD, EUR, TND...',
    salary_period         VARCHAR(10)   NULL     COMMENT 'MONTH | YEAR',
    status                VARCHAR(20)   NOT NULL DEFAULT 'DRAFT' COMMENT 'DRAFT | PUBLISHED | CLOSED | ARCHIVED',
    published_at          DATETIME      NULL,
    application_deadline  DATE          NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_job_offers_company
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE RESTRICT,
    CONSTRAINT fk_job_offers_posted_by
        FOREIGN KEY (posted_by_id) REFERENCES recruiter_profiles (id) ON DELETE SET NULL,
    CONSTRAINT fk_job_offers_category
        FOREIGN KEY (category_id) REFERENCES job_categories (id) ON DELETE SET NULL,
    CONSTRAINT chk_job_offers_contract
        CHECK (contract_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP')),
    CONSTRAINT chk_job_offers_experience
        CHECK (experience_level IS NULL OR experience_level IN ('JUNIOR', 'MID', 'SENIOR', 'LEAD')),
    CONSTRAINT chk_job_offers_status
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED')),
    CONSTRAINT chk_job_offers_salary_period
        CHECK (salary_period IS NULL OR salary_period IN ('MONTH', 'YEAR')),
    CONSTRAINT chk_job_offers_salary_range
        CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_max >= salary_min),
    INDEX idx_job_offers_status_published (status, published_at),
    INDEX idx_job_offers_company (company_id),
    INDEX idx_job_offers_category (category_id),
    INDEX idx_job_offers_posted_by (posted_by_id),
    INDEX idx_job_offers_location (location),
    INDEX idx_job_offers_contract (contract_type),
    INDEX idx_job_offers_experience (experience_level),
    FULLTEXT INDEX ftx_job_offers_search (title, description)
) ENGINE = InnoDB;

-- =====================================================================
-- 3. TABLES DE LIAISON, FAVORIS, CANDIDATURES
-- =====================================================================

-- ManyToMany : job_offers <-> skills  ("Required skills")
CREATE TABLE IF NOT EXISTS job_offer_skills (
    job_offer_id  BIGINT NOT NULL,
    skill_id      BIGINT NOT NULL,
    PRIMARY KEY (job_offer_id, skill_id),
    CONSTRAINT fk_job_offer_skills_job
        FOREIGN KEY (job_offer_id) REFERENCES job_offers (id) ON DELETE CASCADE,
    CONSTRAINT fk_job_offer_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    INDEX idx_job_offer_skills_skill (skill_id)
) ENGINE = InnoDB;

-- ManyToMany : candidate_profiles <-> skills  (compétences du profil)
CREATE TABLE IF NOT EXISTS candidate_skills (
    candidate_profile_id  BIGINT   NOT NULL,
    skill_id              BIGINT   NOT NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (candidate_profile_id, skill_id),
    CONSTRAINT fk_candidate_skills_candidate
        FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_candidate_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    INDEX idx_candidate_skills_skill (skill_id)
) ENGINE = InnoDB;

-- ManyToMany : candidate_profiles <-> job_offers  (bouton "Save")
CREATE TABLE IF NOT EXISTS saved_jobs (
    candidate_profile_id  BIGINT   NOT NULL,
    job_offer_id          BIGINT   NOT NULL,
    saved_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (candidate_profile_id, job_offer_id),
    CONSTRAINT fk_saved_jobs_candidate
        FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_jobs_job
        FOREIGN KEY (job_offer_id) REFERENCES job_offers (id) ON DELETE CASCADE,
    INDEX idx_saved_jobs_job (job_offer_id)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- cvs : fichiers CV (le fichier est stocké sur disque / stockage objet,
--       seule la référence est en base)
--       Déclaré avant applications car celle-ci référence le CV utilisé.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cvs (
    id                    BIGINT       NOT NULL AUTO_INCREMENT,
    candidate_profile_id  BIGINT       NOT NULL,
    original_filename     VARCHAR(255) NOT NULL,
    storage_path          VARCHAR(500) NOT NULL,
    content_type          VARCHAR(100) NULL,
    file_size_bytes       BIGINT       NULL,
    is_primary            BOOLEAN      NOT NULL DEFAULT 0,
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_cvs_candidate
        FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    CONSTRAINT chk_cvs_size CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
    INDEX idx_cvs_candidate (candidate_profile_id)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- applications : candidatures (statuts = étapes du pipeline recruteur)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    id                    BIGINT       NOT NULL AUTO_INCREMENT,
    job_offer_id          BIGINT       NOT NULL,
    candidate_profile_id  BIGINT       NOT NULL,
    cv_id                 BIGINT       NULL COMMENT 'CV utilisé pour postuler',
    cover_letter          TEXT         NULL,
    status                VARCHAR(20)  NOT NULL DEFAULT 'APPLIED'
                          COMMENT 'APPLIED | IN_REVIEW | SHORTLISTED | INTERVIEW | OFFERED | HIRED | REJECTED | WITHDRAWN',
    match_score           DECIMAL(5,2) NULL COMMENT 'Score de matching au moment de la candidature',
    recruiter_notes       TEXT         NULL,
    applied_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_applications_job_candidate UNIQUE (job_offer_id, candidate_profile_id),
    CONSTRAINT fk_applications_job
        FOREIGN KEY (job_offer_id) REFERENCES job_offers (id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_candidate
        FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_cv
        FOREIGN KEY (cv_id) REFERENCES cvs (id) ON DELETE SET NULL,
    CONSTRAINT chk_applications_status
        CHECK (status IN ('APPLIED', 'IN_REVIEW', 'SHORTLISTED', 'INTERVIEW',
                          'OFFERED', 'HIRED', 'REJECTED', 'WITHDRAWN')),
    CONSTRAINT chk_applications_score
        CHECK (match_score IS NULL OR match_score BETWEEN 0 AND 100),
    INDEX idx_applications_candidate (candidate_profile_id),
    INDEX idx_applications_cv (cv_id),
    INDEX idx_applications_job_status (job_offer_id, status)
) ENGINE = InnoDB;

-- =====================================================================
-- 4. CV, ANALYSE ATS, MATCHING  (fonctionnalités futures)
-- =====================================================================

-- ---------------------------------------------------------------------
-- cv_analyses : résultat d'une analyse ATS d'un CV
--   (un CV peut être ré-analysé -> OneToMany).
--   Les 4 sous-scores correspondent à l'écran du prototype :
--   Keywords / Experience / Formatting / Skills.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cv_analyses (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    cv_id             BIGINT       NOT NULL,
    status            VARCHAR(20)  NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING | COMPLETED | FAILED',
    ats_score         DECIMAL(5,2) NULL,
    keywords_score    DECIMAL(5,2) NULL,
    experience_score  DECIMAL(5,2) NULL,
    formatting_score  DECIMAL(5,2) NULL,
    skills_score      DECIMAL(5,2) NULL,
    extracted_text    MEDIUMTEXT   NULL COMMENT 'Texte brut extrait du CV',
    summary           TEXT         NULL COMMENT 'Résumé IA',
    recommendations   TEXT         NULL COMMENT 'Conseils d''amélioration / compétences à ajouter',
    error_message     VARCHAR(500) NULL,
    analyzed_at       DATETIME     NULL,
    created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_cv_analyses_cv
        FOREIGN KEY (cv_id) REFERENCES cvs (id) ON DELETE CASCADE,
    CONSTRAINT chk_cv_analyses_status CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    CONSTRAINT chk_cv_analyses_scores CHECK (
            (ats_score        IS NULL OR ats_score        BETWEEN 0 AND 100)
        AND (keywords_score   IS NULL OR keywords_score   BETWEEN 0 AND 100)
        AND (experience_score IS NULL OR experience_score BETWEEN 0 AND 100)
        AND (formatting_score IS NULL OR formatting_score BETWEEN 0 AND 100)
        AND (skills_score     IS NULL OR skills_score     BETWEEN 0 AND 100)),
    INDEX idx_cv_analyses_cv (cv_id),
    INDEX idx_cv_analyses_status (status)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- cv_analysis_skills : compétences détectées par l'ATS dans un CV
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cv_analysis_skills (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    cv_analysis_id    BIGINT       NOT NULL,
    skill_id          BIGINT       NOT NULL,
    confidence_score  DECIMAL(5,2) NULL COMMENT 'Confiance de la détection (0-100)',
    PRIMARY KEY (id),
    CONSTRAINT uq_cv_analysis_skills UNIQUE (cv_analysis_id, skill_id),
    CONSTRAINT fk_cv_analysis_skills_analysis
        FOREIGN KEY (cv_analysis_id) REFERENCES cv_analyses (id) ON DELETE CASCADE,
    CONSTRAINT fk_cv_analysis_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT chk_cv_analysis_skills_conf
        CHECK (confidence_score IS NULL OR confidence_score BETWEEN 0 AND 100),
    INDEX idx_cv_analysis_skills_skill (skill_id)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- job_matches : score de compatibilité candidat <-> offre
--   (alimente "offres recommandées" et le classement des candidats)
--   Une ligne par couple (candidat, offre), recalculée si besoin.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_matches (
    id                    BIGINT       NOT NULL AUTO_INCREMENT,
    candidate_profile_id  BIGINT       NOT NULL,
    job_offer_id          BIGINT       NOT NULL,
    cv_analysis_id        BIGINT       NULL COMMENT 'Analyse utilisée pour le calcul',
    match_score           DECIMAL(5,2) NOT NULL,
    matched_skills_count  INT          NOT NULL DEFAULT 0,
    missing_skills_count  INT          NOT NULL DEFAULT 0,
    summary               TEXT         NULL,
    calculated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_job_matches_candidate_job UNIQUE (candidate_profile_id, job_offer_id),
    CONSTRAINT fk_job_matches_candidate
        FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_job_matches_job
        FOREIGN KEY (job_offer_id) REFERENCES job_offers (id) ON DELETE CASCADE,
    CONSTRAINT fk_job_matches_analysis
        FOREIGN KEY (cv_analysis_id) REFERENCES cv_analyses (id) ON DELETE SET NULL,
    CONSTRAINT chk_job_matches_score CHECK (match_score BETWEEN 0 AND 100),
    INDEX idx_job_matches_candidate_score (candidate_profile_id, match_score),
    INDEX idx_job_matches_job_score (job_offer_id, match_score),
    INDEX idx_job_matches_analysis (cv_analysis_id)
) ENGINE = InnoDB;

-- =====================================================================
-- 5. TESTS PSYCHOLOGIQUES  (fonctionnalité future)
-- =====================================================================

CREATE TABLE IF NOT EXISTS psychometric_tests (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    title        VARCHAR(150) NOT NULL,
    description  TEXT         NULL,
    is_active    BOOLEAN      NOT NULL DEFAULT 1,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS psychometric_questions (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    test_id        BIGINT       NOT NULL,
    question_text  VARCHAR(500) NOT NULL,
    dimension      VARCHAR(50)  NULL COMMENT 'Trait mesuré (ex : OPENNESS, TEAMWORK)',
    display_order  INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_psy_questions_test
        FOREIGN KEY (test_id) REFERENCES psychometric_tests (id) ON DELETE CASCADE,
    INDEX idx_psy_questions_test_order (test_id, display_order)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS psychometric_results (
    id                    BIGINT       NOT NULL AUTO_INCREMENT,
    candidate_profile_id  BIGINT       NOT NULL,
    test_id               BIGINT       NOT NULL,
    overall_score         DECIMAL(5,2) NULL,
    profile_type          VARCHAR(100) NULL COMMENT 'Profil obtenu (ex : Leader, Analytique)',
    dimension_scores      JSON         NULL COMMENT 'Ex : {"OPENNESS": 72.5, "TEAMWORK": 80}',
    answers               JSON         NULL COMMENT 'Réponses brutes {question_id: valeur}',
    summary               TEXT         NULL,
    completed_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_psy_results_candidate
        FOREIGN KEY (candidate_profile_id) REFERENCES candidate_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_psy_results_test
        FOREIGN KEY (test_id) REFERENCES psychometric_tests (id) ON DELETE CASCADE,
    CONSTRAINT chk_psy_results_score CHECK (overall_score IS NULL OR overall_score BETWEEN 0 AND 100),
    INDEX idx_psy_results_candidate (candidate_profile_id),
    INDEX idx_psy_results_test (test_id)
) ENGINE = InnoDB;

-- =====================================================================
-- 6. VUES (lecture seule, pour la Home page)
-- =====================================================================

-- Offres publiées avec entreprise, catégorie et nombre de candidats
-- ("Featured jobs" : "Nova Labs · 2 days ago ... 48 applicants")
CREATE OR REPLACE VIEW v_published_job_offers AS
SELECT
    j.id                    AS job_offer_id,
    j.title,
    j.location,
    j.is_remote,
    j.contract_type,
    j.experience_level,
    j.salary_min,
    j.salary_max,
    j.salary_currency,
    j.salary_period,
    j.published_at,
    j.application_deadline,
    c.id                    AS company_id,
    c.name                  AS company_name,
    c.logo_url              AS company_logo_url,
    cat.name                AS category_name,
    (SELECT COUNT(*) FROM applications a WHERE a.job_offer_id = j.id) AS applicants_count
FROM job_offers j
JOIN companies c            ON c.id = j.company_id
LEFT JOIN job_categories cat ON cat.id = j.category_id
WHERE j.status = 'PUBLISHED';

-- Statistiques globales (1 seule ligne)
CREATE OR REPLACE VIEW v_platform_stats AS
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'CANDIDATE' AND is_active = 1) AS total_candidates,
    (SELECT COUNT(*) FROM users WHERE role = 'RECRUITER' AND is_active = 1) AS total_recruiters,
    (SELECT COUNT(*) FROM companies)                                        AS total_companies,
    (SELECT COUNT(*) FROM job_offers WHERE status = 'PUBLISHED')            AS total_published_jobs,
    (SELECT COUNT(*) FROM applications)                                     AS total_applications,
    (SELECT COUNT(*) FROM job_matches)                                      AS total_matches;

-- =====================================================================
-- 7. DONNÉES DE RÉFÉRENCE (filtre "Category" du prototype)
-- =====================================================================
INSERT IGNORE INTO job_categories (name) VALUES
    ('Engineering'),
    ('Design'),
    ('Data & AI'),
    ('Marketing'),
    ('Product'),
    ('Finance');

-- Fin du script
