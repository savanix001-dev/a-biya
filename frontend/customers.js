const urlParams = new URLSearchParams(window.location.search);
const action = urlParams.get("action");

const banner = document.getElementById("actionBanner");
if (action === "addLoan") {
  banner.textContent = "Select a customer to add a loan for";
  banner.classList.remove("hidden");
} else if (action === "recordPayment") {
  banner.textContent = "Select a customer to record a payment for";
  banner.classList.remove("hidden");
}

function renderCustomers(filter = "") {
  const list = document.getElementById("customerList");
  const emptyMsg = document.getElementById("emptyMsg");
  const customers = getLocal("local_customers");

  const filtered = customers.filter((c) => {
    const term = filter.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.phone && c.phone.toLowerCase().includes(term))
    );
  });

  list.innerHTML = "";

  if (filtered.length === 0) {
    emptyMsg.classList.remove("hidden");
  } else {
    emptyMsg.classList.add("hidden");
  }

  filtered.forEach((c) => {
    const balance = Number(c.balance || 0);
    const card = document.createElement("a");

    if (action === "addLoan") {
      card.href = `add-loan.html?customerId=${c.id}`;
    } else if (action === "recordPayment") {
      card.href = `record-payment.html?customerId=${c.id}`;
    } else {
      card.href = `customer-detail.html?id=${c.id}`;
    }

    card.className = "block bg-white rounded-xl shadow p-4 flex justify-between items-center";
    card.innerHTML = `
      <div>
        <p class="font-semibold text-opay-navy">${c.name}${c.synced === false ? " (syncing...)" : ""}</p>
        <p class="text-sm text-gray-500">${c.phone || "No phone"}</p>
      </div>
      <p class="font-bold text-opay-navy">₦${balance.toLocaleString()}</p>
    `;
    list.appendChild(card);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showSyncError() {
  const banner = document.getElementById("syncErrorBanner");
  if (banner) banner.classList.remove("hidden");
}

async function refreshFromBackend(attempt = 1) {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const MAX_ATTEMPTS = 3;

  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "login-pin.html";
      return;
    }

    if (!response.ok) {
      if (attempt < MAX_ATTEMPTS) {
        await sleep(1500);
        return refreshFromBackend(attempt + 1);
      }
      showSyncError();
      return;
    }

    const freshCustomers = await response.json();
    const freshCustomersWithSyncFlag = freshCustomers.map(c => ({ ...c, synced: true }));

    const local = getLocal("local_customers");

    const syncedLocalIds = new Set(
      freshCustomers.filter(c => c.client_reference).map(c => c.client_reference)
    );

    const stillUnsyncedLocalOnly = local.filter(
      c => c.synced === false && !syncedLocalIds.has(c.id)
    );

    setLocal("local_customers", [...freshCustomersWithSyncFlag, ...stillUnsyncedLocalOnly]);
    renderCustomers(document.getElementById("searchInput").value);
  } catch (error) {
    // Offline or unreachable - silently keep showing local data
  }
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  renderCustomers(e.target.value);
});

renderCustomers();
refreshFromBackend();
