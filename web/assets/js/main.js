// Grafix Starter - globale JS

console.log('Grafix Starter frontend geladen');

// Voorbeeld: mobiel menu toggle kan hier later komen.

// Active navigation link
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const pageName = href.replace(/\.\.\//g, '').replace(/\//g, '');
        if (pageName && path.includes('/' + pageName + '/')) {
            link.classList.add('active');
        } else if (pageName === 'home' && (path === '/' || path.endsWith('/home/'))) {
            link.classList.add('active');
        }
    });
    
    // Contact CTA active state
    const ctaLink = document.querySelector('.nav-cta');
    if (ctaLink && path.includes('/contact/')) {
        ctaLink.style.background = '#a8cf8c';
        ctaLink.style.color = '#fff';
    }
});

// Scroll to Top Button
document.addEventListener('DOMContentLoaded', () => {
    const scrollBtn = document.querySelector('.scroll-to-top');
    
    if (scrollBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
