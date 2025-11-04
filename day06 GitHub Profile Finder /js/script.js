const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const usernameInput = document.getElementById("username-input");
const searchBtn = document.getElementById("search-btn");
const profileCard = document.getElementById("profile-card");
const loadingSpinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");
const reposList = document.getElementById("repos-list");

// Profile Elements
const avatarEl = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const reposCountEl = document.getElementById("repos-count");
const followersCountEl = document.getElementById("followers-count");
const followingCountEl = document.getElementById("following-count");
const profileLinkEl = document.getElementById("profile-link");

const THEME_KEY = "github-theme";

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

  // Default to saved theme, then system preference, then dark
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
    profileCard.classList.add("hidden");
    errorMessage.classList.add("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
  }
}

function displayError(message) {
  toggleLoading(false);
  profileCard.classList.add("hidden");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function displayProfile(user, repos) {
  toggleLoading(false);
  errorMessage.classList.add("hidden");

  avatarEl.src = user.avatar_url;
  nameEl.textContent = user.name || user.login;
  usernameEl.textContent = `@${user.login}`;
  usernameEl.href = user.html_url;
  bioEl.textContent = user.bio || "This user has no public bio.";
  reposCountEl.textContent = user.public_repos;
  followersCountEl.textContent = user.followers;
  followingCountEl.textContent = user.following;
  profileLinkEl.href = user.html_url;

  // Display Top Repositories
  reposList.innerHTML = "";
  if (repos.length > 0) {
    // Take the first 5 repos
    repos.slice(0, 5).forEach((repo) => {
      const listItem = document.createElement("li");
      listItem.classList.add("repo-item");
      listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
      reposList.appendChild(listItem);
    });
  } else {
    const listItem = document.createElement("li");
    listItem.classList.add("repo-item");
    listItem.textContent = "No public repositories found.";
    reposList.appendChild(listItem);
  }

  profileCard.classList.remove("hidden");
}

async function fetchGitHubData(username) {
  const userUrl = `https://api.github.com/users/${username}`;
  const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`; // Sort by last update

  toggleLoading(true);

  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(userUrl),
      fetch(reposUrl),
    ]);

    if (userResponse.status === 404) {
      displayError(`User "${username}" not found.`);
      return;
    }

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error("Failed to fetch data from GitHub API.");
    }

    const userData = await userResponse.json();
    const reposData = await reposResponse.json();

    displayProfile(userData, reposData);
  } catch (error) {
    console.error(error);
    displayError(
      "An error occurred while fetching data. Check your network connection."
    );
  }
}

function handleSearch() {
  const username = usernameInput.value.trim();
  if (username) {
    fetchGitHubData(username);
  } else {
    displayError("Please enter a GitHub username.");
  }
}

searchBtn.addEventListener("click", handleSearch);

usernameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// Initial instruction message
document.addEventListener("DOMContentLoaded", () => {
  errorMessage.textContent = "Start by searching for a GitHub username above!";
  errorMessage.classList.remove("hidden");
});
