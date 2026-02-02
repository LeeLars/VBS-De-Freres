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

-- Insert default home page content
INSERT INTO page_content (page_slug, content_key, content_value, content_type) VALUES
('home', 'hero-title', 'Basisschool De Frères Brugge', 'text'),
('home', 'hero-text', 'Een warme school waar elk kind centraal staat. Wij bieden kwaliteitsonderwijs in een veilige en stimulerende omgeving. Wees welkom!', 'text'),
('home', 'form-title', 'Schrijf uw kind in', 'text'),
('home', 'form-subtitle', 'Laat uw gegevens achter voor een kennismaking', 'text'),

('home', 'classes-title', 'Alle klassen', 'text'),
('home', 'classes-preschool-title', 'Kleuteronderwijs', 'text'),
('home', 'class-toddler', 'Peuterklas', 'text'),
('home', 'class-k1', 'Kleuterklas 1 - juf Nele', 'text'),
('home', 'class-k2', 'Kleuterklas 2 - juf Anaïs', 'text'),
('home', 'class-k3', 'Kleuterklas 3 - juf Evy', 'text'),

('home', 'classes-primary-title', 'Lager Onderwijs', 'text'),
('home', 'class-1a', 'Klas 1A - juf Lies/ meester Simon', 'text'),
('home', 'class-2a', 'Klas 2A - juf Stefanie', 'text'),
('home', 'class-3a', 'Klas 3A - juf Melissa', 'text'),
('home', 'class-3b', 'Klas 3B - juf Aurelie', 'text'),
('home', 'class-4a', 'Klas 4A - juf Emma', 'text'),
('home', 'class-4b', 'Klas 4B - juf Tine', 'text'),
('home', 'class-5a', 'Klas 5A - juf Anneke', 'text'),
('home', 'class-6a', 'Klas 6A - juf Kelly', 'text'),

('home', 'classes-extra-title', 'Extra Zorg & Sport', 'text'),
('home', 'class-languages', 'Talenklas - uitbreiding/meertaligheid', 'text'),
('home', 'class-sport', 'Sport op school', 'text'),
('home', 'class-care', 'Hand in hand', 'text'),

('home', 'spotlight-title', 'Eerste kleuter - juf Nele', 'text'),
('home', 'spotlight-subtitle', 'Hand in hand', 'text'),
('home', 'spotlight-text-1', 'Met onze peuters en eerste kleuters zetten we de eerste stapjes in school.', 'text'),
('home', 'spotlight-text-2', 'Gaan jullie mee op bezoek in onze klas? Knutselen, spelen, turnen, zingen, dansen, ... te veel om op te noemen.', 'text'),
('home', 'spotlight-text-3', 'Klik gerust verder en geniet mee van onze ontdekkingen, belevenissen en avonturen.', 'text'),

('home', 'gallery-1', '', 'image'),
('home', 'gallery-2', '', 'image'),
('home', 'gallery-3', '', 'image'),
('home', 'gallery-4', '', 'image'),

('home', 'contact-title', 'Contacteer ons', 'text'),
('home', 'contact-school-name', 'Basisschool De Frères', 'text'),
('home', 'contact-address', 'Nieuwstraat 2 | 8000 Brugge', 'text'),
('home', 'contact-phone', '050 33 63 47', 'text'),
('home', 'contact-email', 'info@vbsdefreres.be', 'text'),
('home', 'contact-director-name', 'Inge Versavel', 'text'),
('home', 'contact-director-phone', 'Gsm: 0476 90 81 23', 'text')
ON CONFLICT (page_slug, content_key) DO NOTHING;
