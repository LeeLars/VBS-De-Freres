// Pagina-specifieke logica voor: home
console.log('Page script geladen: home');

// Enrollment form handling
document.addEventListener('DOMContentLoaded', () => {
    const enrollmentForm = document.getElementById('enrollmentForm');
    
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formMessage = document.getElementById('heroFormMessage');
            const submitBtn = enrollmentForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Bezig met verzenden...';
            if (formMessage) {
                formMessage.style.display = 'none';
                formMessage.className = 'form-message';
            }
            
            // Collect form data
            const formData = {
                parentName: document.getElementById('heroParentName').value,
                childBirthYear: document.getElementById('heroChildBirthYear').value,
                email: document.getElementById('heroEmail').value,
                phone: document.getElementById('heroPhone').value,
                message: document.getElementById('heroMessage').value,
                type: 'visit'
            };
            
            try {
                const apiUrl = window.API_BASE_URL ? `${window.API_BASE_URL}/api/contact` : '/api/contact';
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    if (formMessage) {
                        formMessage.textContent = result.message || 'Bedankt voor uw aanmelding! Wij nemen zo snel mogelijk contact met u op.';
                        formMessage.classList.add('success');
                        formMessage.style.display = 'block';
                    }
                    enrollmentForm.reset();
                } else {
                    if (formMessage) {
                        formMessage.textContent = result.error || 'Er is een fout opgetreden. Probeer het opnieuw.';
                        formMessage.classList.add('error');
                        formMessage.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Enrollment form error:', error);
                if (formMessage) {
                    formMessage.textContent = 'Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw.';
                    formMessage.classList.add('error');
                    formMessage.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
