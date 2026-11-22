/**
 * Selamat.dev — Portfolio Script
 * Theme: Hiok Digital Inspired Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Mobile Menu Toggle
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking any nav link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 2. Navbar Background on Scroll
    // ==========================================
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ==========================================
    // 3. Staggered Scroll Animations (IntersectionObserver)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
    };

    let delayCounter = 0;
    let delayTimeout = null;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger appearance of cards and sections
                entry.target.style.transitionDelay = `${delayCounter * 80}ms`;
                entry.target.classList.add('show');
                observer.unobserve(entry.target);

                delayCounter++;

                clearTimeout(delayTimeout);
                delayTimeout = setTimeout(() => {
                    delayCounter = 0;
                }, 100);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 4. Dynamic Typewriter Effect
    // ==========================================
    const typeWriterEl = document.getElementById('typewriter');
    if (typeWriterEl) {
        const roles = [
            "Electronic & Computer Graduate"
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typeWriterEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeWriterEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 35 : Math.random() * 45 + 55;

            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at end of phrase
                typeSpeed = 3000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Restart typing loop
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 600;
            }

            setTimeout(typeWriter, typeSpeed);
        }

        setTimeout(typeWriter, 800);
    }

    // ==========================================
    // 5. Smooth Scrolling for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 7. Contact Form Submission (FormSubmit AJAX)
    // ==========================================
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = form ? form.querySelector('.contact-submit-btn') : null;

    if (form && submitBtn && formStatus) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch("https://formsubmit.co/ajax/7c8ea1d906c0c1d243cabf44a55c1d92", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    formStatus.textContent = '✓ Message sent! Thank you for reaching out — I will get back to you shortly.';
                    formStatus.style.color = '#38bdf8';
                    form.reset();
                } else {
                    formStatus.textContent = '⚠ Unable to send message right now. Please try again or reach out on LinkedIn.';
                    formStatus.style.color = '#f87171';
                }
            } catch (error) {
                formStatus.textContent = '⚠ An error occurred. Please try again or reach out via LinkedIn/GitHub.';
                formStatus.style.color = '#f87171';
            } finally {
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;

                setTimeout(() => {
                    formStatus.textContent = '';
                }, 6000);
            }
        });
    }

});
