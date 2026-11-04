const languageButton = document.querySelector(".language-switch");
const languageLabel = document.querySelector(".language-label");

function setLanguage(language) {
  document.documentElement.lang = language;

  document.querySelectorAll("[data-en][data-vi]").forEach((element) => {
    element.innerHTML = element.dataset[language];
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
