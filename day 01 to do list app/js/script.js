// Global DOM references
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filters = document.querySelector(".filters");
const clearAllBtn = document.getElementById("clearAllBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// --- Task Array and Local Storage Management ---

// Load tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/**
 * Saves the current tasks array to localStorage.
 */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- Rendering Tasks ---

/**
 * Renders the task list based on the current filter setting.
 */
function renderTasks() {
  // Determine the active filter
  const activeFilter =
    document.querySelector(".filter-btn.active").dataset.filter;

  // Filter the tasks array
  let filteredTasks = tasks;
  if (activeFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (activeFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  // Clear the current list
  taskList.innerHTML = "";

  // Render each filtered task
  if (filteredTasks.length === 0) {
    // Display a message if no tasks match the filter
    const message = document.createElement("p");
    message.className = "no-tasks";
    message.textContent = `No ${activeFilter} tasks found.`;
    taskList.appendChild(message);
    return;
  }

  filteredTasks.forEach((task) => {
    // Create the list item element
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.dataset.id = task.id;

    // Format the date/time string
    const dateTime = new Date(task.timestamp).toLocaleString();

    // Populate the list item with task content and buttons
    li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="task-date">Added: ${dateTime}</span>
            </div>
            <div class="task-actions">
                <button class="complete-btn" aria-label="${
                  task.completed ? "Mark as incomplete" : "Mark as complete"
                }">
                    <i class="fas ${
                      task.completed ? "fa-undo" : "fa-check"
                    }"></i>
                </button>
                <button class="edit-btn" aria-label="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" aria-label="Delete task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

    // Append the new task item to the list
    taskList.appendChild(li);
  });
}

// --- Task Operations (Add, Toggle, Edit, Delete) ---

/**
 * Handles the submission of the new task form.
 * @param {Event} e - The form submission event.
 */
function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();

  if (text === "") return;

  // Create a new task object
  const newTask = {
    id: Date.now(), // Use timestamp as a unique ID
    text: text,
    completed: false,
    timestamp: new Date().toISOString(), // Store ISO format for consistent parsing
  };

  // Add to array, save, clear input, and re-render
  tasks.unshift(newTask); // Add to the beginning for LIFO (Last-In, First-Out) view
  saveTasks();
  taskInput.value = "";

  // Immediately render to show the new task with animation
  renderTasks();
}

/**
 * Handles all button clicks within the task list.
 * @param {Event} e - The click event.
 */
function handleTaskActions(e) {
  const target = e.target.closest("button");
  if (!target) return;

  const li = target.closest(".task-item");
  const taskId = parseInt(li.dataset.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) return;

  // Toggle Complete/Incomplete
  if (target.classList.contains("complete-btn")) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasks();
    renderTasks(); // Re-render to update UI and filtering
  }
  // Delete Task
  else if (target.classList.contains("delete-btn")) {
    // Add a class for a smooth removal animation
    li.style.transform = "translateX(-100%)";
    li.style.opacity = "0";

    // Wait for the transition to finish before removal
    li.addEventListener("transitionend", () => {
      tasks.splice(taskIndex, 1);
      saveTasks();
      renderTasks();
    });
  }
  // Edit Task
  else if (target.classList.contains("edit-btn")) {
    editTask(li, taskIndex);
  }
}

/**
 * Handles the task editing functionality.
 * @param {HTMLElement} li - The task list item element.
 * @param {number} taskIndex - The index of the task in the tasks array.
 */
function editTask(li, taskIndex) {
  const taskTextSpan = li.querySelector(".task-text");
  const originalText = tasks[taskIndex].text;

  // Replace span with an input field
  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;
  input.classList.add("edit-input"); // Optional: for custom styling

  // Replace the task text with the input field
  taskTextSpan.replaceWith(input);
  input.focus();

  // Find the edit button and replace it with a save button
  const editButton = li.querySelector(".edit-btn");
  editButton.innerHTML = '<i class="fas fa-save"></i>';
  editButton.classList.remove("edit-btn");
  editButton.classList.add("save-btn");
  editButton.setAttribute("aria-label", "Save changes");

  /**
   * Finalizes the edit process by saving or discarding changes.
   * @param {boolean} save - True to save, false to discard.
   */
  const finalizeEdit = (save) => {
    const newText = input.value.trim();

    // Save the new text if provided and different from original
    if (save && newText !== "" && newText !== originalText) {
      tasks[taskIndex].text = newText;
      saveTasks();
    }

    // Revert UI: replace input with updated text span
    const newSpan = document.createElement("span");
    newSpan.className = "task-text";
    newSpan.textContent = tasks[taskIndex].text; // Use the potentially updated text
    input.replaceWith(newSpan);

    // Revert buttons: replace save button with edit button
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.remove("save-btn");
    editButton.classList.add("edit-btn");
    editButton.setAttribute("aria-label", "Edit task");

    // Re-attach the main click handler (since the element changed)
    taskList.removeEventListener("click", handleTaskActions);
    taskList.addEventListener("click", handleTaskActions);

    // If not saving, ensure list is re-rendered to reflect original state if necessary
    if (!save) renderTasks();
  };

  // Save on button click
  const saveHandler = () => {
    finalizeEdit(true);
  };
  editButton.removeEventListener("click", saveHandler); // Remove previous to prevent duplication
  editButton.addEventListener("click", saveHandler, { once: true }); // Use once for auto-cleanup

  // Save on 'Enter' key press
  input.addEventListener(
    "keyup",
    (e) => {
      if (e.key === "Enter") {
        finalizeEdit(true);
      } else if (e.key === "Escape") {
        finalizeEdit(false);
      }
    },
    { once: true }
  );
}

// --- Filtering and Utility ---

/**
 * Handles the clicking of filter buttons.
 * @param {Event} e - The click event.
 */
function handleFilterChange(e) {
  const target = e.target;
  if (target.classList.contains("filter-btn")) {
    // Remove 'active' class from all buttons
    document
      .querySelectorAll(".filter-btn")
      .forEach((btn) => btn.classList.remove("active"));

    // Add 'active' class to the clicked button
    target.classList.add("active");

    // Re-render the tasks with the new filter
    renderTasks();
  }
}

/**
 * Deletes all tasks from the array and local storage.
 */
function clearAllTasks() {
  if (
    tasks.length > 0 &&
    confirm(
      "Are you sure you want to delete all tasks? This action cannot be undone."
    )
  ) {
    // Add a transition class to all items for a fade-out effect
    document.querySelectorAll(".task-item").forEach((li) => {
      li.style.opacity = "0";
    });

    // Clear after a small delay to allow animation
    setTimeout(() => {
      tasks = [];
      saveTasks();
      renderTasks();
    }, 500);
  }
}

// --- Dark Mode Functionality ---

/**
 * Saves the user's dark mode preference to localStorage.
 * @param {boolean} isDarkMode - The current mode state.
 */
function saveDarkModePreference(isDarkMode) {
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
}

/**
 * Loads the dark mode preference from localStorage and applies it.
 */
function loadDarkModePreference() {
  const preference = localStorage.getItem("darkMode");
  // If preference is 'enabled', or not set and user's system prefers dark mode
  if (
    preference === "enabled" ||
    (!preference && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    body.classList.add("dark-mode");
    // Update the icon to sun
    darkModeToggle.querySelector("i").className = "fas fa-sun";
  } else {
    // Update the icon to moon
    darkModeToggle.querySelector("i").className = "fas fa-moon";
  }
}

/**
 * Toggles the dark mode on and off.
 */
function toggleDarkMode() {
  const isDark = body.classList.toggle("dark-mode");
  saveDarkModePreference(isDark);

  // Update the icon
  darkModeToggle.querySelector("i").className = isDark
    ? "fas fa-sun"
    : "fas fa-moon";
}

// --- Event Listeners and Initialization ---

// Form submission to add new task
taskForm.addEventListener("submit", addTask);

// Click listeners for task actions (toggle, delete, edit)
taskList.addEventListener("click", handleTaskActions);

// Click listeners for filter buttons
filters.addEventListener("click", handleFilterChange);

// Click listener for Clear All button
clearAllBtn.addEventListener("click", clearAllTasks);

// Click listener for Dark Mode toggle
darkModeToggle.addEventListener("click", toggleDarkMode);

// Initialization: Load dark mode preference and render the tasks on page load
document.addEventListener("DOMContentLoaded", () => {
  loadDarkModePreference();
  renderTasks();
});
