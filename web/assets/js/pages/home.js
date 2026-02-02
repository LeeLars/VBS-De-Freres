// Pagina-specifieke logica voor: home
console.log('Page script geladen: home');

// Enrollment form handling
document.addEventListener('DOMContentLoaded', () => {
    const enrollmentForm = document.getElementById('enrollmentForm');
    
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            const submitBtn = enrollmentForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Bezig met verzenden...';
            
            // Collect form data using FormData
            const formDataObj = new FormData(enrollmentForm);
            const formData = Object.fromEntries(formDataObj.entries());
            
            // Split names if possible to populate LastName fields (backend requires them)
            // The form has 'parentFirstName' as the main input for "Naam Ouder"
            if (formData.parentFirstName) {
                const nameParts = formData.parentFirstName.trim().split(' ');
                if (nameParts.length > 1) {
                    formData.parentFirstName = nameParts.shift(); // First part
                    formData.parentLastName = nameParts.join(' '); // Rest
                } else {
                    formData.parentLastName = '.'; // Fallback to satisfy validation
                }
            }

            // Same for child name
            if (formData.childFirstName) {
                const nameParts = formData.childFirstName.trim().split(' ');
                if (nameParts.length > 1) {
                    formData.childFirstName = nameParts.shift();
                    formData.childLastName = nameParts.join(' ');
                } else {
                    formData.childLastName = '.'; // Fallback
                }
            }
            
            try {
                const apiUrl = window.API_BASE_URL || '';
                const response = await fetch(`${apiUrl}/api/enrollment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    formMessage.textContent = 'Bedankt voor uw aanmelding! Wij nemen zo snel mogelijk contact met u op.';
                    formMessage.className = 'form-message success';
                    enrollmentForm.reset();
                } else {
                    formMessage.textContent = result.error || 'Er is een fout opgetreden. Probeer het opnieuw.';
                    formMessage.className = 'form-message error';
                }
            } catch (error) {
                console.error('Enrollment form error:', error);
                formMessage.textContent = 'Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw.';
                formMessage.className = 'form-message error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
