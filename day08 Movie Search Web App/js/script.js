const API_KEY = "YOUR_OMDB_API_KEY";
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const movieInput = document.getElementById("movie-input");
const searchBtn = document.getElementById("search-btn");
const movieCard = document.getElementById("movie-card");
const loadingSpinner = document.getElementById("loading-spinner");
const initialMessage = document.getElementById("initial-message");
const errorMessage = document.getElementById("error-message");

// Movie Card Elements
const posterEl = document.getElementById("poster");
const titleEl = document.getElementById("title");
const yearEl = document.getElementById("year");
const genreEl = document.getElementById("genre");
const plotEl = document.getElementById("plot");
const ratingEl = document.getElementById("rating");
const imdbLinkEl = document.getElementById("imdb-link");

const THEME_KEY = "movie-finder-theme";

// --- Theme Toggle Logic ---

function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  themeToggle.innerHTML =
    theme === "dark"
      ? "<i class='bx bxs-sun'></i>"
      : "<i class='bx bxs-moon'></i>";
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  setTheme(initialTheme);
}

function toggleTheme() {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
}

// Initial theme load
loadTheme();
themeToggle.addEventListener("click", toggleTheme);

// --- API Fetching Logic ---

function toggleLoading(show) {
  if (show) {
    loadingSpinner.classList.remove("hidden");
    movieCard.classList.add("hidden");
    initialMessage.classList.add("hidden");
    errorMessage.classList.add("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
  }
}

function displayMessage(element, message, isError) {
  toggleLoading(false);
  movieCard.classList.add("hidden");

  if (isError) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    initialMessage.classList.add("hidden");
  } else {
    initialMessage.textContent = message;
    initialMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  }
}

function displayMovie(data) {
  toggleLoading(false);
  errorMessage.classList.add("hidden");
  initialMessage.classList.add("hidden");

  posterEl.src = data.Poster !== "N/A" ? data.Poster : "placeholder.png";
  posterEl.alt = `${data.Title} Poster`;
  titleEl.textContent = data.Title;
  yearEl.textContent = data.Year;
  genreEl.textContent = data.Genre !== "N/A" ? data.Genre : "Genre unknown";
  plotEl.textContent =
    data.Plot !== "N/A" ? data.Plot : "Plot summary unavailable.";

  const imdbRating = data.imdbRating !== "N/A" ? data.imdbRating : "N/A";
  ratingEl.textContent = `IMDb: ${imdbRating}`;

  imdbLinkEl.href = `https://www.imdb.com/title/${data.imdbID}/`;

  movieCard.classList.remove("hidden");
}

async function fetchMovie(title) {
  if (API_KEY === "YOUR_OMDB_API_KEY") {
    displayMessage(
      errorMessage,
      "Please set your OMDb API Key in script.js to start searching.",
      true
    );
    return;
  }

  const apiUrl = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`;

  toggleLoading(true);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (data.Response === "True") {
      displayMovie(data);
    } else {
      // OMDb returns Response: "False" on error
      displayMessage(
        errorMessage,
        data.Error || `Movie titled "${title}" not found.`,
        true
      );
    }
  } catch (error) {
    console.error(error);
    displayMessage(
      errorMessage,
      "An error occurred while fetching data. Check your API key or network connection.",
      true
    );
  }
}

function handleSearch() {
  const title = movieInput.value.trim();
  if (title) {
    fetchMovie(title);
  } else {
    displayMessage(errorMessage, "Please enter a movie title to search.", true);
  }
}

searchBtn.addEventListener("click", handleSearch);

movieInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});
