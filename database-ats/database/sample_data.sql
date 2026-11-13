-- =====================================================================
--  SkillUp — Données de test FACULTATIVES (à exécuter après schema.sql)
--  Reprend les entreprises, offres et compétences du prototype Lovable,
--  et ajoute 2 comptes DE DÉMO (1 candidat, 1 recruteur) qui illustrent les
--  nouveaux champs d'inscription (section 5, supprimable sans impact).
--  Les offres ont posted_by_id = NULL (aucun recruteur factice).
--  Script rejouable : les doublons sont ignorés / évités.
--  Compatible avec schema.sql version 2 (companies.address obligatoire).
-- =====================================================================
USE skillup;

-- ---------------------------------------------------------------------
-- Compétences
-- ---------------------------------------------------------------------
INSERT IGNORE INTO skills (name) VALUES
    ('React'), ('TypeScript'), ('Tailwind CSS'), ('Testing'), ('Accessibility'),
    ('Figma'), ('Prototyping'), ('User Research'),
    ('Python'), ('PyTorch'), ('NLP'),
    ('Node.js'), ('PostgreSQL'),
    ('SEO'), ('Analytics'), ('Lifecycle Marketing'),
    ('SQL'), ('Power BI'), ('Excel'),
    ('Product Strategy'), ('LLMs'), ('Roadmapping'),
    ('Java'), ('Spring Boot'), ('MySQL'), ('Docker'), ('Git'), ('JavaScript');

-- ---------------------------------------------------------------------
-- Entreprises
-- ---------------------------------------------------------------------
INSERT IGNORE INTO companies (name, address, description, industry, city, country, company_size) VALUES
    ('Nova Labs',      '12 Innovation Street, Remote-first',        'Éditeur de logiciels SaaS orienté produit.',         'Software',   NULL,         NULL,      '51-200'),
    ('Kora Health',    '25 Marina Road, Victoria Island, Lagos',    'Solutions numériques pour la santé.',                'HealthTech', 'Lagos',      'Nigeria', '11-50'),
    ('Atlas AI',       '8 Rue de la Paix, 75002 Paris',             'Startup spécialisée en intelligence artificielle.',  'AI',         'Paris',      'France',  '11-50'),
    ('Sahel Pay',      '45 Boulevard Zerktouni, Casablanca',        'Solutions de paiement mobile.',                      'FinTech',    'Casablanca', 'Maroc',   '51-200'),
    ('Bloom Commerce', '3 Kenyatta Avenue, Nairobi',                'Plateforme e-commerce.',                             'E-commerce', 'Nairobi',    'Kenya',   '11-50'),
    ('Medina Bank',    '10 Avenue Habib Bourguiba, 1000 Tunis',     'Banque de détail.',                                  'Banking',    'Tunis',      'Tunisie', '500+');

-- ---------------------------------------------------------------------
-- Offres (publiées à des dates relatives à aujourd'hui)
-- ---------------------------------------------------------------------
INSERT INTO job_offers
    (company_id, category_id, title, description, location, is_remote, contract_type,
     experience_level, salary_min, salary_max, salary_currency, salary_period,
     status, published_at, application_deadline)
SELECT c.id, cat.id, v.title, v.description, v.location, v.is_remote, v.contract_type,
       v.experience_level, v.salary_min, v.salary_max, v.salary_currency, v.salary_period,
       'PUBLISHED', NOW() - INTERVAL v.days_ago DAY, v.deadline
FROM (
    SELECT 'Nova Labs' AS company, 'Engineering' AS category,
           'Senior Frontend Developer' AS title,
           'Lead the development of our design system and customer-facing dashboards.' AS description,
           NULL AS location, 1 AS is_remote, 'FULL_TIME' AS contract_type, 'SENIOR' AS experience_level,
           70000 AS salary_min, 95000 AS salary_max, 'USD' AS salary_currency, 'YEAR' AS salary_period,
           2 AS days_ago, DATE '2026-12-15' AS deadline
    UNION ALL
    SELECT 'Kora Health', 'Design', 'Product Designer (UI/UX)',
           'Design intuitive health experiences for patients and clinicians.',
           'Lagos', 0, 'FULL_TIME', 'MID', 45000, 60000, 'USD', 'YEAR', 1, DATE '2026-12-20'
    UNION ALL
    SELECT 'Atlas AI', 'Data & AI', 'Machine Learning Engineer',
           'Build and deploy NLP models in production.',
           'Paris', 0, 'FULL_TIME', 'MID', 75000, 90000, 'EUR', 'YEAR', 4, DATE '2026-12-31'
    UNION ALL
    SELECT 'Sahel Pay', 'Engineering', 'Full Stack Developer',
           'Develop and maintain payment features across web and API.',
           'Casablanca', 0, 'CONTRACT', 'MID', 4000, 4000, 'USD', 'MONTH', 6, DATE '2026-12-10'
    UNION ALL
    SELECT 'Bloom Commerce', 'Marketing', 'Growth Marketing Manager',
           'Own acquisition and retention across digital channels.',
           'Nairobi', 0, 'FULL_TIME', 'MID', NULL, NULL, NULL, NULL, 7, DATE '2026-12-25'
    UNION ALL
    SELECT 'Medina Bank', 'Data & AI', 'Junior Data Analyst',
           'Internship: build dashboards and reports for business teams.',
           'Tunis', 0, 'INTERNSHIP', 'JUNIOR', 1200, 1200, 'TND', 'MONTH', 3, DATE '2026-12-05'
    UNION ALL
    SELECT 'Nova Labs', 'Product', 'Product Manager, AI',
           'Define the roadmap for our AI-powered product line.',
           NULL, 1, 'FULL_TIME', 'SENIOR', 100000, 130000, 'USD', 'YEAR', 5, DATE '2026-12-31'
) AS v
JOIN companies c       ON c.name = v.company
JOIN job_categories cat ON cat.name = v.category
WHERE NOT EXISTS (
    SELECT 1 FROM job_offers j WHERE j.company_id = c.id AND j.title = v.title
);

-- ---------------------------------------------------------------------
-- Compétences requises par offre
-- ---------------------------------------------------------------------
INSERT IGNORE INTO job_offer_skills (job_offer_id, skill_id)
SELECT j.id, s.id
FROM (
    SELECT 'Senior Frontend Developer' AS title, 'React' AS skill
    UNION ALL SELECT 'Senior Frontend Developer', 'TypeScript'
    UNION ALL SELECT 'Senior Frontend Developer', 'Tailwind CSS'
    UNION ALL SELECT 'Senior Frontend Developer', 'Testing'
    UNION ALL SELECT 'Senior Frontend Developer', 'Accessibility'
    UNION ALL SELECT 'Product Designer (UI/UX)', 'Figma'
    UNION ALL SELECT 'Product Designer (UI/UX)', 'Prototyping'
    UNION ALL SELECT 'Product Designer (UI/UX)', 'User Research'
    UNION ALL SELECT 'Machine Learning Engineer', 'Python'
    UNION ALL SELECT 'Machine Learning Engineer', 'PyTorch'
    UNION ALL SELECT 'Machine Learning Engineer', 'NLP'
    UNION ALL SELECT 'Full Stack Developer', 'React'
    UNION ALL SELECT 'Full Stack Developer', 'Node.js'
    UNION ALL SELECT 'Full Stack Developer', 'PostgreSQL'
    UNION ALL SELECT 'Growth Marketing Manager', 'SEO'
    UNION ALL SELECT 'Growth Marketing Manager', 'Analytics'
    UNION ALL SELECT 'Growth Marketing Manager', 'Lifecycle Marketing'
    UNION ALL SELECT 'Junior Data Analyst', 'SQL'
    UNION ALL SELECT 'Junior Data Analyst', 'Power BI'
    UNION ALL SELECT 'Junior Data Analyst', 'Excel'
    UNION ALL SELECT 'Product Manager, AI', 'Product Strategy'
    UNION ALL SELECT 'Product Manager, AI', 'LLMs'
    UNION ALL SELECT 'Product Manager, AI', 'Roadmapping'
) AS x
JOIN job_offers j ON j.title = x.title
JOIN skills s     ON s.name  = x.skill;

-- =====================================================================
-- 5. COMPTES DE DÉMO (facultatif)
--    Mot de passe des deux comptes : Demo@12345   (hash BCrypt ci-dessous)
--    NE PAS UTILISER EN PRODUCTION.
-- =====================================================================

-- Utilisateurs (email unique -> INSERT IGNORE = rejouable)
INSERT IGNORE INTO users
    (full_name, email, password_hash, role, terms_accepted, terms_accepted_at, is_active)
VALUES
    ('Demo Candidate', 'candidate.demo@skillup.test',
     '$2b$10$CBaUVA752zYrPrMb/zUHeeH2ZSgooxPhzvj9r.I4DpcAqFSoteWwW', 'CANDIDATE', 1, NOW(), 1),
    ('Demo Recruiter', 'recruiter.demo@novalabs.test',
     '$2b$10$CBaUVA752zYrPrMb/zUHeeH2ZSgooxPhzvj9r.I4DpcAqFSoteWwW', 'RECRUITER', 1, NOW(), 1);

-- Profil candidat (user_id unique -> rejouable)
INSERT IGNORE INTO candidate_profiles
    (user_id, education_level, field_of_study, university, phone, address, city, country)
SELECT u.id, 'ENGINEERING', 'Computer Science', 'Université de Tunis El Manar',
       '+216 20 000 000', '15 Rue de la Liberté, 1002 Tunis', 'Tunis', 'Tunisie'
FROM users u WHERE u.email = 'candidate.demo@skillup.test';

-- Profil recruteur rattaché à l'entreprise Nova Labs
INSERT IGNORE INTO recruiter_profiles (user_id, company_id, job_title, phone)
SELECT u.id, c.id, 'Head of Talent', '+33 6 00 00 00 00'
FROM users u JOIN companies c ON c.name = 'Nova Labs'
WHERE u.email = 'recruiter.demo@novalabs.test';

-- Document d'autorisation : métadonnées uniquement (le fichier n'existe pas
-- réellement sur le disque dans ce jeu de test)
INSERT INTO company_authorization_documents
    (recruiter_profile_id, original_filename, storage_path, content_type, file_size_bytes, status)
SELECT rp.id, 'autorisation_nova_labs.pdf',
       'authorizations/2026/11/3f1c2a9e-demo-authorization.pdf', 'application/pdf', 184320, 'PENDING'
FROM recruiter_profiles rp JOIN users u ON u.id = rp.user_id
WHERE u.email = 'recruiter.demo@novalabs.test'
  AND NOT EXISTS (SELECT 1 FROM company_authorization_documents d
                  WHERE d.storage_path = 'authorizations/2026/11/3f1c2a9e-demo-authorization.pdf');

-- Compétences du candidat démo
INSERT IGNORE INTO candidate_skills (candidate_profile_id, skill_id)
SELECT cp.id, s.id
FROM candidate_profiles cp
JOIN users u  ON u.id = cp.user_id AND u.email = 'candidate.demo@skillup.test'
JOIN skills s ON s.name IN ('Java', 'Spring Boot', 'MySQL', 'Git');

-- Fin du script
