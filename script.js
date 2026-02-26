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
                submitBtn.textContent = 'Send Message';
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

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
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


    // --- Skills Filter Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');

                // Reset flip state when filtering
                card.classList.remove('flipped');

                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block'; // Changed from flex since the card itself is no longer flex
                    // Optional: add a tiny animation reflow here if desired
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = null;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 3D Skill Card Flip Logic & Descriptions ---
    const skillDescriptions = {
        "HTML5": "The semantic backbone of the modern web. I use HTML5 to structure accessible, SEO-friendly content.",
        "CSS3": "Precise web styling. I leverage CSS3 for responsive layouts, animations, and glassmorphic designs.",
        "Node.js": "My go-to runtime for building scalable, high-performance backends and real-time APIs.",
        "SQL": "Writing optimized queries and designing robust relational schemas for complex data storage.",
        "Python": "Used for data analysis, algorithmic scripts, automation, and powerful backend logic.",
        "JavaScript": "The engine of the web. I write clean, asynchronous ES6+ JS for dynamic frontends and solid logic.",
        "TypeScript": "Adding strict static typing to JavaScript for maintainable, enterprise-level enterprise codebases.",
        "C++": "My foundation in low-level memory management and high-performance algorithms.",
        "C#": "Primary language for Unity game development and robust enterprise applications.",
        "Java": "Object-oriented programming experience handling complex backend systems.",
        "Swift": "Building sleek, native iOS experiences with smooth animations.",
        "Git": "Essential version control for collaborative development and safe deployments.",

        "Figma": "Where design happens. I create high-fidelity UI/UX mockups and interactive prototypes here.",
        "Photoshop": "Deep photo manipulation, digital compositing, and raster graphic creation.",
        "Illustrator": "Designing clean, scalable vector graphics, logos, and custom SVG assets.",
        "Premiere Pro": "Professional video editing, color grading, and complex timeline-based storytelling.",
        "CapCut": "Rapid editing and effect integration for viral, short-form vertical content.",
        "Unity": "Building interactive 2D/3D games and complex real-time simulations.",
        "Unreal Engine": "Crafting high-fidelity, photorealistic interactive 3D environments.",
        "Blender": "3D modeling, texturing, and rendering physical assets for games and web.",
        "WordPress": "Deploying customizable, highly SEO-optimized content management systems.",
        "Webflow": "Visually developing custom, complex responsive websites with massive bespoke animations.",
        "OBS Studio": "Configuring scenes and routing audio/video for professional streaming and recording.",
        "Canva": "Quick, templated asset creation for social media and marketing collateral.",
        "Vercel": "My preferred platform for deploying lightning-fast frontend frameworks globally.",
        "Supabase": "An open-source Firebase alternative providing a robust Postgres database, auth, and real-time subscriptions.",
        "Squarespace": "Setting up elegant, reliable websites rapidly for clients who need no-code visual management.",
        "Wix": "Deploying highly customized, visually rich, template-driven web experiences.",
        "Replit": "Rapid prototyping and collaborative cloud coding directly in the browser.",
        "Godot": "An open-source engine I use for lightweight, highly-optimized 2D game development.",
        "Android Studio": "Developing, testing, and profiling native Android applications.",
        "Glide": "Building powerful, data-driven mobile Progressive Web Apps directly from spreadsheets.",
        "YouTube": "Deep understanding of the platform algorithm, audience retention, and thumbnail psychology.",
        "TikTok": "Harnessing the viral algorithm to drive massive organic reach through short-form hooks.",
        "SEO": "Optimizing keywords, metadata, and site architecture to rank high on search engines.",
        "Scriptwriting": "Writing compelling, retention-optimized narratives that hook viewers and drive action.",
        "Base44": "A modern framework for robust, secure data encoding and structured deployment.",

        "Shopify": "Building high-converting, heavily customized eCommerce storefronts that scale.",
        "Stripe": "Integrating secure, complex payment flows, subscriptions, and financial infrastructure.",
        "Google Analytics": "Tracking user behavior, conversion funnels, and deep site metrics to inform decisions.",
        "Excel": "Complex financial modeling, macro automation, and deep data manipulation.",
        "TradingView": "Writing custom PineScript indicators and analyzing complex market structures.",
        "MT4/5": "Algorithmic trading platforms where I deploy automated quantitative scripts.",
        "Zapier": "Connecting disparate SaaS tools to automate boring manual workflows visually.",
        "n8n": "Advanced, source-available node-based automation handling complex webhooks and data pipelines.",
        "Product Strategy": "Defining vision, market-fit, and long-term roadmaps for digital products.",
        "Monetization": "Designing high-conversion pricing structures and maximizing customer lifetime value.",
        "MRR Growth": "Strategies focused on scaling Monthly Recurring Revenue sustainably without churn.",
        "User Acquisition": "Driving targeted, profitable traffic through paid, organic, and lateral growth channels."
    };

    skillCards.forEach(card => {
        // Find the text of the h3 inside the card to use as the dictionary key
        const titleElement = card.querySelector('h3');
        if (!titleElement) return;

        const skillName = titleElement.textContent.trim();
        const description = skillDescriptions[skillName] || "Passionate about leveraging this tool to build great experiences.";

        // Get everything currently inside the card (icon + h3)
        const originalContent = card.innerHTML;

        // Re-write the HTML inside the card with the 3D wrapper structure
        card.innerHTML = `
            <div class="skill-card-inner">
                <div class="skill-card-front">
                    ${originalContent}
                </div>
                <div class="skill-card-back">
                    <p>${description}</p>
                </div>
            </div>
        `;

        // Add the click listener to flip
        card.addEventListener('click', () => {
            // Optional: uncomment below to close other open cards when one is clicked
            /*
            document.querySelectorAll('.skill-card.flipped').forEach(c => {
                if (c !== card) c.classList.remove('flipped');
            });
            */
            card.classList.toggle('flipped');
        });
    });

    // --- Typing Animation Loop ---
    const typeWriterEl = document.getElementById('typewriter');
    if (typeWriterEl) {
        const roles = [
            "Software Engineer.",
            "Game Developer.",
            "App Developer.",
            "Automation Expert.",
            "E-Commerce Founder.",
            "SaaS Creator.",
            "Investor.",
            "Graphic Designer.",
            "Video Editor.",
            "Content Creator."
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
