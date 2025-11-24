document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const header = document.getElementById('main-header');
    const links = document.querySelectorAll('.nav-link');

    // --- 1. Mobile Menu Toggle Logic ---
    function toggleMenu() {
        const isVisible = navLinks.getAttribute('data-visible') === 'true';
        
        // Toggle ARIA attributes for accessibility
        navLinks.setAttribute('data-visible', String(!isVisible));
        menuToggle.setAttribute('aria-expanded', String(!isVisible));

        // Toggle icon between menu and close (optional: add a close icon)
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('bx-menu', isVisible);
        icon.classList.toggle('bx-x', !isVisible);
    }

    menuToggle.addEventListener('click', toggleMenu);

    // --- 2. Close Menu on Link Click (Mobile UX) ---
    links.forEach(link => {
        link.addEventListener('click', () => {
            // Check if the menu is open (only relevant for mobile)
            if (navLinks.getAttribute('data-visible') === 'true' && window.innerWidth <= 768) {
                // Close the menu after link selection
                toggleMenu(); 
            }
        });
    });

    // --- 3. Active State Logic ---
    // Function to set the active link state
    function setActiveLink() {
        // Simple example: check the hash in the URL
        const currentHash = window.location.hash || '#home';

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    }
    
    // Initial call and listener for hash changes
    setActiveLink();
    window.addEventListener('hashchange', setActiveLink);


    // --- 4. Sticky Header (Optional Bonus) ---
    // Note: The sticky behavior is mostly handled by CSS (position: fixed)
    // This JS could be used for advanced effects (e.g., shrinking the header)

    function handleScroll() {
        // Example of adding an extra class on scroll if needed for subtle effects
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initial check and event listener
    handleScroll();
    window.addEventListener('scroll', handleScroll);
});