-- VBS De Frères Database Schema

-- Page Content Table
CREATE TABLE IF NOT EXISTS page_content (
    id SERIAL PRIMARY KEY,
    page_slug VARCHAR(100) NOT NULL,
    content_key VARCHAR(100) NOT NULL,
    content_value TEXT,
    content_type VARCHAR(50) DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page_slug, content_key)
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    parent_first_name VARCHAR(100) NOT NULL,
    parent_last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    child_first_name VARCHAR(100) NOT NULL,
    child_last_name VARCHAR(100) NOT NULL,
    child_birthdate DATE NOT NULL,
    start_year VARCHAR(20) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media Library Table
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    public_id VARCHAR(255),
    width INTEGER,
    height INTEGER,
    format VARCHAR(50),
    size_bytes INTEGER,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- HOME PAGE
-- =============================================
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('home', 'hero-title', 'Basisschool De Frères Brugge', 'text'),
('home', 'hero-text', 'Een warme school waar elk kind centraal staat. Samen ontdekken, leren en groeien met een glimlach.', 'text'),
('home', 'hero-bg', '', 'image'),
('home', 'form-title', 'Info en Inschrijven', 'text'),
('home', 'form-subtitle', 'Kom langs voor een warme rondleiding', 'text'),
('home', 'visie-img', '', 'image'),
('home', 'visie-title', 'Waar wij voor staan', 'text'),
('home', 'visie-text', 'Een school met een duidelijk leerklimaat en doelen. We streven naar kwaliteit, aandacht voor individuele noden, en een sterke kennisbasis. Met kleine klassen en een holistische aanpak ontwikkelen we hoofd, hart en handen van elk kind.', 'text'),
('home', 'gallery-1', '', 'image'),
('home', 'gallery-2', '', 'image'),
('home', 'gallery-3', '', 'image'),
('home', 'gallery-4', '', 'image'),
('home', 'gallery-5', '', 'image'),
('home', 'gallery-6', '', 'image'),
('home', 'gallery-7', '', 'image'),
('home', 'gallery-8', '', 'image'),
('home', 'gallery-9', '', 'image'),
('home', 'gallery-10', '', 'image'),
('home', 'cta-title', 'Klaar om deel uit te maken van onze school?', 'text'),
('home', 'cta-text', 'Schrijf je kind in of kom langs voor een rondleiding.', 'text'),
('home', 'contact-director-name', 'Inge Versavel', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;

-- =============================================
-- CONTACT PAGE
-- =============================================
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('contact', 'hero-title', 'Laat ons kennismaken', 'text'),
('contact', 'hero-subtitle', 'Teken hoe graag jij onze school wil bezoeken', 'text'),
('contact', 'email', 'info@vbsdefreres.be', 'text'),
('contact', 'director-photo', '', 'image'),
('contact', 'director-name', 'Inge Versavel', 'text'),
('contact', 'form-title', 'Contactformulier', 'text'),
('contact', 'form-subtitle', 'Vul onderstaand formulier in en we nemen zo snel mogelijk contact met je op', 'text'),
('contact', 'hours-title', 'Bereikbaarheid', 'text'),
('contact', 'school-hours', 'Maandag - Vrijdag: 8:30 - 15:30', 'text'),
('contact', 'office-hours', 'Maandag - Vrijdag: 8:00 - 16:00', 'text'),
('contact', 'care-hours', 'Maandag - Vrijdag: 7:00 - 18:00', 'text'),
('contact', 'location-title', 'Vind ons hier', 'text'),
('contact', 'map-embed', '', 'text'),
('contact', 'cta-title', 'Kom langs voor een bezoek!', 'text'),
('contact', 'cta-text', 'Ontdek onze school en ontmoet ons team tijdens een rondleiding.', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;

-- =============================================
-- VISIE PAGE
-- =============================================
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('visie', 'hero-title', 'Samen bouwen aan een sterke toekomst', 'text'),
('visie', 'hero-text', 'Bij VBS De Frères geloven we in onderwijs dat verder gaat dan kennis alleen. We vormen kinderen tot zelfstandige, creatieve en sociale mensen.', 'text'),
('visie', 'hero-bg', '', 'image'),
('visie', 'mission-title', 'Elk kind verdient de kans om te groeien en te bloeien', 'text'),
('visie', 'mission-text', 'Wij bieden een veilige en stimulerende leeromgeving waar kinderen zich kunnen ontwikkelen op hun eigen tempo. Met aandacht voor individuele talenten en noden, bereiden we hen voor op een succesvolle toekomst.', 'text'),
('visie', 'mission-img', '', 'image'),
('visie', 'sfeer-img-1', '', 'image'),
('visie', 'sfeer-img-2', '', 'image'),
('visie', 'approach-img', '', 'image'),
('visie', 'approach-1-title', 'Eigentijds Onderwijs', 'text'),
('visie', 'approach-1-text', 'We gebruiken moderne lesmethodes en technologie om kinderen optimaal voor te bereiden op de toekomst.', 'text'),
('visie', 'approach-2-title', 'Persoonlijke Begeleiding', 'text'),
('visie', 'approach-2-text', 'Elk kind krijgt de aandacht die het nodig heeft.', 'text'),
('visie', 'approach-3-title', 'Open Communicatie', 'text'),
('visie', 'approach-3-text', 'Transparantie en regelmatig contact met ouders.', 'text'),
('visie', 'cta-title', 'Klaar om deel uit te maken van onze school?', 'text'),
('visie', 'cta-text', 'Kom kennismaken tijdens een rondleiding.', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;

-- =============================================
-- KLASSEN PAGE
-- =============================================
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('klassen', 'hero-title', 'Onze Klassen', 'text'),
('klassen', 'hero-text', 'Ontdek alle klassen van onze school', 'text'),
('klassen', 'kleuter-title', 'Kleuteronderwijs', 'text'),
('klassen', 'kleuter-subtitle', 'Van peuter tot derde kleuter', 'text'),
('klassen', 'kleuter-photo', '', 'image'),
('klassen', 'kleuter-1-text', '', 'text'),
('klassen', 'kleuter-2-text', '', 'text'),
('klassen', 'kleuter-3-text', '', 'text'),
('klassen', 'lager-title', 'Lager Onderwijs', 'text'),
('klassen', 'lager-subtitle', 'Van eerste tot zesde leerjaar', 'text'),
('klassen', 'extra-title', 'Extra Aanbod', 'text'),
('klassen', 'extra-text', '', 'text'),
('klassen', '1-item-1', '', 'text'),
('klassen', '1-item-2', '', 'text'),
('klassen', '1-item-3', '', 'text'),
('klassen', '2-item-1', '', 'text'),
('klassen', '2-item-2', '', 'text'),
('klassen', '2-item-3', '', 'text'),
('klassen', '3-item-1', '', 'text'),
('klassen', '3-item-2', '', 'text'),
('klassen', '3-item-3', '', 'text'),
('klassen', '4-item-1', '', 'text'),
('klassen', '4-item-2', '', 'text'),
('klassen', '4-item-3', '', 'text'),
('klassen', '5-item-1', '', 'text'),
('klassen', '5-item-2', '', 'text'),
('klassen', '5-item-3', '', 'text'),
('klassen', '6-item-1', '', 'text'),
('klassen', '6-item-2', '', 'text'),
('klassen', '6-item-3', '', 'text'),
('klassen', 'cta-title', 'Interesse in onze school?', 'text'),
('klassen', 'cta-text', 'Neem contact op voor meer info.', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;

-- Klassen: individuele klas content
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('klassen', 'peuterklas-text', '', 'text'),
('klassen', 'peuterklas-photo', '', 'image'),
('klassen', 'peuterklas-teacher-photo', '', 'image'),
('klassen', 'peuterklas-teacher-name', '', 'text'),
('klassen', 'k1-text', '', 'text'),
('klassen', 'k1-photo', '', 'image'),
('klassen', 'k1-teacher-photo', '', 'image'),
('klassen', 'k2-text', '', 'text'),
('klassen', 'k2-photo', '', 'image'),
('klassen', 'k2-teacher-photo', '', 'image'),
('klassen', 'k3-text', '', 'text'),
('klassen', 'k3-photo', '', 'image'),
('klassen', 'k3-teacher-photo', '', 'image'),
('klassen', '1a-text', '', 'text'),
('klassen', '1a-photo', '', 'image'),
('klassen', '1a-teacher-photo', '', 'image'),
('klassen', '2a-text', '', 'text'),
('klassen', '2a-photo', '', 'image'),
('klassen', '2a-teacher-photo', '', 'image'),
('klassen', '3a-text', '', 'text'),
('klassen', '3a-photo', '', 'image'),
('klassen', '3a-teacher-photo', '', 'image'),
('klassen', '3b-text', '', 'text'),
('klassen', '3b-photo', '', 'image'),
('klassen', '3b-teacher-photo', '', 'image'),
('klassen', '4a-text', '', 'text'),
('klassen', '4a-photo', '', 'image'),
('klassen', '4a-teacher-photo', '', 'image'),
('klassen', '4b-text', '', 'text'),
('klassen', '4b-photo', '', 'image'),
('klassen', '4b-teacher-photo', '', 'image'),
('klassen', '5a-text', '', 'text'),
('klassen', '5a-photo', '', 'image'),
('klassen', '5a-teacher-photo', '', 'image'),
('klassen', '6a-text', '', 'text'),
('klassen', '6a-photo', '', 'image'),
('klassen', '6a-teacher-photo', '', 'image'),
('klassen', 'talen-text', '', 'text'),
('klassen', 'talen-photo', '', 'image'),
('klassen', 'talen-teacher-photo', '', 'image'),
('klassen', 'talen-teacher-name', '', 'text'),
('klassen', 'sport-text', '', 'text'),
('klassen', 'sport-photo', '', 'image'),
('klassen', 'sport-teacher-photo', '', 'image'),
('klassen', 'sport-teacher-name', '', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;

-- =============================================
-- TEAM PAGE
-- =============================================
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('team', 'hero-title', 'Ons Team', 'text'),
('team', 'hero-text', 'Maak kennis met ons team', 'text'),
('team', 'director-bio', '', 'text'),
('team', 'teachers-title', 'Leerkrachten', 'text'),
('team', 'teachers-subtitle', '', 'text'),
('team', 'member-1-name', '', 'text'),
('team', 'member-1-role', '', 'text'),
('team', 'member-1-photo', '', 'image'),
('team', 'member-1-bio', '', 'text'),
('team', 'member-2-name', '', 'text'),
('team', 'member-2-role', '', 'text'),
('team', 'member-2-photo', '', 'image'),
('team', 'member-2-bio', '', 'text'),
('team', 'member-3-name', '', 'text'),
('team', 'member-3-role', '', 'text'),
('team', 'member-3-photo', '', 'image'),
('team', 'member-3-bio', '', 'text'),
('team', 'member-4-name', '', 'text'),
('team', 'member-4-role', '', 'text'),
('team', 'member-4-photo', '', 'image'),
('team', 'member-4-bio', '', 'text'),
('team', 'member-5-name', '', 'text'),
('team', 'member-5-role', '', 'text'),
('team', 'member-5-photo', '', 'image'),
('team', 'member-5-bio', '', 'text'),
('team', 'member-6-name', '', 'text'),
('team', 'member-6-role', '', 'text'),
('team', 'member-6-photo', '', 'image'),
('team', 'member-6-bio', '', 'text'),
('team', 'support-title', 'Ondersteuning', 'text'),
('team', 'support-subtitle', '', 'text'),
('team', 'support-1-name', '', 'text'),
('team', 'support-1-bio', '', 'text'),
('team', 'support-2-name', '', 'text'),
('team', 'support-2-bio', '', 'text'),
('team', 'support-3-name', '', 'text'),
('team', 'support-3-bio', '', 'text'),
('team', 'cta-title', '', 'text'),
('team', 'cta-text', '', 'text'),
('team', 'contact-director-name', 'Inge Versavel', 'text'),
('team', 'contact-director-photo', '', 'image')
ON CONFLICT (page_slug, content_key) DO NOTHING;

-- =============================================
-- OPVANG PAGE
-- =============================================
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('opvang', 'hero-title', 'Voor- en Naschoolse Opvang', 'text'),
('opvang', 'hero-text', '', 'text'),
('opvang', 'schedule-title', 'Uurrooster', 'text'),
('opvang', 'schedule-subtitle', '', 'text'),
('opvang', 'morning-time', '7:00 - 8:15', 'text'),
('opvang', 'morning-text', '', 'text'),
('opvang', 'afternoon-time', '15:30 - 18:00', 'text'),
('opvang', 'afternoon-text', '', 'text'),
('opvang', 'activities-title', 'Activiteiten', 'text'),
('opvang', 'activities-subtitle', '', 'text'),
('opvang', 'activity-1-title', '', 'text'),
('opvang', 'activity-1-text', '', 'text'),
('opvang', 'activity-2-title', '', 'text'),
('opvang', 'activity-2-text', '', 'text'),
('opvang', 'activity-3-title', '', 'text'),
('opvang', 'activity-3-text', '', 'text'),
('opvang', 'activity-4-title', '', 'text'),
('opvang', 'activity-4-text', '', 'text'),
('opvang', 'activity-5-title', '', 'text'),
('opvang', 'activity-5-text', '', 'text'),
('opvang', 'activity-6-title', '', 'text'),
('opvang', 'activity-6-text', '', 'text'),
('opvang', 'practical-title', 'Praktisch', 'text'),
('opvang', 'price-1', '', 'text'),
('opvang', 'price-2', '', 'text'),
('opvang', 'price-3', '', 'text'),
('opvang', 'price-note', '', 'text'),
('opvang', 'register-1', '', 'text'),
('opvang', 'register-2', '', 'text'),
('opvang', 'register-3', '', 'text'),
('opvang', 'register-note', '', 'text'),
('opvang', 'team-title', 'Ons Opvangteam', 'text'),
('opvang', 'team-text', '', 'text'),
('opvang', 'cta-title', '', 'text'),
('opvang', 'cta-text', '', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;

-- =============================================
-- FOTOS PAGE
-- =============================================
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('fotos', 'hero-title', 'Fotoalbum', 'text'),
('fotos', 'hero-text', '', 'text'),
('fotos', 'gallery-title', 'Sfeerbeelden', 'text'),
('fotos', 'gallery-subtitle', '', 'text'),
('fotos', 'gallery-1', '', 'image'),
('fotos', 'gallery-2', '', 'image'),
('fotos', 'gallery-3', '', 'image'),
('fotos', 'gallery-4', '', 'image'),
('fotos', 'gallery-5', '', 'image'),
('fotos', 'gallery-6', '', 'image'),
('fotos', 'gallery-7', '', 'image'),
('fotos', 'gallery-8', '', 'image'),
('fotos', 'gallery-9', '', 'image'),
('fotos', 'facebook-title', '', 'text'),
('fotos', 'facebook-text', '', 'text'),
('fotos', 'cta-title', '', 'text'),
('fotos', 'cta-text', '', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;

-- =============================================
-- PROJECTEN PAGE
-- =============================================
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('projecten', 'hero-title', 'Projecten', 'text'),
('projecten', 'hero-text', '', 'text'),
('projecten', 'overview-title', '', 'text'),
('projecten', 'overview-subtitle', '', 'text'),
('projecten', 'timeline-title', '', 'text'),
('projecten', 'timeline-subtitle', '', 'text'),
('projecten', 'season-1-title', '', 'text'),
('projecten', 'season-1-period', '', 'text'),
('projecten', 'season-1-text', '', 'text'),
('projecten', 'season-2-title', '', 'text'),
('projecten', 'season-2-period', '', 'text'),
('projecten', 'season-2-text', '', 'text'),
('projecten', 'season-3-title', '', 'text'),
('projecten', 'season-3-period', '', 'text'),
('projecten', 'season-3-text', '', 'text'),
('projecten', 'season-4-title', '', 'text'),
('projecten', 'season-4-period', '', 'text'),
('projecten', 'season-4-text', '', 'text'),
('projecten', 'approach-title', '', 'text'),
('projecten', 'approach-text', '', 'text'),
('projecten', 'annual-title', '', 'text'),
('projecten', 'annual-subtitle', '', 'text'),
('projecten', 'annual-1-title', '', 'text'),
('projecten', 'annual-1-text', '', 'text'),
('projecten', 'annual-2-title', '', 'text'),
('projecten', 'annual-2-text', '', 'text'),
('projecten', 'annual-3-title', '', 'text'),
('projecten', 'annual-3-text', '', 'text'),
('projecten', 'annual-4-title', '', 'text'),
('projecten', 'annual-4-text', '', 'text'),
('projecten', 'annual-5-title', '', 'text'),
('projecten', 'annual-5-text', '', 'text'),
('projecten', 'annual-6-title', '', 'text'),
('projecten', 'annual-6-text', '', 'text'),
('projecten', '2021-poster', '', 'image'),
('projecten', '2022-poster', '', 'image'),
('projecten', '2023-poster', '', 'image'),
('projecten', '2024-poster', '', 'image'),
('projecten', 'cta-title', '', 'text'),
('projecten', 'cta-text', '', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;

-- =============================================
-- KALENDER PAGE
-- =============================================
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('kalender', 'live-title', '', 'text'),
('kalender', 'live-subtitle', '', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;
