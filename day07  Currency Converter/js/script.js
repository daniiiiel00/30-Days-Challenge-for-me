const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const convertBtn = document.getElementById("convert-btn");
const swapBtn = document.getElementById("swap-btn");
const resultBox = document.getElementById("conversion-result");
const resultRateText = resultBox.querySelector(".result-rate-text");
const resultDateText = resultBox.querySelector(".result-date");
const loadingSpinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");

// New Flag Elements
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");

const API_URL = "https://open.er-api.com/v6/latest/USD";
let exchangeRates = {};

// Mapping of Currency Code to Country Code (ISO 3166-1 alpha-2)
// The flag library requires two-letter codes. For currencies shared by multiple countries, we pick one primary country.
const CURRENCY_TO_COUNTRY = {
  USD: "us",
  EUR: "eu",
  GBP: "gb",
  CAD: "ca",
  JPY: "jp",
  AUD: "au",
  CHF: "ch",
  CNY: "cn",
  SEK: "se",
  NZD: "nz",
  INR: "in",
  SGD: "sg",
  HKD: "hk",
  NOK: "no",
  KRW: "kr",
  TRY: "tr",
  RUB: "ru",
  MXN: "mx",
  BRL: "br",
  ZAR: "za",
  DKK: "dk",
  PLN: "pl",
  THB: "th",
  IDR: "id",
  HUF: "hu",
  CZK: "cz",
  ILS: "il",
  CLP: "cl",
  PHP: "ph",
  AED: "ae",
  COP: "co",
  SAR: "sa",
  MYR: "my",
  VND: "vn",
  TWD: "tw",
  ARS: "ar",
  EGP: "eg",
  PKR: "pk",
  BDT: "bd",
  KWD: "kw",
  QAR: "qa",
  OMR: "om",
  LKR: "lk",
  KES: "ke",
  GHS: "gh",
  MAD: "ma",
  XAF: "cm",
  XOF: "sn",
  BAM: "ba",
  BGN: "bg",
  HRK: "hr",
  ISK: "is",
  JMD: "jm",
  KZT: "kz",
  LAK: "la",
  LBP: "lb",
  MKD: "mk",
  MOP: "mo",
  MUR: "mu",
  NGN: "ng",
  PAB: "pa",
  PEN: "pe",
  PYG: "py",
  RON: "ro",
  RSD: "rs",
  UAH: "ua",
  UYU: "uy",
  VND: "vn",
  BHD: "bh",
  JOD: "jo",
  DZD: "dz",
  AOA: "ao",
  BZD: "bz",
  ETB: "et",
  GEL: "ge",
  IRQ: "iq",
  KGS: "kg",
  MGA: "mg",
  MMK: "mm",
  NPR: "np",
  SDG: "sd",
  TND: "tn",
  UZS: "uz",
  YER: "ye",
  ZMW: "zm",
};

function toggleLoading(show) {
  if (show) {
    loadingSpinner.classList.remove("hidden");
    resultBox.classList.add("hidden");
    errorMessage.classList.add("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
  }
}

function displayError(message) {
  toggleLoading(false);
  resultBox.classList.add("hidden");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

async function fetchRates() {
  toggleLoading(true);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates.");
    }
    const data = await response.json();

    exchangeRates = data.rates;
    const currencies = Object.keys(exchangeRates).sort();

    populateCurrencies(currencies);

    // Initial conversion after rates are loaded
    convertCurrency();
  } catch (error) {
    console.error("API Fetch Error:", error);
    displayError("Error loading exchange rates. Please check your connection.");
  } finally {
    toggleLoading(false);
  }
}

function updateFlag(currencyCode, flagElement) {
  // Get the two-letter country code (default to a generic placeholder if not found)
  const countryCode = CURRENCY_TO_COUNTRY[currencyCode] || "un"; // 'un' is often used for unknown or international

  // Clear existing flag classes
  flagElement.className = "fi";

  // Add the new flag class in the format 'fi-xx'
  flagElement.classList.add(`fi-${countryCode}`);
}

function populateCurrencies(currencies) {
  const defaultFrom = "USD";
  const defaultTo = "EUR";

  currencies.forEach((currency) => {
    const optionFrom = document.createElement("option");
    optionFrom.value = currency;
    optionFrom.textContent = currency;
    fromCurrency.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = currency;
    optionTo.textContent = currency;
    toCurrency.appendChild(optionTo);
  });

  // Set defaults
  fromCurrency.value = defaultFrom;
  toCurrency.value = defaultTo;

  // Initial flag display
  updateFlag(defaultFrom, fromFlag);
  updateFlag(defaultTo, toFlag);
}

function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  // Validation
  if (
    isNaN(amount) ||
    amount <= 0 ||
    !exchangeRates[from] ||
    !exchangeRates[to]
  ) {
    resultBox.classList.add("hidden");
    if (Object.keys(exchangeRates).length > 0) {
      displayError("Please enter a valid amount.");
    }
    return;
  }

  errorMessage.classList.add("hidden");

  const amountInUSD = amount / exchangeRates[from];
  const convertedAmount = amountInUSD * exchangeRates[to];

  const formattedAmount = convertedAmount.toFixed(2);
  const unitRate = exchangeRates[to] / exchangeRates[from];

  resultRateText.innerHTML = `${amount.toLocaleString()} ${from} = <strong>${formattedAmount.toLocaleString()} ${to}</strong>`;

  const unitConversionDisplay = `1 ${from} = ${unitRate.toFixed(4)} ${to}`;

  const lastUpdateTimestamp =
    exchangeRates.time_last_update_utc || new Date().toUTCString();

  resultDateText.innerHTML = `${unitConversionDisplay} <br> <span class="last-updated">Rates based on USD. Last updated: ${lastUpdateTimestamp}</span>`;

  resultBox.classList.remove("hidden");
}

function swapCurrencies() {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  // Swap the flags visually as well
  const tempFlagClass = fromFlag.className;
  fromFlag.className = toFlag.className;
  toFlag.className = tempFlagClass;

  convertCurrency(); // Re-calculate after swap
}

// --- Event Listeners ---

convertBtn.addEventListener("click", convertCurrency);
swapBtn.addEventListener("click", swapCurrencies);

// Auto-update conversion on input/select change (Bonus)
amountInput.addEventListener("input", convertCurrency);

fromCurrency.addEventListener("change", () => {
  updateFlag(fromCurrency.value, fromFlag);
  convertCurrency();
});

toCurrency.addEventListener("change", () => {
  updateFlag(toCurrency.value, toFlag);
  convertCurrency();
});

// Initialize the application
document.addEventListener("DOMContentLoaded", fetchRates);
