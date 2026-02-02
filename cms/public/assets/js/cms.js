// VBS De Frères CMS JavaScript

// Check if logged in
if (!sessionStorage.getItem('cmsLoggedIn')) {
    window.location.href = '/cms';
}

// Navigation handling
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.cms-section');
    const sectionTitle = document.getElementById('sectionTitle');
    const addNewBtn = document.getElementById('addNewBtn');

    // Section titles
    const titles = {
        'paginas': 'Pagina\'s Beheren',
        'team': 'Team Leden',
        'media': 'Media Bibliotheek',
        'berichten': 'Contact Berichten',
        'instellingen': 'Instellingen'
    };

    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Get section name
            const sectionName = item.dataset.section;
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Update title
            sectionTitle.textContent = titles[sectionName] || 'Dashboard';
            
            // Update add button text
            if (sectionName === 'team') {
                addNewBtn.textContent = '+ Nieuw Teamlid';
                addNewBtn.style.display = 'block';
            } else if (sectionName === 'media') {
                addNewBtn.style.display = 'none';
            } else if (sectionName === 'berichten') {
                addNewBtn.style.display = 'none';
            } else if (sectionName === 'instellingen') {
                addNewBtn.style.display = 'none';
            } else {
                addNewBtn.textContent = '+ Nieuwe Pagina';
                addNewBtn.style.display = 'block';
            }
        });
    });

    // Add new button handler
    addNewBtn.addEventListener('click', () => {
        const activeNav = document.querySelector('.nav-item.active');
        const section = activeNav ? activeNav.dataset.section : 'paginas';
        
        if (section === 'team') {
            showTeamModal();
        } else if (section === 'paginas') {
            showPageModal();
        }
    });

    // Load contact messages
    loadContactMessages();
});

// Logout function
function handleLogout() {
    sessionStorage.removeItem('cmsLoggedIn');
    window.location.href = '/cms';
}

// Show team modal (placeholder)
function showTeamModal() {
    alert('Team toevoegen functionaliteit komt binnenkort!\n\nHier kun je straks:\n- Naam invoeren\n- Functie opgeven\n- Foto uploaden\n- Contact info toevoegen');
}

// Show page modal (placeholder)
function showPageModal() {
    alert('Pagina toevoegen functionaliteit komt binnenkort!\n\nHier kun je straks:\n- Pagina titel invoeren\n- Content bewerken\n- SEO instellingen aanpassen');
}

// Load contact messages from API
async function loadContactMessages() {
    try {
        // This would connect to your contact API
        // For now, showing placeholder
        console.log('Contact berichten laden...');
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Media upload handler
const mediaUpload = document.getElementById('mediaUpload');
if (mediaUpload) {
    mediaUpload.addEventListener('change', async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            alert(`${files.length} bestand(en) geselecteerd!\n\nCloudinary upload functionaliteit komt binnenkort.`);
            // Here you would upload to Cloudinary
        }
    });
}

// Edit button handlers
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
        alert('Bewerk functionaliteit komt binnenkort!');
    }
    
    if (e.target.classList.contains('btn-view')) {
        alert('Bekijk functionaliteit komt binnenkort!');
    }
    
    if (e.target.classList.contains('btn-delete')) {
        if (confirm('Weet je zeker dat je dit wilt verwijderen?')) {
            alert('Verwijder functionaliteit komt binnenkort!');
        }
    }
});
