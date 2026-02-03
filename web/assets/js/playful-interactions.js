// Playful interactions for kids - Easter egg coloring/drawing feature
document.addEventListener('DOMContentLoaded', function() {
    
    // Easter egg: Click logo 5 times to activate drawing mode
    let logoClicks = 0;
    const logo = document.querySelector('.logo-img');
    
    if (logo) {
        logo.addEventListener('click', function(e) {
            logoClicks++;
            
            // Add bounce animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'logoBounce 0.5s ease';
            }, 10);
            
            if (logoClicks === 5) {
                activateDrawingMode();
                logoClicks = 0;
            }
            
            // Reset counter after 3 seconds
            setTimeout(() => {
                logoClicks = 0;
            }, 3000);
        });
    }
    
    // Drawing mode
    function activateDrawingMode() {
        // Create drawing overlay
        const overlay = document.createElement('div');
        overlay.id = 'drawingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 251, 0.95);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(window.innerWidth - 40, 800);
        canvas.height = Math.min(window.innerHeight - 200, 600);
        canvas.style.cssText = `
            border: 4px solid #a8cf8c;
            border-radius: 16px;
            background: white;
            cursor: crosshair;
            box-shadow: 0 8px 32px rgba(168, 207, 140, 0.3);
        `;
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            padding: 16px 24px;
            background: white;
            border-radius: 50px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        
        // Color buttons
        const colors = ['#000000', '#a8cf8c', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#c7ceea'];
        colors.forEach(color => {
            const btn = document.createElement('button');
            btn.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: ${color};
                border: 3px solid ${color === '#000000' ? '#666' : color};
                cursor: pointer;
                transition: transform 0.2s;
            `;
            btn.addEventListener('click', () => {
                currentColor = color;
                // Highlight selected
                toolbar.querySelectorAll('button').forEach(b => b.style.transform = 'scale(1)');
                btn.style.transform = 'scale(1.2)';
            });
            btn.addEventListener('mouseenter', () => {
                if (currentColor !== color) btn.style.transform = 'scale(1.1)';
            });
            btn.addEventListener('mouseleave', () => {
                if (currentColor !== color) btn.style.transform = 'scale(1)';
            });
            toolbar.appendChild(btn);
        });
        
        // Clear button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Wissen';
        clearBtn.style.cssText = `
            padding: 10px 20px;
            border-radius: 50px;
            background: #fff;
            border: 2px solid #ddd;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
        `;
        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
        clearBtn.addEventListener('mouseenter', () => {
            clearBtn.style.background = '#f5f5f5';
        });
        clearBtn.addEventListener('mouseleave', () => {
            clearBtn.style.background = '#fff';
        });
        toolbar.appendChild(clearBtn);
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Sluiten';
        closeBtn.style.cssText = `
            padding: 10px 20px;
            border-radius: 50px;
            background: #a8cf8c;
            border: none;
            cursor: pointer;
            font-weight: 700;
            color: #000;
            transition: all 0.2s;
        `;
        closeBtn.addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        });
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#96bb7a';
            closeBtn.style.transform = 'translateY(-2px)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = '#a8cf8c';
            closeBtn.style.transform = 'translateY(0)';
        });
        toolbar.appendChild(closeBtn);
        
        // Title
        const title = document.createElement('h2');
        title.textContent = 'Teken en kleur!';
        title.style.cssText = `
            font-size: 32px;
            color: #000;
            margin-bottom: 20px;
            animation: bounceIn 0.5s ease;
        `;
        
        // Assemble
        overlay.appendChild(title);
        overlay.appendChild(toolbar);
        overlay.appendChild(canvas);
        document.body.appendChild(overlay);
        
        // Drawing logic
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentColor = colors[0];
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
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
        
        // Show success message
        const message = document.createElement('div');
        message.textContent = 'Je hebt de teken-modus ontdekt!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #a8cf8c;
            color: #000;
            padding: 16px 32px;
            border-radius: 50px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(168, 207, 140, 0.4);
            z-index: 10001;
            animation: slideDown 0.5s ease;
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes logoBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideDown {
            from { transform: translate(-50%, -100%); }
            to { transform: translate(-50%, 0); }
        }
    `;
    document.head.appendChild(style);
    
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
