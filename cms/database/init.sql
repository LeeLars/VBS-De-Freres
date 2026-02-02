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

-- Insert default home page content
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('home', 'hero-title', 'Welkom bij VBS De Frères', 'text'),
('home', 'hero-text', 'Een warme school waar elk kind centraal staat. Wij bieden kwaliteitsonderwijs in een veilige en stimulerende omgeving.', 'text'),
('home', 'features-title', 'Waarom kiezen voor VBS De Frères?', 'text'),
('home', 'features-subtitle', 'Ontdek wat onze school uniek maakt', 'text'),
('home', 'feature1-title', 'Persoonlijke aandacht', 'text'),
('home', 'feature1-text', 'Elk kind is uniek. Onze leerkrachten kennen elk kind bij naam en zorgen voor een persoonlijke aanpak die past bij de noden van uw kind.', 'text'),
('home', 'feature2-title', 'Kwaliteitsonderwijs', 'text'),
('home', 'feature2-text', 'Wij streven naar excellentie in onderwijs met moderne leermethodes en een team van gedreven, gekwalificeerde leerkrachten.', 'text'),
('home', 'feature3-title', 'Warme schoolgemeenschap', 'text'),
('home', 'feature3-text', 'Bij ons voelt iedereen zich thuis. Ouders, kinderen en leerkrachten vormen samen een hechte gemeenschap.', 'text'),
('home', 'stat1-number', '250+', 'text'),
('home', 'stat1-label', 'Leerlingen', 'text'),
('home', 'stat2-number', '25', 'text'),
('home', 'stat2-label', 'Leerkrachten', 'text'),
('home', 'stat3-number', '50+', 'text'),
('home', 'stat3-label', 'Jaren ervaring', 'text'),
('home', 'stat4-number', '98%', 'text'),
('home', 'stat4-label', 'Tevredenheid', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;
