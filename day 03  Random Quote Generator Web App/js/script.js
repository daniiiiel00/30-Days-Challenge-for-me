const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote-btn");
const copyBtn = document.getElementById("copy-btn");
const twitterBtn = document.getElementById("twitter-btn");
const loaderContainer = document.querySelector(".loader-container");
const quoteContent = document.querySelector(".quote-content");
const body = document.body;

let quotes = [];
let currentQuote = { text: "", author: "" };

const API_URL = "https://type.fit/api/quotes";
const LOCAL_STORAGE_KEY = "lastQuote";

const backgroundColors = [
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
  "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)",
  "linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)",
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(135deg, #a7acd9 0%, #d8e2dc 100%)",
  "linear-gradient(135deg, #ffc796 0%, #ff839b 100%)",
];

async function fetchQuotes() {
  showLoadingSpinner();
  try {
    const response = await fetch(API_URL);
    quotes = await response.json();
  } catch (error) {
    console.error("Error fetching quotes:", error);
    quotes = getFallbackQuotes();
  } finally {
    hideLoadingSpinner();
    loadLastQuote();
  }
}

function getFallbackQuotes() {
  return [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      text: "Strive not to be a success, but rather to be of value.",
      author: "Albert Einstein",
    },
    {
      text: "The mind is everything. What you think you become.",
      author: "Buddha",
    },
    {
      text: "lemanm jela ras belh kithn atetateb .",
      author: "Daniel-melese",
    },
  ];
}

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function displayQuote() {
  quoteContent.classList.add("hidden");

  setTimeout(() => {
    let quote = getRandomQuote();

    currentQuote.text = quote.text;
    currentQuote.author = quote.author || "Unknown";

    quoteText.textContent = currentQuote.text;
    quoteAuthor.textContent = `— ${currentQuote.author}`;

    saveLastQuote();

    quoteContent.classList.remove("hidden");
    changeBackground();
  }, 500);
}

function copyQuote() {
  navigator.clipboard
    .writeText(`${currentQuote.text} ${currentQuote.author}`)
    .then(() => {
      alert("Quote copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy quote: ", err);
    });
}

function shareOnTwitter() {
  const tweetText = `${currentQuote.text} — ${currentQuote.author}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;
  window.open(twitterUrl, "_blank");
}

function changeBackground() {
  const randomColor =
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
  body.style.background = randomColor;
}

function showLoadingSpinner() {
  loaderContainer.style.display = "flex";
  quoteContent.classList.add("hidden");
}

function hideLoadingSpinner() {
  loaderContainer.style.display = "none";
  quoteContent.classList.remove("hidden");
}

function saveLastQuote() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentQuote));
}

function loadLastQuote() {
  const storedQuote = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedQuote) {
    currentQuote = JSON.parse(storedQuote);
    quoteText.textContent = currentQuote.text;
    quoteAuthor.textContent = `— ${currentQuote.author}`;
  } else {
    displayQuote();
  }
  changeBackground();
}

newQuoteBtn.addEventListener("click", displayQuote);
copyBtn.addEventListener("click", copyQuote);
twitterBtn.addEventListener("click", shareOnTwitter);

fetchQuotes();
