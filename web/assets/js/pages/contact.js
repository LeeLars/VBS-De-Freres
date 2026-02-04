// Pagina-specifieke logica voor: contact
console.log('Page script geladen: contact');

// Visit Form (Hero Section)
const visitForm = document.getElementById('visitForm');
const visitFormMessage = document.getElementById('visitFormMessage');

if (visitForm) {
  visitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = visitForm.querySelector('.btn-submit');
    const formData = {
      parentName: document.getElementById('parentName').value,
      childBirthYear: document.getElementById('childBirthYear').value,
      email: document.getElementById('visitEmail').value,
      phone: document.getElementById('visitPhone').value,
      message: document.getElementById('visitMessage').value,
      type: 'visit'
    };
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met verzenden...';
    visitFormMessage.style.display = 'none';
    visitFormMessage.className = 'form-message';
    
    try {
      const apiUrl = window.API_BASE_URL ? `${window.API_BASE_URL}/api/contact` : '/api/contact';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        visitFormMessage.textContent = data.message || 'Aanvraag succesvol verzonden! We nemen snel contact op.';
        visitFormMessage.classList.add('success');
        visitFormMessage.style.display = 'block';
        visitForm.reset();
      } else {
        visitFormMessage.textContent = data.error || 'Er is een fout opgetreden';
        visitFormMessage.classList.add('error');
        visitFormMessage.style.display = 'block';
      }
    } catch (error) {
      console.error('Visit form error:', error);
      visitFormMessage.textContent = 'Kan geen verbinding maken met de server';
      visitFormMessage.classList.add('error');
      visitFormMessage.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Plan een Bezoek';
    }
  });
}

// Contact Form (Lower Section)
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.btn-submit');
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      message: document.getElementById('message').value,
      type: 'contact'
    };
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met verzenden...';
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';
    
    try {
      const apiUrl = window.API_BASE_URL ? `${window.API_BASE_URL}/api/contact` : '/api/contact';
      const response = await fetch(apiUrl, {
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
        formMessage.style.display = 'block';
        contactForm.reset();
      } else {
        formMessage.textContent = data.error || 'Er is een fout opgetreden';
        formMessage.classList.add('error');
        formMessage.style.display = 'block';
      }
    } catch (error) {
      console.error('Contact form error:', error);
      formMessage.textContent = 'Kan geen verbinding maken met de server';
      formMessage.classList.add('error');
      formMessage.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Verstuur Bericht';
    }
  });
}
