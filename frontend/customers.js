function getCustomers() {
  const data = localStorage.getItem("customers");
  return data ? JSON.parse(data) : [];
}

function getLoans() {
  const data = localStorage.getItem("loans");
  return data ? JSON.parse(data) : [];
}

function getPayments() {
  const data = localStorage.getItem("payments");
  return data ? JSON.parse(data) : [];
}

function getCustomerBalance(customerId) {
  const loans = getLoans().filter((l) => String(l.customerId) === String(customerId));
  const payments = getPayments().filter((p) => String(p.customerId) === String(customerId));
  const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  return totalLoaned - totalPaid;
}

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
  const customers = getCustomers();

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
    const balance = getCustomerBalance(c.id);
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
        <p class="font-semibold text-opay-navy">${c.name}</p>
        <p class="text-sm text-gray-500">${c.phone || "No phone"}</p>
      </div>
      <p class="font-bold text-opay-navy">₦${balance.toLocaleString()}</p>
    `;
    list.appendChild(card);
  });
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  renderCustomers(e.target.value);
});

renderCustomers();
