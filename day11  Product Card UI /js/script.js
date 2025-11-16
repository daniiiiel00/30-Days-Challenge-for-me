const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const THEME_KEY = 'product-card-theme';

// --- Theme Toggle Logic ---
function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeToggle.innerHTML = theme === 'dark' 
        ? "<i class='bx bxs-sun'></i>" 
        : "<i class='bx bxs-moon'></i>";
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to light if no preference is saved, or system preference
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light'); 
    setTheme(initialTheme);
}

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Initial theme load
loadTheme();
themeToggle.addEventListener('click', toggleTheme);

// --- Add to Cart Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productName = event.target.dataset.productName;
            alert(`${productName} added to cart!`);
        });
    });

    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const icon = button.querySelector('i');
            if (icon.classList.contains('bx-heart')) {
                icon.classList.remove('bx-heart');
                icon.classList.add('bxs-heart'); // Filled heart
                alert('Added to wishlist!');
            } else {
                icon.classList.remove('bxs-heart');
                icon.classList.add('bx-heart'); // Outline heart
                alert('Removed from wishlist!');
            }
        });
    });
});