const messages = {
  valentine: "You're my semicolon; without you, I'm just an error.",
  birthday:
    "Happy birthday! May your day be filled with joy, and your code be free of syntax errors",
  anniversary:
    "After all this time, my love for you is still stronger than my WiFi signal",
  friendship: "You're the !false to my true.",
};

function flipCard() {
  document.getElementById("postcard").classList.toggle("flipped");
}

function updateMessage() {
  const occasion = document.getElementById("occasionSelect").value;
  const name = document.getElementById("recipientName").value || "my Code </>";

  // Update Front
  document.getElementById("frontRecipient").innerText = name;

  // Update Back with Typing Effect
  const msgElement = document.getElementById("poeticMessage");
  const fullText = messages[occasion];
  msgElement.innerText = "";

  let i = 0;
  function typeWriter() {
    if (i < fullText.length) {
      msgElement.innerHTML += fullText.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
  typeWriter();
}

// Theme Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// Event Listeners
document.getElementById("postcard").addEventListener("click", flipCard);
document.getElementById("recipientName").addEventListener("input", (e) => {
  document.getElementById("frontRecipient").innerText =
    e.target.value || "my Code </>";
});
