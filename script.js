const coins = ["bitcoin", "ethereum", "dogecoin", "litecoin"];
const grid = document.getElementById("cryptoGrid");
const errorEl = document.getElementById("error");
const statusEl = document.getElementById("status");

async function fetchPrices() {
  try {
    statusEl.textContent = "Updating prices...";
    errorEl.textContent = "";

    const ids = coins.join(",");
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    grid.innerHTML = "";

    coins.forEach(id => {
      const coin = data[id];
      if (!coin) return;

      const change = coin.usd_24h_change || 0;
      const changeClass = change >= 0 ? "up" : "down";

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h2>${id.toUpperCase()}</h2>
        <div class="price">$${coin.usd.toFixed(2)}</div>
        <div class="change ${changeClass}">${change.toFixed(2)}%</div>
      `;

      grid.appendChild(div);
    });

    const time = new Date().toLocaleTimeString();
    statusEl.textContent = `Last updated: ${time} (auto refresh every 30s)`;
  } catch (err) {
    console.error(err);
    errorEl.textContent =
      "⚠️ Unable to load crypto prices. If opening from file, try running with Live Server.";
    statusEl.textContent = "Update failed";
  }
}

function startAutoRefresh() {
  fetchPrices();
  setInterval(fetchPrices, 30000);
}

window.onload = startAutoRefresh;
