const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.dots-container');
const playPauseBtn = document.querySelector('.play-pause-btn');

let currentSlide = 0;
let autoSlideInterval;
const slideDuration = 5000; // 5 seconds
let isPlaying = true; // Autoplay is on by default

// Dynamically create navigation dots
function createDots() {
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === currentSlide) {
            dot.classList.add('active');
            slides[index].classList.add('active'); // Activate first slide's caption
        }
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

// Update the active dot and slide class
function updateActiveElements() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
}

// Go to a specific slide
function goToSlide(index) {
    currentSlide = index;
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    } else if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateActiveElements();
}

// Navigate to the next slide
function nextSlide() {
    goToSlide(currentSlide + 1);
}

// Navigate to the previous slide
function prevSlide() {
    goToSlide(currentSlide - 1);
}

// Start auto-slide
function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval); // Clear any existing interval
    autoSlideInterval = setInterval(nextSlide, slideDuration);
    isPlaying = true;
    playPauseBtn.innerHTML = "<i class='bx bx-pause'></i>";
}

// Pause auto-slide
function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
    isPlaying = false;
    playPauseBtn.innerHTML = "<i class='bx bx-play'></i>";
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        pauseAutoSlide();
    } else {
        startAutoSlide();
    }
}

// --- Event Listeners ---
nextBtn.addEventListener('click', () => {
    nextSlide();
    if (isPlaying) startAutoSlide(); // Reset timer on manual navigation
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    if (isPlaying) startAutoSlide(); // Reset timer on manual navigation
});

playPauseBtn.addEventListener('click', togglePlayPause);

// --- Swipe Support (Bonus) ---
let touchStartX = 0;
let touchEndX = 0;

slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum pixels for a swipe to register

    if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
        if (isPlaying) startAutoSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
        if (isPlaying) startAutoSlide();
    }
}

// --- Initialization ---
createDots();
startAutoSlide();