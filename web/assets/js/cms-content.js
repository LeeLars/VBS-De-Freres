// CMS Content Loader
// Loads dynamic content from the CMS API and updates page elements

(function() {
    const API_BASE = window.API_BASE_URL || 'https://vbs-de-freres-production.up.railway.app';
    
    // Get current page slug from URL
    function getPageSlug() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p);
        
        // Find the page folder name
        for (let i = parts.length - 1; i >= 0; i--) {
            if (parts[i] !== 'index.html' && parts[i] !== '') {
                return parts[i];
            }
        }
        return 'home';
    }
    
    // Load content from API
    async function loadContent() {
        const pageSlug = getPageSlug();
        
        // Fallback timeout - show content after 500ms if CMS hasn't loaded
        const fallbackTimer = setTimeout(() => {
            showContent(false);
        }, 500);
        
        try {
            const response = await fetch(`${API_BASE}/api/content/${pageSlug}`);
            
            if (!response.ok) {
                console.log('No CMS content found, using default content');
                clearTimeout(fallbackTimer);
                showContent(false);
                return;
            }
            
            const result = await response.json();
            
            if (result.success && result.content) {
                applyContent(pageSlug, result.content);
                clearTimeout(fallbackTimer);
                showContent(true);
            } else {
                clearTimeout(fallbackTimer);
                showContent(false);
            }
        } catch (error) {
            console.log('CMS content not available, using default content');
            clearTimeout(fallbackTimer);
            showContent(false);
        }
    }
    
    // Apply content to page elements
    function applyContent(pageSlug, content) {
        for (const [key, data] of Object.entries(content)) {
            const value = data.value || data;
            
            // Try exact match with pageSlug prefix first, then exact key match
            let elements = document.querySelectorAll(`[data-cms="${pageSlug}-${key}"]`);
            if (elements.length === 0) {
                elements = document.querySelectorAll(`[data-cms="${key}"]`);
            }
            
            elements.forEach(element => {
                if (element.tagName === 'IMG') {
                    if (value && value.trim() !== '') {
                        element.src = value;
                    } else {
                        element.style.display = 'none';
                    }
                } else if (element.tagName === 'IFRAME') {
                    if (value && value.trim() !== '') {
                        element.src = value;
                    }
                } else {
                    element.textContent = value;
                }
            });
        }
    }
    
    // Show content after loading or fallback
    function showContent(usedCMS = true) {
        document.body.classList.add(usedCMS ? 'cms-loaded' : 'cms-fallback');
    }
    
    // Load content when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadContent);
    } else {
        loadContent();
    }
})();
