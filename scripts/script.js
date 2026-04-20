const resultsDiv = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const statsText = document.getElementById("statsText");
const filterButtons = document.querySelectorAll(".filter-btn");

let shortcuts = [];
let currentFilter = "all";

async function loadShortcuts() {
  try {
    const response = await fetch("data/shortcuts.json");
    shortcuts = await response.json();
    applyFilters();
  } catch (error) {
    resultsDiv.innerHTML = `<p class="no-results">Failed to load shortcut data.</p>`;
    statsText.textContent = "Could not load data.";
    console.error("Error loading JSON:", error);
  }
}

function displayShortcuts(data) {
  resultsDiv.innerHTML = "";

  if (data.length === 0) {
    resultsDiv.innerHTML = `<p class="no-results">No shortcuts found.</p>`;
    return;
  }

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="shortcut">${item.shortcut}</div>
      <div class="action">${item.description}</div>
      <div class="owner">Added by: ${item.author}</div>
    `;

    resultsDiv.appendChild(card);
  });
}

function matchesFilter(item, filter) {
  const shortcutText = (item.shortcut || "").toLowerCase();

  if (filter === "all") return true;
  if (filter === "ctrl") return shortcutText.includes("ctrl");
  if (filter === "alt") return shortcutText.includes("alt");
  if (filter === "windows") {
    return shortcutText.includes("windows") || shortcutText.includes("win");
  }
  if (filter === "other") {
    return (
      !shortcutText.includes("ctrl") &&
      !shortcutText.includes("alt") &&
      !shortcutText.includes("windows") &&
      !shortcutText.includes("win")
    );
  }

  return true;
}

function applyFilters() {
  const keyword = searchInput.value.toLowerCase().trim();

  const filtered = shortcuts.filter((item) => {
    const matchesSearch =
      (item.shortcut || "").toLowerCase().includes(keyword) ||
      (item.description || "").toLowerCase().includes(keyword) ||
      (item.author || "").toLowerCase().includes(keyword);

    const matchesCategory = matchesFilter(item, currentFilter);

    return matchesSearch && matchesCategory;
  });

  statsText.textContent = `Showing ${filtered.length} of ${shortcuts.length} shortcuts`;
  displayShortcuts(filtered);
}

searchInput.addEventListener("input", applyFilters);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    applyFilters();
  });
});

loadShortcuts();
