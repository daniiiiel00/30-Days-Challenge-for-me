const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const copyButtons = document.querySelectorAll(".copy-btn");
const copyAlert = document.getElementById("copy-alert");

const THEME_KEY = "animation-theme";

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

// --- Copy Logic ---
function copyCssSelector(targetSelector) {
  // This function simulates copying the selector itself (e.g., '.btn-slide')
  navigator.clipboard
    .writeText(targetSelector)
    .then(() => {
      copyAlert.classList.add("show");
      setTimeout(() => {
        copyAlert.classList.remove("show");
      }, 1500);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

// --- Initialization ---
loadTheme();
themeToggle.addEventListener("click", toggleTheme);

copyButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const targetSelector = e.currentTarget.dataset.target;
    copyCssSelector(targetSelector);
  });
});
