const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPass = document.getElementById("confirm");

function setError(input, message) {
  input.nextElementSibling.textContent = message;
}

function clearError(input) {
  input.nextElementSibling.textContent = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (username.value.trim() === "") setError(username, "Username required");
  else clearError(username);

  if (email.value.trim() === "") setError(email, "Email required");
  else if (!email.value.includes("@")) setError(email, "Invalid email");
  else clearError(email);

  if (password.value.trim() === "") setError(password, "Password required");
  else if (password.value.length < 6) setError(password, "Min 6 characters");
  else clearError(password);

  if (confirmPass.value.trim() === "")
    setError(confirmPass, "Confirm password");
  else if (confirmPass.value !== password.value)
    setError(confirmPass, "Passwords do not match");
  else clearError(confirmPass);
});
