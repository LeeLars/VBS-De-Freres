// Playful interactions for kids - Hero canvas drawing feature
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize hero canvas
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#000000';
    
    // Color palette
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            currentColor = this.dataset.color;
            
            // Update active state
            colorButtons.forEach(b => {
                b.classList.remove('active');
                b.style.transform = 'scale(1)';
                b.style.borderWidth = '2px';
            });
            this.classList.add('active');
            this.style.transform = 'scale(1.2)';
            this.style.borderWidth = '3px';
        });
        
        // Hover effect
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.1)';
            }
        });
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
    
    // Clear button
    const clearBtn = document.getElementById('clearCanvas');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.style.background = '#e8f5e0';
            setTimeout(() => {
                this.style.background = '#f5f5f5';
            }, 200);
        });
        
        clearBtn.addEventListener('mouseenter', function() {
            this.style.background = '#e8f5e0';
        });
        clearBtn.addEventListener('mouseleave', function() {
            this.style.background = '#f5f5f5';
        });
    }
    
    // Drawing functionality
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDrawing = false;
    });
    
    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    // Add floating decorative elements (subtle playful accents)
    addFloatingElements();
});

// Add subtle floating decorative elements
function addFloatingElements() {
    const hero = document.querySelector('.hero-playful');
    if (!hero) return;
    
    // Create 3 small floating icons
    const icons = ['✏️', '⭐', '📚'];
    const positions = [
        { top: '15%', left: '10%', delay: '0s' },
        { top: '70%', right: '15%', delay: '2s' },
        { top: '40%', right: '8%', delay: '4s' }
    ];
    
    icons.forEach((icon, i) => {
        const element = document.createElement('div');
        element.textContent = icon;
        element.style.cssText = `
            position: absolute;
            ${positions[i].top ? `top: ${positions[i].top};` : ''}
            ${positions[i].left ? `left: ${positions[i].left};` : ''}
            ${positions[i].right ? `right: ${positions[i].right};` : ''}
            font-size: 32px;
            opacity: 0.15;
            z-index: 1;
            animation: float 6s ease-in-out infinite;
            animation-delay: ${positions[i].delay};
            pointer-events: none;
        `;
        hero.appendChild(element);
    });
    
    // Add float animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
    `;
    document.head.appendChild(floatStyle);
}
