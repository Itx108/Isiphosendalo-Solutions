document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');

    const closeMenu = () => {
        if (!navToggle || !siteNav) return;
        siteNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
    };

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });

        siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1020) closeMenu();
        });
    }

    const revealTargets = document.querySelectorAll(
        '.screen, .service-card, .product-card, .tech-card, .contact-card'
    );

    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealTargets.forEach((item) => item.classList.add('reveal'));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        revealTargets.forEach((item) => observer.observe(item));
    }

    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    const form = document.getElementById('appointmentForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullName = document.getElementById('full-name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const details = document.getElementById('details').value.trim();
        const submitButton = form.querySelector('button[type="submit"]');

        if (!fullName || !phone || !date || !details) {
            if (status) status.textContent = 'Please complete all required consultation fields.';
            return;
        }

        if (status) status.textContent = 'Sending your consultation request...';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        try {
            const response = await fetch('https://formsubmit.co/ajax/xolodlamini0810@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: fullName,
                    phone,
                    service,
                    date,
                    details,
                    _subject: `Software Consultation Request - ${service}`,
                    _captcha: 'false',
                    _template: 'table'
                })
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || 'Failed to submit consultation request');

            if (status) status.textContent = 'Consultation request sent successfully. We will contact you using the details provided.';
            form.reset();
            if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
        } catch (error) {
            console.error(error);
            if (status) status.textContent = 'There was a problem sending your request. Please try again or contact us by email or WhatsApp.';
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Request Consultation';
            }
        }
    });
});