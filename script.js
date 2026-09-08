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

        siteNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
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

        if (!fullName || !phone || !date || !details) {
            if (status) {
                status.textContent = 'Please complete all required appointment fields.';
            }
            return;
        }

        if (status) {
            status.textContent = 'Sending appointment details...';
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
                    phone: phone,
                    service: service,
                    date: date,
                    details: details,
                    _subject: `Appointment Request - ${service}`,
                    _captcha: 'false',
                    _template: 'table'
                })
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit appointment');
            }

            if (status) {
                status.textContent = 'Appointment submitted successfully. Please check your email.';
            }

            form.reset();
        } catch (error) {
            console.error(error);

            if (status) {
                status.textContent = 'There was a problem submitting your appointment. Please try again or use your email app.';
            }
        }
    });
});
