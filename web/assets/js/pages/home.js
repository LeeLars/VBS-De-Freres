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
            
            // Collect form data
            const formData = {
                parentFirstName: document.getElementById('parentFirstName').value,
                parentLastName: document.getElementById('parentLastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                childFirstName: document.getElementById('childFirstName').value,
                childLastName: document.getElementById('childLastName').value,
                childBirthdate: document.getElementById('childBirthdate').value,
                startYear: document.getElementById('startYear').value,
                message: document.getElementById('message').value
            };
            
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
