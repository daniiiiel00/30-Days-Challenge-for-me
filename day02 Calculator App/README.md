# 🧮 Modern Calculator Web App

A clean, modern, and fully responsive **Calculator Web Application** built with **HTML, CSS, and JavaScript**.  
This app performs all basic arithmetic operations with a user-friendly design and smooth animations.

---

## 🚀 Features

- ➕ Perform basic arithmetic operations: Add, Subtract, Multiply, Divide
- 🧹 Clear (`C`) and Delete (`DEL`) functions
- ⌨️ Keyboard input support for fast calculation
- 📱 Fully **responsive layout** for mobile and desktop
- 🌗 **Dark/Light Mode Toggle** (optional feature)
- 🧠 **Error handling** for invalid operations (like division by zero)
- 💾 Option to **save theme preference** in `localStorage`
- 🎨 **Animated buttons** and clean grid layout

---

## 🧩 Tech Stack

- **HTML5** – Structure and display
- **CSS3** – Styling, grid layout, and responsiveness
- **JavaScript (ES6)** – Calculator logic and event handling

---

## 📂 Project Structure

```folder
📁 modern-calculator-webapp
│
├── index.html # Main layout structure
├── style.css # Styling and responsive grid
├── script.js # Calculator logic and functionality
└── README.md # Documentation
```

---

## ⚙️ Installation & Usage

1. **Clone the repository**

   ```bash
   git clone https://github.com/daniiiiel00/30-Days-Challenge-for-me.git

   ```

## 2, Open the project folder

cd modern-calculator-webapp

## 3, Run the app

Open index.html in your browser.

## 💡 How It Works

Each button triggers an event in script.js that updates the display and current expression.

When = is pressed, the expression is evaluated using JavaScript logic and displayed as a result.

The Clear button resets the calculator; DEL removes the last input character.

Optional dark mode toggle stores the user’s preference using localStorage.

## 🧠 Example Code Snippet

```js
// Example of handling button click
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;
    if (value === "=") {
      try {
        display.value = eval(display.value);
      } catch {
        display.value = "Error";
      }
    } else if (value === "C") {
      display.value = "";
    } else {
      display.value += value;
    }
  });
});
```

## 🪄 Future Enhancements

🧾 Add calculation history feature

📊 Include percentage (%) and square root (√) functions

☁️ Add PWA (Progressive Web App) support for offline use

🎤 Voice input for numbers and operations

## 🤝 Contributing

Contributions, suggestions, and feature requests are welcome!
Feel free to fork the repository and submit a pull request.

## 📜 License

This project is licensed under the MIT License – free to use and modify.

## 👨‍💻 Author

Daniel Melese
🎓 Diploma in Web Development & Database Administration
