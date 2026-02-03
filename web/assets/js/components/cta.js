// CTA Component - Child-friendly and playful
function createCTA(title, text, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink) {
    const ctaHTML = `
        <section style="padding: 80px 24px; background: linear-gradient(135deg, #f5f9f2 0%, #e8f5e0 100%); position: relative; overflow: hidden;">
            <!-- Playful decorative elements -->
            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: #a8cf8c; opacity: 0.1; border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -80px; left: -80px; width: 250px; height: 250px; background: #a8cf8c; opacity: 0.08; border-radius: 50%;"></div>
            
            <div style="max-width: 1000px; margin: 0 auto; position: relative; z-index: 1;">
                <div style="background: #fff; border-radius: 32px; padding: 64px 48px; text-align: center; box-shadow: 0 8px 32px rgba(168, 207, 140, 0.15); border: 3px solid #a8cf8c;">
                    <h2 style="font-size: 42px; margin-bottom: 16px; color: #000; line-height: 1.2;">${title}</h2>
                    <p style="font-size: 18px; color: #666; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">${text}</p>
                    <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                        <a href="${primaryButtonLink}" style="background: #a8cf8c; color: #000; padding: 18px 36px; border-radius: 50px; font-weight: 700; font-size: 16px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(168, 207, 140, 0.3); display: inline-block;">${primaryButtonText}</a>
                        <a href="${secondaryButtonLink}" style="background: #fff; color: #000; padding: 18px 36px; border-radius: 50px; font-weight: 600; font-size: 16px; text-decoration: none; transition: all 0.3s ease; border: 2px solid #a8cf8c; display: inline-block;">${secondaryButtonText}</a>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    return ctaHTML;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createCTA };
}
