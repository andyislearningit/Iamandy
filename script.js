const languageButton = document.querySelector(".language-switch");
const languageLabel = document.querySelector(".language-label");
const introLink = document.querySelector(".primary-button");
const heroTitle = document.querySelector(".hero-title");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setLanguage(language) {
  document.documentElement.lang = language;

  document.querySelectorAll("[data-en][data-vi]").forEach((element) => {
    element.innerHTML = element.dataset[language];
  });

  document.querySelectorAll("[data-en-alt][data-vi-alt]").forEach((element) => {
    element.alt = element.dataset[`${language}Alt`];
  });

  const nextLanguage = language === "en" ? "vi" : "en";
  languageLabel.textContent = nextLanguage === "vi" ? "Tiếng Việt" : "English";
  languageButton.setAttribute(
    "aria-label",
    nextLanguage === "vi" ? "Switch to Vietnamese" : "Switch to English"
  );
}

languageButton.addEventListener("click", () => {
  setLanguage(document.documentElement.lang === "en" ? "vi" : "en");
});

introLink.addEventListener("click", (event) => {
  if (prefersReducedMotion.matches) return;

  event.preventDefault();
  heroTitle.classList.remove("is-animating");
  void heroTitle.offsetWidth;
  heroTitle.classList.add("is-animating");
});

heroTitle.addEventListener("animationend", (event) => {
  if (event.animationName !== "headline-welcome") return;

  heroTitle.classList.remove("is-animating");
  window.location.hash = "about";
});
