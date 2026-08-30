function getCustomerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getLoans() {
  const data = localStorage.getItem("loans");
  return data ? JSON.parse(data) : [];
}

function getPayments() {
  const data = localStorage.getItem("payments");
  return data ? JSON.parse(data) : [];
}

function formatTimestamp(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString();
}

function renderHistory(customerId) {
  const loans = getLoans()
    .filter((l) => String(l.customerId) === String(customerId))
    .map((l) => ({ type: "loan", ...l }));

  const payments = getPayments()
    .filter((p) => String(p.customerId) === String(customerId))
    .map((p) => ({ type: "payment", ...p }));

  const history = [...loans, ...payments].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );

  const historyList = document.getElementById("historyList");
  const noHistoryMsg = document.getElementById("noHistoryMsg");

  historyList.innerHTML = "";

  if (history.length === 0) {
    noHistoryMsg.classList.remove("hidden");
  } else {
    noHistoryMsg.classList.add("hidden");
  }

  history.forEach((entry) => {
    const card = document.createElement("div");

    if (entry.type === "loan") {
      card.className = "bg-green-50 border border-opay-green rounded-xl p-4";
      const reminderBtn = entry.dueDate
        ? `<a href="reminder.html?loanId=${entry.id}&customerId=${customerId}" class="block text-center bg-opay-navy text-white text-sm mt-3 py-2 rounded-xl font-semibold">Send Reminder</a>`
        : "";
      card.innerHTML = `
        <p class="text-xs font-semibold text-opay-green uppercase">Loan Given</p>
        <p class="font-semibold text-opay-navy mt-1">₦${entry.amount}</p>
        <p class="text-sm text-gray-500">Due: ${entry.dueDate || "No due date"}</p>
        <p class="text-xs text-gray-400 mt-1">${formatTimestamp(entry.createdAt)}</p>
        ${reminderBtn}
      `;
    } else {
      card.className = "bg-orange-50 border border-orange-400 rounded-xl p-4";
      card.innerHTML = `
        <p class="text-xs font-semibold text-orange-500 uppercase">Payment Received</p>
        <p class="font-semibold text-opay-navy mt-1">₦${entry.amount}</p>
        <p class="text-xs text-gray-400 mt-1">${formatTimestamp(entry.createdAt)}</p>
      `;
    }

    historyList.appendChild(card);
  });

  const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const balance = totalLoaned - totalPaid;
  document.getElementById("outstandingBalance").textContent = `₦${balance.toLocaleString()}`;
}

function loadCustomer() {
  const id = getCustomerIdFromUrl();
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const customer = customers.find((c) => String(c.id) === String(id));

  if (!customer) {
    document.getElementById("customerName").textContent = "Customer not found";
    return;
  }

  document.getElementById("customerName").textContent = customer.name;
  document.getElementById("customerPhone").textContent = customer.phone || "No phone";
  document.getElementById("customerAddress").textContent = customer.address || "";

  document.getElementById("editBtn").href = `edit-customer.html?id=${customer.id}`;
  document.getElementById("addLoanBtn").href = `add-loan.html?customerId=${customer.id}`;
  document.getElementById("recordPaymentBtn").href = `record-payment.html?customerId=${customer.id}`;
  document.getElementById("statementBtn").href = `statement.html?customerId=${customer.id}`;

  document.getElementById("deleteBtn").addEventListener("click", () => {
    const confirmed = confirm(`Delete ${customer.name}? This will also delete all their loans and payments. This cannot be undone.`);
    if (!confirmed) return;

    const pin = prompt("Enter your PIN to confirm deletion:");
    if (pin === null) return;

    const savedPin = localStorage.getItem("loginPin");
    if (pin !== savedPin) {
      alert("Incorrect PIN. Customer was not deleted.");
      return;
    }

    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    const updatedCustomers = customers.filter((c) => String(c.id) !== String(customer.id));
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));

    const loans = JSON.parse(localStorage.getItem("loans") || "[]");
    const updatedLoans = loans.filter((l) => String(l.customerId) !== String(customer.id));
    localStorage.setItem("loans", JSON.stringify(updatedLoans));

    const payments = JSON.parse(localStorage.getItem("payments") || "[]");
    const updatedPayments = payments.filter((p) => String(p.customerId) !== String(customer.id));
    localStorage.setItem("payments", JSON.stringify(updatedPayments));

    window.location.href = "customers.html";
  });

  renderHistory(customer.id);
}

loadCustomer();
