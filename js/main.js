/* ========================================
   EHSANI TOTALSERVICE - Main JavaScript
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       DOM Elements
       ======================================== */
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMain = document.querySelector('.nav-main');
    const navLinks = document.querySelectorAll('.nav-main a');
    const contactForm = document.getElementById('contact-form');

    /* ========================================
       Header Scroll Effect
       ======================================== */
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run on load

    /* ========================================
       Mobile Menu Toggle
       ======================================== */
    if (menuToggle && navMain) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMain.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMain.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMain.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMain.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMain.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMain.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ========================================
       Active Navigation State
       ======================================== */
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPage ||
                (currentPage === '' && linkPath === 'index.html') ||
                (currentPage === 'index.html' && linkPath === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink();

    /* ========================================
       Smooth Scroll for Anchor Links
       ======================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ========================================
       Contact Form Handling
       ======================================== */
    if (contactForm) {
        const formMessage = document.getElementById('form-message');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const buttonText = submitButton ? submitButton.innerHTML : '';

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: contactForm.querySelector('#name').value.trim(),
                email: contactForm.querySelector('#email').value.trim(),
                phone: contactForm.querySelector('#phone').value.trim(),
                address: contactForm.querySelector('#address')?.value.trim() || '',
                projectType: contactForm.querySelector('#project-type')?.value || '',
                projectSize: contactForm.querySelector('#project-size')?.value || '',
                description: contactForm.querySelector('#description').value.trim(),
                wantSiteVisit: contactForm.querySelector('#site-visit')?.checked || false
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showFormMessage('Vennligst fyll ut alle obligatoriske felter.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Vennligst oppgi en gyldig e-postadresse.', 'error');
                return;
            }

            // Phone validation (Norwegian format)
            const phoneRegex = /^(\+47)?[\s]?[2-9]\d{7}$/;
            const cleanPhone = formData.phone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFormMessage('Vennligst oppgi et gyldig telefonnummer.', 'error');
                return;
            }

            // Show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner"></span> Sender...';
            }

            try {
                // Send to Resend API (you'll need to set up a backend endpoint)
                const response = await sendFormData(formData);

                if (response.success) {
                    showFormMessage('Takk for din henvendelse! Vi kontakter deg så snart som mulig.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error(response.message || 'Noe gikk galt');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('Beklager, noe gikk galt. Vennligst prøv igjen eller ring oss direkte.', 'error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = buttonText;
                }
            }
        });

        function showFormMessage(message, type) {
            if (formMessage) {
                formMessage.textContent = message;
                formMessage.className = 'form-message ' + type;
                formMessage.style.display = 'block';

                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Hide message after 10 seconds for success
                if (type === 'success') {
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 10000);
                }
            }
        }

        async function sendFormData(data) {
            // Option 1: Using a serverless function (recommended for production)
            // Replace with your actual endpoint
            const endpoint = '/api/contact';

            // For demo purposes, we'll simulate a successful response
            // In production, uncomment the fetch below and set up a proper backend

            /*
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
            */

            // Simulated response for demo
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Form data submitted:', data);
                    resolve({ success: true });
                }, 1500);
            });
        }
    }

    /* ========================================
       Form Input Enhancements
       ======================================== */
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            // Remove country code if present
            if (value.startsWith('47')) {
                value = value.substring(2);
            }

            // Format as XXX XX XXX
            if (value.length > 3 && value.length <= 5) {
                value = value.substring(0, 3) + ' ' + value.substring(3);
            } else if (value.length > 5) {
                value = value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 8);
            }

            e.target.value = value;
        });
    }

    /* ========================================
       Intersection Observer for Animations
       ======================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animateOnScroll.observe(el);
    });

    /* ========================================
       Gallery Lightbox (if gallery page)
       ======================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length > 0) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Lukk">&times;</button>
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const overlay = this.querySelector('.gallery-overlay');

                if (img) {
                    lightboxImage.src = img.src;
                    lightboxImage.alt = img.alt;

                    if (overlay) {
                        const title = overlay.querySelector('h4');
                        const desc = overlay.querySelector('p');
                        lightboxCaption.innerHTML = `
                            ${title ? '<strong>' + title.textContent + '</strong>' : ''}
                            ${desc ? '<p>' + desc.textContent + '</p>' : ''}
                        `;
                    }

                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxBackdrop.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /* ========================================
       Click to Call Tracking
       ======================================== */
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track phone click (for analytics)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Click',
                    'value': this.href
                });
            }
        });
    });

    /* ========================================
       Lazy Loading Images
       ======================================== */
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');

        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    lazyImageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }

    /* ========================================
       Preload Key Resources
       ======================================== */
    function preloadImage(url) {
        const img = new Image();
        img.src = url;
    }

    // Preload hero images on other pages for faster navigation
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            const href = this.getAttribute('href');
            if (href && href.endsWith('.html') && !href.startsWith('http')) {
                // Could preload page resources here
            }
        });
    });

    /* ========================================
       Service Worker Registration (PWA)
       ======================================== */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Uncomment to enable service worker
            // navigator.serviceWorker.register('/sw.js')
            //     .then(registration => {
            //         console.log('SW registered:', registration);
            //     })
            //     .catch(error => {
            //         console.log('SW registration failed:', error);
            //     });
        });
    }

    /* ========================================
       Console Welcome Message
       ======================================== */
    console.log('%cEHSANI TOTALSERVICE', 'color: #1A3A5C; font-size: 24px; font-weight: bold;');
    console.log('%cGulvlegging og interiør i Larvik', 'color: #C67B5C; font-size: 14px;');
    console.log('---');
    console.log('Interessert i webutvikling? Ta kontakt!');

})();

/* ========================================
   Lightbox Styles (injected via JS)
   ======================================== */
const lightboxStyles = document.createElement('style');
lightboxStyles.textContent = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
    }

    .lightbox.active {
        opacity: 1;
        visibility: visible;
    }

    .lightbox-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
    }

    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    }

    .lightbox-image {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 8px;
    }

    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 32px;
        cursor: pointer;
        padding: 8px;
        line-height: 1;
    }

    .lightbox-close:hover {
        color: #C67B5C;
    }

    .lightbox-caption {
        text-align: center;
        color: white;
        padding: 16px;
    }

    .lightbox-caption strong {
        font-size: 18px;
        display: block;
        margin-bottom: 8px;
    }

    .lightbox-caption p {
        opacity: 0.8;
        margin: 0;
    }
`;
document.head.appendChild(lightboxStyles);
