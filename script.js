document.addEventListener('DOMContentLoaded', () => {
    // Scroll animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px -10px rgba(2,12,27,0.7)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.right = '20px';
            navLinks.style.background = 'var(--bg-light)';
            navLinks.style.padding = '20px';
            navLinks.style.borderRadius = '8px';
            navLinks.style.border = '1px solid var(--bg-lighter)';
            navLinks.style.gap = '20px';
        }
    });

    // Form submission via FormSubmit AJAX
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = form ? form.querySelector('.submit-btn') : null;

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch("https://formsubmit.co/ajax/weijia056@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    formStatus.textContent = 'Thank you for reaching out! I will get back to you soon.';
                    formStatus.style.color = 'var(--accent)';
                    form.reset();
                } else {
                    formStatus.textContent = 'Oops! There was a problem submitting your form.';
                    formStatus.style.color = '#ff6b6b';
                }
            } catch (error) {
                formStatus.textContent = 'Oops! There was a problem submitting your form.';
                formStatus.style.color = '#ff6b6b';
            } finally {
                submitBtn.textContent = 'Say Hello';
                submitBtn.disabled = false;

                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }
        });
    }
});
