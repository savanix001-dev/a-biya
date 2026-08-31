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

function checkPin() {
  const pin = prompt("Enter your PIN to confirm:");
  if (pin === null) return false;
  const savedPin = localStorage.getItem("loginPin");
  if (pin !== savedPin) {
    alert("Incorrect PIN. Action cancelled.");
    return false;
  }
  return true;
}

function deleteLoan(loanId, customerId) {
  const confirmed = confirm("Delete this loan entry? This cannot be undone.");
  if (!confirmed) return;
  if (!checkPin()) return;

  const loans = getLoans().filter((l) => String(l.id) !== String(loanId));
  localStorage.setItem("loans", JSON.stringify(loans));
  renderHistory(customerId);
}

function deletePayment(paymentId, customerId) {
  const confirmed = confirm("Delete this payment entry? This cannot be undone.");
  if (!confirmed) return;
  if (!checkPin()) return;

  const payments = getPayments().filter((p) => String(p.id) !== String(paymentId));
  localStorage.setItem("payments", JSON.stringify(payments));
  renderHistory(customerId);
}

function editLoan(loanId, customerId) {
  const loans = getLoans();
  const loan = loans.find((l) => String(l.id) === String(loanId));
  if (!loan) return;

  const newAmount = prompt("Edit amount (₦):", loan.amount);
  if (newAmount === null) return;
  if (newAmount.trim() === "" || Number(newAmount) <= 0) {
    alert("Invalid amount. No changes made.");
    return;
  }

  const newDueDate = prompt("Edit due date (YYYY-MM-DD), leave blank for none:", loan.dueDate || "");
  if (newDueDate === null) return;

  if (!checkPin()) return;

  const index = loans.findIndex((l) => String(l.id) === String(loanId));
  loans[index].amount = newAmount.trim();
  loans[index].dueDate = newDueDate.trim() || null;
  localStorage.setItem("loans", JSON.stringify(loans));
  renderHistory(customerId);
}

function editPayment(paymentId, customerId) {
  const payments = getPayments();
  const payment = payments.find((p) => String(p.id) === String(paymentId));
  if (!payment) return;

  const newAmount = prompt("Edit amount paid (₦):", payment.amount);
  if (newAmount === null) return;
  if (newAmount.trim() === "" || Number(newAmount) <= 0) {
    alert("Invalid amount. No changes made.");
    return;
  }

  if (!checkPin()) return;

  const index = payments.findIndex((p) => String(p.id) === String(paymentId));
  payments[index].amount = newAmount.trim();
  localStorage.setItem("payments", JSON.stringify(payments));
  renderHistory(customerId);
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
      const reminderBtn = `<a href="reminder.html?loanId=${entry.id}&customerId=${customerId}" class="block text-center bg-opay-navy text-white text-sm mt-3 py-2 rounded-xl font-semibold">Send Reminder</a>`;
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <p class="text-xs font-semibold text-opay-green uppercase">Loan Given</p>
          <div class="flex gap-3">
            <button class="edit-loan-btn text-xs text-opay-navy font-semibold">Edit</button>
            <button class="delete-loan-btn text-xs text-red-500 font-semibold">Delete</button>
          </div>
        </div>
        <p class="font-semibold text-opay-navy mt-1">₦${entry.amount}</p>
        <p class="text-sm text-gray-500">Due: ${entry.dueDate || "No due date"}</p>
        ${entry.item ? `<p class="text-sm text-gray-500">Item: ${entry.item}</p>` : ""}
        <p class="text-xs text-gray-400 mt-1">${formatTimestamp(entry.createdAt)}</p>
        ${reminderBtn}
      `;
      card.querySelector(".edit-loan-btn").addEventListener("click", () => editLoan(entry.id, customerId));
      card.querySelector(".delete-loan-btn").addEventListener("click", () => deleteLoan(entry.id, customerId));
    } else {
      card.className = "bg-orange-50 border border-orange-400 rounded-xl p-4";
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <p class="text-xs font-semibold text-orange-500 uppercase">Payment Received</p>
          <div class="flex gap-3">
            <button class="edit-payment-btn text-xs text-opay-navy font-semibold">Edit</button>
            <button class="delete-payment-btn text-xs text-red-500 font-semibold">Delete</button>
          </div>
        </div>
        <p class="font-semibold text-opay-navy mt-1">₦${entry.amount}</p>
        <p class="text-xs text-gray-400 mt-1">${formatTimestamp(entry.createdAt)}</p>
      `;
      card.querySelector(".edit-payment-btn").addEventListener("click", () => editPayment(entry.id, customerId));
      card.querySelector(".delete-payment-btn").addEventListener("click", () => deletePayment(entry.id, customerId));
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
    if (!checkPin()) return;

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
