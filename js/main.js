document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close mobile menu if open
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Gallery Implementation
    const galleryData = [
        { id: 1, src: 'images/gallery/gallery-1.jpg', category: 'bridal' },
        { id: 2, src: 'images/gallery/gallery-2.jpg', category: 'special' },
        { id: 3, src: 'images/gallery/gallery-3.jpg', category: 'bridal' },
        // Add more gallery items as needed
    ];

    const galleryGrid = document.querySelector('.gallery-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderGallery(items) {
        galleryGrid.innerHTML = '';
        items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item fade-in';
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="Gallery Image ${item.id}">
            `;
            galleryGrid.appendChild(galleryItem);
        });
    }

    renderGallery(galleryData);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const filteredItems = filter === 'all' 
                ? galleryData 
                : galleryData.filter(item => item.category === filter);
            
            renderGallery(filteredItems);
        });
    });

    // Testimonials Slider
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    let currentSlide = 0;
    const slideWidth = slides[0].offsetWidth;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // Set initial position
    track.style.transform = `translateX(0)`;

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        updateDots();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto advance slides
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    track.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    const bookingForm = document.getElementById('booking-form');
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            service: document.getElementById('service').value
        };

        // Validate form data
        if (!validateForm(formData)) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Simulate form submission
        alert('Thank you for your booking request! We will contact you shortly.');
        bookingForm.reset();
    });

    function validateForm(data) {
        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.date || !data.service) {
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }

        // Phone validation
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(data.phone)) {
            return false;
        }

        // Date validation
        const selectedDate = new Date(data.date);
        const today = new Date();
        if (selectedDate < today) {
            return false;
        }

        // Validate service selection
        if (!data.service) {
            return false;
        }

        // Additional validation for waxing services
        if (data.service.includes('wax')) {
            // Check if it's been at least 24 hours since booking
            const bookingDate = new Date(data.date);
            const now = new Date();
            if (bookingDate - now < 24 * 60 * 60 * 1000) {
                alert('Please book waxing services at least 24 hours in advance');
                return false;
            }
        }

        // Additional validation for hair services
        if (data.service.includes('hair')) {
            const bookingDate = new Date(data.date);
            const now = new Date();
            
            // Require 48 hours notice for bridal hair
            if (data.service === 'bridal-hair' && 
                bookingDate - now < 48 * 60 * 60 * 1000) {
                alert('Please book bridal hair services at least 48 hours in advance');
                return false;
            }
            
            // Require 24 hours notice for other hair services
            if (bookingDate - now < 24 * 60 * 60 * 1000) {
                alert('Please book hair services at least 24 hours in advance');
                return false;
            }
        }

        return true;
    }

    // Scroll Animation
    const scrollElements = document.querySelectorAll('.fade-in');

    function handleScrollAnimation() {
        scrollElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Initial check

    // Service Selection Logic
    const serviceTypeBtns = document.querySelectorAll('.service-type-btn');
    const serviceSelect = document.getElementById('service');

    serviceTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            serviceTypeBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show relevant service options
            const serviceType = btn.dataset.type;
            const options = serviceSelect.querySelectorAll('optgroup');
            options.forEach(group => {
                if (
                    (serviceType === 'makeup' && group.label.includes('Makeup')) ||
                    (serviceType === 'hair' && group.label.includes('Hair')) ||
                    (serviceType === 'waxing' && group.label.includes('Waxing'))
                ) {
                    group.style.display = '';
                } else {
                    group.style.display = 'none';
                }
            });
            
            // Reset select value
            serviceSelect.value = '';
        });
    });

    // Navbar Hide/Show on Scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Intersection Observer for scroll animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                fadeObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: '0px'
    });

    // Create observer for slide-in animations
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in-visible');
                slideObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px'
    });

    // Add animation classes to elements
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('fade-in-element');
        fadeObserver.observe(el);
    });

    document.querySelectorAll('.service-item').forEach((el, index) => {
        el.classList.add('slide-in-element');
        el.style.transitionDelay = `${index * 0.1}s`; // Stagger effect
        slideObserver.observe(el);
    });

    document.querySelectorAll('.portfolio-grid img').forEach((el, index) => {
        el.classList.add('fade-in-element');
        el.style.transitionDelay = `${index * 0.1}s`;
        fadeObserver.observe(el);
    });

    document.querySelectorAll('.about-content, .about-image').forEach(el => {
        el.classList.add('slide-in-element');
        slideObserver.observe(el);
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in-element, .slide-in-element, .zoom-in-element');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('fade-in-visible', 'slide-in-visible', 'zoom-in-visible');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-item, .info-card');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });

    // Add more elements as needed
}); 