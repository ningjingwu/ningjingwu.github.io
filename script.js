// Footer year + theme toggle (light/dark)
(() => {
  const root = document.documentElement;

  // Year
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Load saved theme (or system preference)
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  } else {
    root.setAttribute("data-theme", "light");
  }

  // Toggle
const btn = document.querySelector("[data-theme-toggle]");
const icon = btn ? btn.querySelector("span") : null;

const setIcon = () => {
  if (!icon) return;
  icon.textContent = root.getAttribute("data-theme") === "dark" ? "☾" : "◐";
};

setIcon();

if (btn) {
  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setIcon();
  });
}
})();