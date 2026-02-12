/* dσilystats – application logic */

(function () {
  "use strict";

  const ROLLOVER_HOUR = 6;

  const PROBLEMS_BY_MONTH = window.PROBLEMS_BY_MONTH || {};
  const PROBLEMS_FEBRUARY = window.PROBLEMS_FEBRUARY || [];

  function getYYYYMMDD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getProblemDate(now) {
    const d = new Date(now);
    if (d.getHours() < ROLLOVER_HOUR) d.setDate(d.getDate() - 1);
    return d;
  }

  function getNextRollover(now) {
    const next = new Date(now);
    if (next.getHours() >= ROLLOVER_HOUR) next.setDate(next.getDate() + 1);
    next.setHours(ROLLOVER_HOUR, 0, 0, 0);
    return next;
  }

  function getProblemsForMonth(year, month) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    return PROBLEMS_BY_MONTH[key] || PROBLEMS_FEBRUARY;
  }

  function pickProblemForDate(date) {
    const problems = getProblemsForMonth(date.getFullYear(), date.getMonth() + 1);
    const day = date.getDate();
    const idx = (day - 1) % problems.length;
    return problems[idx];
  }

  function formatTimeLeft(ms) {
    if (ms <= 0) return "Next problem soon";
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const h = Math.floor(ms / 3600000);
    if (h > 0) return `Next in ${h}h ${m}m ${s}s`;
    if (m > 0) return `Next in ${m}m ${s}s`;
    return `Next in ${s}s`;
  }

  function renderProblem(problem, dateStr) {
    document.getElementById("todayLabel").textContent = dateStr;
    document.getElementById("problemId").textContent = `problem ${problem.id}`;
    document.getElementById("problemTitle").textContent = problem.title;
    document.getElementById("problemStatement").innerHTML = problem.statement.trim();
    document.getElementById("problemHint").innerHTML = (problem.hint || "").trim();
    document.getElementById("problemSolution").innerHTML = (problem.solution || "").trim();

    document.getElementById("hintBox").style.display = problem.hint ? "block" : "none";
    document.getElementById("solutionBox").style.display = problem.solution ? "block" : "none";

    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise();
    }
  }

  function updateTimeLeft() {
    const now = new Date();
    const next = getNextRollover(now);
    const ms = next - now;
    document.getElementById("timeLeft").textContent = formatTimeLeft(ms);
  }

  const THEME_KEY = "dailystats.theme";
  let themeToggle;
  let sunIcon;
  let moonIcon;

  function updateThemeIcons(mode) {
    const isDark = mode === "dark";
    sunIcon.style.display = isDark ? "none" : "block";
    moonIcon.style.display = isDark ? "block" : "none";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    themeToggle.title = isDark ? "theme: dark" : "theme: light";
  }

  function setTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    updateThemeIcons(mode);
  }

  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = cur === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    setTheme(next);
  }

  function init() {
    themeToggle = document.getElementById("themeToggle");
    sunIcon = document.getElementById("sunIcon");
    moonIcon = document.getElementById("moonIcon");

    const now = new Date();
    const params = new URLSearchParams(location.search);
    const dateParam = params.get("date");
    let problemDate;
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      const [y, m, d] = dateParam.split("-").map(Number);
      problemDate = new Date(y, m - 1, d);
    } else {
      problemDate = getProblemDate(now);
    }
    const dateStr = getYYYYMMDD(problemDate);

    setTheme(getInitialTheme());

    const problem = pickProblemForDate(problemDate);
    renderProblem(problem, dateStr);

    updateTimeLeft();
    setInterval(updateTimeLeft, 1000);

    themeToggle.addEventListener("click", toggleTheme);

    document.getElementById("copyLink").addEventListener("click", async function (e) {
      e.preventDefault();
      const url = new URL(location.href);
      url.searchParams.set("date", dateStr);
      try {
        await navigator.clipboard.writeText(url.toString());
        const el = document.getElementById("copyLink");
        el.textContent = "link copied ✓";
        setTimeout(function () {
          el.textContent = "copy problem link";
        }, 1500);
      } catch (err) {
        prompt("Copy the link:", url.toString());
      }
    });

    if (!dateParam) {
      const url = new URL(location.href);
      url.searchParams.set("date", dateStr);
      history.replaceState(null, "", url.toString());
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
