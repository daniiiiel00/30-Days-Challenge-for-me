document.addEventListener("DOMContentLoaded", () => {
  // --- Global State & Element References ---
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const allInputs = document.querySelectorAll(".input-field");

  // --- Theme Management ---
  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    icon.className = theme === "dark" ? "bx bxs-sun" : "bx bxs-moon";
  }

  function toggleTheme() {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    body.setAttribute("data-theme", newTheme);
    updateThemeIcon(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    body.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  }

  themeToggle.addEventListener("click", toggleTheme);
  loadTheme();

  // --- Form Switching Logic ---
  window.switchForm = function (target) {
    event.preventDefault();

    const isLogin = target === "login";
    const incomingForm = isLogin ? loginForm : registerForm;
    const outgoingForm = isLogin ? registerForm : loginForm;

    // 1. Hide the outgoing form
    outgoingForm.classList.remove("form-visible");
    outgoingForm.classList.add("form-hidden");

    // 2. Wait for transition to finish, then show incoming form
    setTimeout(() => {
      incomingForm.classList.remove("form-hidden");
      incomingForm.classList.add("form-visible");

      // Clear state when switching
      clearFormMessages(incomingForm);
      clearAllValidation(incomingForm);
      checkFormValidity(incomingForm);
    }, 300);
  };

  // --- Validation Logic ---
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  window.clearValidation = function (input) {
    input.classList.remove("invalid");
    input.closest(".input-group").classList.remove("shake");
    const msg = input
      .closest(".input-group")
      .querySelector(".validation-message");
    if (msg) {
      msg.classList.add("hidden");
    }
  };

  function setValidation(input, message) {
    input.classList.add("invalid");
    input.closest(".input-group").classList.add("shake");
    const msg = input
      .closest(".input-group")
      .querySelector(".validation-message");
    if (msg) {
      msg.textContent = message;
      msg.classList.remove("hidden");
    }
  }

  window.validateInput = function (input) {
    clearValidation(input);

    if (input.hasAttribute("required") && input.value.trim() === "") {
      setValidation(
        input,
        `${input.previousElementSibling.textContent
          .split("(")[0]
          .trim()} is required.`
      );
      return false;
    }

    if (input.type === "email" && !EMAIL_REGEX.test(input.value)) {
      setValidation(input, "Invalid email format.");
      return false;
    }

    if (
      input.id.includes("password") &&
      input.value.length > 0 &&
      input.value.length < 6
    ) {
      setValidation(input, "Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  function checkFormValidity(form) {
    let allValid = true;
    let allFilled = true;
    const inputs = form.querySelectorAll(".input-field");

    inputs.forEach((input) => {
      if (!validateInput(input)) {
        allValid = false;
      }
      if (input.hasAttribute("required") && input.value.trim() === "") {
        allFilled = false;
      }
    });

    const button = form.querySelector(".submit-button");

    if (allFilled && allValid) {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", "true");
    }
    return allFilled && allValid;
  }

  function clearAllValidation(form) {
    form
      .querySelectorAll(".input-field")
      .forEach((input) => clearValidation(input));
  }

  // Add event listeners to all input fields
  allInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const form = input.closest("form");
      checkFormValidity(form);
      // Optional: validate on input to show immediate feedback
      validateInput(input);
    });
    input.addEventListener("blur", () => {
      validateInput(input);
      checkFormValidity(input.closest("form"));
    });
  });

  // Initial check to disable buttons if fields are empty on load
  checkFormValidity(loginForm);
  checkFormValidity(registerForm);

  // --- Message Handling ---
  function showFormMessage(form, message, isError = false) {
    const messageEl = form.querySelector(".form-message-area");
    messageEl.textContent = message;
    messageEl.style.color = isError
      ? "var(--error-color)"
      : "var(--primary-color)";
  }

  function clearFormMessages(form) {
    const messageEl = form.querySelector(".form-message-area");
    messageEl.textContent = "";
    messageEl.style.color = "";
  }

  // --- API Simulation Logic ---
  function setFormLoading(form, isLoading) {
    const button = form.querySelector(".submit-button");
    const textEl = form.querySelector(`#${form.id.replace("-form", "-text")}`);
    const spinnerEl = form.querySelector(
      `#${form.id.replace("-form", "-spinner")}`
    );

    if (isLoading) {
      button.setAttribute("disabled", "true");
      textEl.textContent = "Processing...";
      spinnerEl.classList.remove("hidden");
    } else {
      button.removeAttribute("disabled");
      textEl.textContent = form.id.includes("login") ? "Login" : "Register";
      spinnerEl.classList.add("hidden");
      checkFormValidity(form);
    }
  }

  async function simulateApiCall(type, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated error case for registration
        if (type === "register" && data.email === "error@test.com") {
          resolve({
            success: false,
            message: `The email ${data.email} is already taken.`,
          });
          // Simulated successful login
        } else if (
          type === "login" &&
          data.email === "user@test.com" &&
          data.password === "password123"
        ) {
          resolve({
            success: true,
            message: `Login successful! Welcome back, user.`,
          });
          // Simulated login failure
        } else if (type === "login") {
          resolve({ success: false, message: "Invalid email or password." });
          // Simulated successful registration
        } else {
          resolve({
            success: true,
            message: `Registration successful! Please log in.`,
          });
        }
      }, 1500); // 1.5 second loading delay
    });
  }

  window.handleAuth = async function (event, type) {
    event.preventDefault();
    const form = event.target;

    const isValid = checkFormValidity(form);
    if (!isValid) {
      form.querySelectorAll(".input-field").forEach((input) => {
        if (!validateInput(input))
          input.closest(".input-group").classList.add("shake");
      });
      return;
    }

    clearFormMessages(form);
    setFormLoading(form, true);

    const email = form.querySelector(`[type="email"]`).value;
    const password = form.querySelector(`[type="password"]`).value;
    const nameInput = form.querySelector(`[type="text"]`);
    const name = nameInput ? nameInput.value : null;

    const data = { email, password, name };

    try {
      const result = await simulateApiCall(type, data);

      if (result.success) {
        showFormMessage(form, result.message, false);
        if (type === "register") {
          // Automatically switch to login on successful registration
          setTimeout(() => switchForm("login"), 2000);
        }
      } else {
        showFormMessage(form, result.message, true);
      }
    } catch (error) {
      showFormMessage(form, "A network error occurred.", true);
    } finally {
      setFormLoading(form, false);
    }
  };
});
