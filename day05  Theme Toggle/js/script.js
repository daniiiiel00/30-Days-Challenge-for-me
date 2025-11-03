const toggleButton = document.getElementById("theme-toggle");
const body = document.body;
const themeKey = "theme-preference";

// Check if the user's OS prefers dark mode (Bonus: System preference check)
function prefersDarkScheme() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function setTheme(theme) {
  if (theme === "dark") {
    body.setAttribute("data-theme", "dark");
    localStorage.setItem(themeKey, "dark");
  } else {
    body.setAttribute("data-theme", "light");
    localStorage.setItem(themeKey, "light");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem(themeKey);
  let initialTheme;

  if (savedTheme) {
    // Use saved preference
    initialTheme = savedTheme;
  } else {
    // Use system preference as default
    initialTheme = prefersDarkScheme() ? "dark" : "light";
  }

  setTheme(initialTheme);
}

function toggleTheme() {
  // Read the current attribute value directly from the body
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
}

// Ensure the theme is loaded immediately upon script execution
loadTheme();

// Event listener for the toggle button
toggleButton.addEventListener("click", toggleTheme);
