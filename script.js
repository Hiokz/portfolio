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
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
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
    // --- Theme Toggle functionality ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        document.body.classList.add('light-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');

        if (isLight) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay using CSS transition
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });

    // Add hover state to cursor for clickable elements
    const clickables = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // --- Typing Animation ---
    const typeWriterEl = document.getElementById('typewriter');
    if (typeWriterEl) {
        const textToType = "I build intelligent things for the web.";
        let i = 0;

        // Clear it first
        typeWriterEl.textContent = '';

        function typeWriter() {
            if (i < textToType.length) {
                typeWriterEl.textContent += textToType.charAt(i);
                i++;
                // Randomize typing speed slightly for realism
                setTimeout(typeWriter, Math.random() * 50 + 50);
            }
        }

        // Start typing after a short delay
        setTimeout(typeWriter, 1000);
    }

    // --- Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        const text = btn.querySelector('.text');

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move text slightly towards mouse
            text.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            // Reset text position
            text.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 3D Project Card Tilt ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on mouse position relative to center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg vertical
            const rotateY = ((x - centerX) / centerX) * 10;  // Max 10 deg horizontal

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset transforms with a smooth transition
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
});
