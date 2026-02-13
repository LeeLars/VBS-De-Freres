// CMS Content Loader
// Loads dynamic content from the CMS API and updates page elements

// Inject critical CSS immediately to hide content until CMS loads (prevents fallback text flash)
(function() {
    var s = document.createElement('style');
    s.textContent = 'main{opacity:0;transition:opacity .3s ease}body.cms-loaded main,body.cms-fallback main{opacity:1}';
    document.head.appendChild(s);
})();

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
    
    // Optimize Cloudinary URLs with on-the-fly transformations
    function optimizeCloudinaryUrl(url, element) {
        if (!url || !url.includes('res.cloudinary.com')) return url;
        
        // Skip if already transformed (has Cloudinary transform params like w_, f_, q_)
        var afterUpload = (url.split('/upload/')[1] || '');
        if (/^[a-z]{1,2}_/.test(afterUpload)) return url;
        
        // Use fixed dimensions based on context
        const cmsKey = element.getAttribute('data-cms') || '';
        let w, h;
        
        if (cmsKey.includes('gallery')) {
            // Gallery items: 300x200 display, serve at 2x
            w = 600; h = 400;
        } else {
            // General images: serve at reasonable size
            w = 800; h = 600;
        }
        
        // Insert transformation: f_auto serves WebP/AVIF, q_auto optimizes quality
        const transform = `w_${w},h_${h},c_fill,f_auto,q_auto`;
        return url.replace('/upload/', `/upload/${transform}/`);
    }
    
    // Apply content to page elements
    function applyContent(pageSlug, content) {
        // First pass: collect best value per data-cms attribute
        // Prefixed keys (e.g. gallery-1 under home) match data-cms="home-gallery-1"
        // Skip empty values so they don't override filled ones
        const applied = {};
        
        for (const [key, data] of Object.entries(content)) {
            // Handle different data structures
            let value = data;
            
            // If data is an object with a 'value' property, use that
            if (data && typeof data === 'object' && data.value !== undefined) {
                value = data.value;
            }
            
            // If value is still an object (e.g. nested), try to extract a string or skip
            if (value && typeof value === 'object') {
                console.warn(`Skipping object value for key ${key}`, value);
                continue;
            }
            
            // Ensure value is a string
            if (typeof value !== 'string') {
                value = String(value || '');
            }
            
            // Check for "[object Object]" string which indicates corrupted data
            if (value === '[object Object]') {
                continue;
            }
            
            // Handle corrupted JSON-string values (e.g. '{"value":"url","type":"image"}')
            if (value.startsWith('{') && value.includes('"value"')) {
                try {
                    const parsed = JSON.parse(value);
                    if (parsed && typeof parsed.value === 'string') {
                        value = parsed.value;
                    }
                } catch(e) {}
            }
            
            if (!value || value.trim() === '') continue;
            
            // Convert relative PDF URLs to absolute CMS server URLs
            if (value.startsWith('/api/media/pdf/')) {
                value = API_BASE + value;
            }
            
            // Try exact match with pageSlug prefix first
            let selector = `[data-cms="${pageSlug}-${key}"]`;
            let elements = document.querySelectorAll(selector);
            
            // Fallback: exact key match
            if (elements.length === 0) {
                selector = `[data-cms="${key}"]`;
                elements = document.querySelectorAll(selector);
            }
            
            elements.forEach(element => {
                if (element.tagName === 'IMG') {
                    element.src = optimizeCloudinaryUrl(value, element);
                    element.style.display = '';
                } else if (element.tagName === 'IFRAME') {
                    element.src = value;
                } else {
                    element.textContent = value;
                }
            });
            
            // Also check for data-cms-href (sets href on anchor tags)
            let hrefSelector = `[data-cms-href="${pageSlug}-${key}"]`;
            let hrefElements = document.querySelectorAll(hrefSelector);
            if (hrefElements.length === 0) {
                hrefSelector = `[data-cms-href="${key}"]`;
                hrefElements = document.querySelectorAll(hrefSelector);
            }
            hrefElements.forEach(el => {
                let hrefVal = value;
                if (hrefVal.startsWith('/api/media/pdf/')) {
                    hrefVal = API_BASE + hrefVal;
                }
                el.href = hrefVal;
            });
        }
        
        // Collect klassen data and dispatch event for klassen rendering
        const klassen = {};
        for (const [key, data] of Object.entries(content)) {
            const klasMatch = key.match(/^klas-(.+)-(name|teacher|text|photo|tphoto|blog|order)$/);
            if (klasMatch) {
                let val = data;
                if (data && typeof data === 'object' && data.value !== undefined) val = data.value;
                if (typeof val === 'string' && val.trim() !== '' && val !== '[object Object]') {
                    const slug = klasMatch[1];
                    const field = klasMatch[2];
                    if (!klassen[slug]) klassen[slug] = {};
                    klassen[slug][field] = val;
                }
            }
        }
        if (Object.keys(klassen).length > 0) {
            window._cmsKlassen = klassen;
            document.dispatchEvent(new CustomEvent('cms-klassen-ready', { detail: klassen }));
        }
        
        // Collect team member data and dispatch event for team rendering
        const teamleden = {};
        for (const [key, data] of Object.entries(content)) {
            const lidMatch = key.match(/^lid-(.+)-(name|role|bio|photo|order)$/);
            if (lidMatch) {
                let val = data;
                if (data && typeof data === 'object' && data.value !== undefined) val = data.value;
                if (typeof val === 'string' && val.trim() !== '' && val !== '[object Object]') {
                    const slug = lidMatch[1];
                    const field = lidMatch[2];
                    if (!teamleden[slug]) teamleden[slug] = {};
                    teamleden[slug][field] = val;
                }
            }
        }
        if (Object.keys(teamleden).length > 0) {
            window._cmsTeam = teamleden;
            document.dispatchEvent(new CustomEvent('cms-team-ready', { detail: teamleden }));
        }
        
        // Collect document data and dispatch event for document rendering
        const documents = {};
        for (const [key, data] of Object.entries(content)) {
            const docMatch = key.match(/^doc-(\d+)-(title|desc|link)$/);
            if (docMatch) {
                let val = data;
                if (data && typeof data === 'object' && data.value !== undefined) val = data.value;
                if (typeof val === 'string' && val.trim() !== '' && val !== '[object Object]') {
                    const num = docMatch[1];
                    const field = docMatch[2];
                    if (!documents[num]) documents[num] = {};
                    documents[num][field] = val;
                }
            }
        }
        if (Object.keys(documents).length > 0) {
            window._cmsDocuments = documents;
            document.dispatchEvent(new CustomEvent('cms-documents-ready', { detail: documents }));
        }
        
        // Collect gallery image URLs and dispatch event for gallery scripts
        const galleryUrls = {};
        for (const [key, data] of Object.entries(content)) {
            if (key.includes('gallery')) {
                let val = data;
                if (data && typeof data === 'object' && data.value !== undefined) val = data.value;
                if (typeof val === 'string') {
                    // Handle corrupted JSON-string values
                    if (val.startsWith('{') && val.includes('"value"')) {
                        try { val = JSON.parse(val).value || ''; } catch(e) {}
                    }
                    if (val.trim() !== '' && val !== '[object Object]') {
                        galleryUrls[key] = val;
                    }
                }
            }
        }
        if (Object.keys(galleryUrls).length > 0) {
            window._cmsGalleryUrls = galleryUrls;
            document.dispatchEvent(new CustomEvent('cms-gallery-ready', { detail: galleryUrls }));
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
