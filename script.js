document.addEventListener('DOMContentLoaded', () => {
    // Scroll animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    let delayCounter = 0;
    let delayTimeout = null;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply a dynamic transition delay to stagger the animations
                entry.target.style.transitionDelay = `${delayCounter * 100}ms`;
                entry.target.classList.add('show');
                observer.unobserve(entry.target);

                delayCounter++;

                // Reset the counter after a short delay so the next scroll batch starts at 0
                clearTimeout(delayTimeout);
                delayTimeout = setTimeout(() => {
                    delayCounter = 0;
                }, 100);
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
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    const navItems = document.querySelectorAll('.nav-links li a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Small timeout allows the browser to process the anchor jump before tearing down the DOM node's CSS
            setTimeout(() => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }, 50);
        });
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
                const response = await fetch("https://formsubmit.co/ajax/7c8ea1d906c0c1d243cabf44a55c1d92", {
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
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;

                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }
        });
    }


    // --- Custom Animated Dropdowns (from Hiok Digital) ---
    const customSelectSources = document.querySelectorAll('.custom-select-source');

    customSelectSources.forEach(select => {
        // Hide the original select
        select.classList.add('hidden-select');

        // Create the custom wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-container';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        // Create the trigger div
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';

        let selectedOption = select.options[select.selectedIndex];
        let placeholderText = "Select an option";
        if (selectedOption) {
            placeholderText = selectedOption.text;
        }

        trigger.innerHTML = `
            <span class="trigger-text">${placeholderText}</span>
            <i class="fas fa-chevron-down arrow-icon"></i>
        `;
        wrapper.appendChild(trigger);

        // Create the options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-options-container';
        wrapper.appendChild(optionsContainer);

        // Create an option div for each option
        Array.from(select.options).forEach((option) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'custom-option';
            optionDiv.textContent = option.text;
            optionDiv.dataset.value = option.value;

            if (option.disabled && option.value === "") {
                optionDiv.classList.add('is-placeholder');
            }

            optionDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                trigger.querySelector('.trigger-text').textContent = optionDiv.textContent;
                select.value = optionDiv.dataset.value;

                // Trigger change event to ensure form validation/state catch the update if needed
                select.dispatchEvent(new Event('change'));

                optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                optionDiv.classList.add('selected');
                wrapper.classList.remove('open');
            });

            optionsContainer.appendChild(optionDiv);
        });

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select-container').forEach(container => {
                if (container !== wrapper) {
                    container.classList.remove('open');
                }
            });
            wrapper.classList.toggle('open');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-container').forEach(container => {
            container.classList.remove('open');
        });
    });


    const typeWriterEl = document.getElementById('typewriter');
    if (typeWriterEl) {
        const roles = [
            "Aspiring Software Engineer.",
            "Building the Future, One Line at a Time.",
            "ECE Graduate Turned Builder.",
            "Passionate About Clean Code.",
            "Turning Ideas into Digital Reality.",
            "Learning. Growing. Shipping.",
            "UI/UX Engineer by Craft.",
            "Problem Solver at Heart.",
            "Founder of HIOK.DIGITAL.",
            "Engineering Dreams into Products."
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

            // Faster when deleting, slightly random when typing
            let typeSpeed = isDeleting ? 40 : Math.random() * 50 + 50;

            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at the end of the full phrase
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Move to next word when completely deleted
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Small pause before new word starts
            }

            setTimeout(typeWriter, typeSpeed);
        }

        // Start typing loop after slightly longer delay
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
