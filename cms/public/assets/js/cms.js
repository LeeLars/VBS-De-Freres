// VBS De Frères CMS JavaScript

// Check if logged in
if (!sessionStorage.getItem('cmsLoggedIn')) {
    window.location.href = '/cms';
}

// Logout function
function handleLogout() {
    sessionStorage.removeItem('cmsLoggedIn');
    sessionStorage.removeItem('cmsToken');
    window.location.href = '/cms';
}
