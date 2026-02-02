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
        
        try {
            const response = await fetch(`${API_BASE}/api/content/${pageSlug}`);
            
            if (!response.ok) {
                console.log('No CMS content found, using default content');
                return;
            }
            
            const result = await response.json();
            
            if (result.success && result.content) {
                applyContent(result.content);
            }
        } catch (error) {
            console.log('CMS content not available, using default content');
        }
    }
    
    // Apply content to page elements
    function applyContent(content) {
        for (const [key, data] of Object.entries(content)) {
            const value = data.value || data;
            
            // Find elements with matching data-cms attribute
            const elements = document.querySelectorAll(`[data-cms$="${key}"]`);
            
            elements.forEach(element => {
                if (element.tagName === 'IMG') {
                    element.src = value;
                } else {
                    element.textContent = value;
                }
            });
        }
    }
    
    // Load content when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadContent);
    } else {
        loadContent();
    }
})();
