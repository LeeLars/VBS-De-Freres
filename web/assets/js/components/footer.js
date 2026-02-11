// Footer component - automatically adds footer to all pages
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-section">
                <h3>VBS De Frères</h3>
                <p>Vrije Basisschool De Frères<br>
                Kwaliteitsonderwijs in een warme omgeving</p>
            </div>
            
            <div class="footer-section">
                <h3>Contacteer ons</h3>
                <p>
                    <strong>Basisschool De Frères</strong><br><br>
                    <strong>Ingang:</strong><br>
                    Nieuwstraat 2 | 8000 Brugge<br><br>
                    <strong>Tel.:</strong> 050 33 63 47<br><br>
                    <strong>Email:</strong><br>
                    <a href="mailto:info@vbsdefreres.be" style="color: #a8cf8c; text-decoration: none;">info@vbsdefreres.be</a><br><br>
                    <strong>Directeur:</strong><br>
                    Inge Versavel<br>
                    Gsm: 0476 90 81 23
                </p>
            </div>
            
            <div class="footer-section">
                <h3>Snelle Links</h3>
                <p>
                    <a href="../home/">Home</a><br>
                    <a href="../visie/">Visie</a><br>
                    <a href="../contact/">Contact</a>
                </p>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} VBS De Frères. Alle rechten voorbehouden.</p>
            <div class="footer-bottom-links">
                <a href="../visie/">Privacybeleid</a>
                <span class="dot">&bull;</span>
                <a href="../sitemap/">Sitemap</a>
                <span class="dot">&bull;</span>
                <a href="../visie/#reglement">Schoolreglement</a>
                <span class="dot">&bull;</span>
                <span style="color: #999; font-size: 0.8125rem;">Gemaakt door <a href="https://grafixstudio.io/" target="_blank" style="color: #a8cf8c; font-weight: 600;">Grafix Studio</a></span>
                <span class="dot">&bull;</span>
                <a href="https://vbs-de-freres-production.up.railway.app/cms" target="_blank" class="cms-icon" title="CMS Login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(footer);
    
    // Add scroll-to-top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll naar boven');
    scrollBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    document.body.appendChild(scrollBtn);
});
