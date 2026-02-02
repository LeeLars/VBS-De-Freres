// Pagina-specifieke logica voor: contact
console.log('Page script geladen: contact');

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = contactForm.querySelector('.btn-submit');
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value
  };
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Bezig met verzenden...';
  formMessage.style.display = 'none';
  formMessage.className = 'form-message';
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      formMessage.textContent = data.message || 'Bericht succesvol verzonden!';
      formMessage.classList.add('success');
      contactForm.reset();
    } else {
      formMessage.textContent = data.error || 'Er is een fout opgetreden';
      formMessage.classList.add('error');
    }
  } catch (error) {
    console.error('Contact form error:', error);
    formMessage.textContent = 'Kan geen verbinding maken met de server';
    formMessage.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Verstuur';
  }
});
