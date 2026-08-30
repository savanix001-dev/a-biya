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

function renderLoans(customerId) {
  const loans = getLoans().filter((l) => String(l.customerId) === String(customerId));
  const payments = getPayments().filter((p) => String(p.customerId) === String(customerId));

  const loanList = document.getElementById("loanList");
  const noLoansMsg = document.getElementById("noLoansMsg");

  loanList.innerHTML = "";

  if (loans.length === 0) {
    noLoansMsg.classList.remove("hidden");
  } else {
    noLoansMsg.classList.add("hidden");
  }

  loans.forEach((loan) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4";
    card.innerHTML = `
      <p class="font-semibold text-opay-navy">₦${loan.amount}</p>
      <p class="text-sm text-gray-500">Due: ${loan.dueDate || "No due date"}</p>
      <p class="text-xs text-gray-400 mt-1">Added: ${formatTimestamp(loan.createdAt)}</p>
    `;
    loanList.appendChild(card);
  });

  const paymentList = document.getElementById("paymentList");
  const noPaymentsMsg = document.getElementById("noPaymentsMsg");

  paymentList.innerHTML = "";

  if (payments.length === 0) {
    noPaymentsMsg.classList.remove("hidden");
  } else {
    noPaymentsMsg.classList.add("hidden");
  }

  payments.forEach((payment) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4";
    card.innerHTML = `
      <p class="font-semibold text-opay-navy">₦${payment.amount}</p>
      <p class="text-xs text-gray-400 mt-1">Paid: ${formatTimestamp(payment.createdAt)}</p>
    `;
    paymentList.appendChild(card);
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

  document.getElementById("addLoanBtn").href = `add-loan.html?customerId=${customer.id}`;
  document.getElementById("recordPaymentBtn").href = `record-payment.html?customerId=${customer.id}`;

  renderLoans(customer.id);
}

loadCustomer();
