// Header component - automatically adds header to all pages
document.addEventListener('DOMContentLoaded', () => {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
        <nav class="nav">
            <a href="../home/" class="logo">VBS De Frères</a>
            
            <button class="mobile-toggle" aria-label="Menu openen">
                <span class="hamburger"></span>
            </button>

            <div class="nav-menu">
                <ul class="nav-links">
                    <li><a href="../home/">Home</a></li>
                    <li><a href="../visie/">Visie</a></li>
                    <li><a href="../klassen/">Klassen</a></li>
                    <li><a href="../team/">Team</a></li>
                    <li><a href="../opvang/">Opvang</a></li>
                    <li><a href="../kalender/">Kalender</a></li>
                    <li><a href="../fotos/">Foto's</a></li>
                    <li><a href="../projecten/">Projecten</a></li>
                </ul>
                <a href="../contact/" class="nav-cta">Contact opnemen</a>
            </div>
        </nav>
    `;
    
    // Insert header at the beginning of body
    document.body.insertBefore(header, document.body.firstChild);

    // Mobile menu logic
    const mobileToggle = header.querySelector('.mobile-toggle');
    const navMenu = header.querySelector('.nav-menu');
    const body = document.body;

    mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        
        // Prevent scrolling when menu is open
        if (isOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    header.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            body.style.overflow = '';
        });
    });
});
