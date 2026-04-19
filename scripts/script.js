console.log("JS loaded");
const resultsDiv = document.getElementById("results");
const searchInput = document.getElementById("searchInput");

let shortcuts = [];

// Load JSON data with Fetch API
async function loadShortcuts() {
  try {
    const response = await fetch("data/shortcuts.json");
    shortcuts = await response.json();
    displayShortcuts(shortcuts);
  } catch (error) {
    resultsDiv.innerHTML = `<p class="no-results">Failed to load shortcut data.</p>`;
    console.error("Error loading JSON:", error);
  }
}

// Show shortcuts on page
function displayShortcuts(data) {
  resultsDiv.innerHTML = "";

  if (data.length === 0) {
    resultsDiv.innerHTML = `<p class="no-results">No shortcuts found.</p>`;
    return;
  }

  data.forEach(item => {
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

// Search function
searchInput.addEventListener("input", () => {

//if (!shortcuts.length) return;

  const keyword = searchInput.value.toLowerCase();

  console.log("Typed:", keyword);
  console.log("Shortcuts loaded:", shortcuts.length);

  const filtered = shortcuts.filter(item =>
    (item.shortcut || "").toLowerCase().includes(keyword) ||
    (item.description || "").toLowerCase().includes(keyword) ||
    (item.author || "").toLowerCase().includes(keyword)
  );

  console.log("Filtered results:", filtered.length);

  displayShortcuts(filtered);
});

loadShortcuts();
