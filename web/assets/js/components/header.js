// Header component - automatically adds header to all pages
document.addEventListener('DOMContentLoaded', () => {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
        <nav class="nav">
            <a href="../home/" class="logo">VBS De Frères</a>
            <ul class="nav-links">
                <li><a href="../home/">Home</a></li>
                <li><a href="../visie/">Visie</a></li>
                <li><a href="../klassen/">Klassen</a></li>
                <li><a href="../team/">Team</a></li>
                <li><a href="../opvang/">Opvang</a></li>
                <li><a href="../kalender/">Kalender</a></li>
                <li><a href="../fotos/">Foto's</a></li>
                <li><a href="../projecten/">Projecten</a></li>
                <li><a href="../contact/">Contact</a></li>
            </ul>
        </nav>
    `;
    
    // Insert header at the beginning of body
    document.body.insertBefore(header, document.body.firstChild);
});
