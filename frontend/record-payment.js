function getCustomerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("customerId");
}

function getLoans() {
  const data = localStorage.getItem("loans");
  return data ? JSON.parse(data) : [];
}

function getPayments() {
  const data = localStorage.getItem("payments");
  return data ? JSON.parse(data) : [];
}

function getBalance(customerId) {
  const loans = getLoans().filter((l) => String(l.customerId) === String(customerId));
  const payments = getPayments().filter((p) => String(p.customerId) === String(customerId));
  const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  return totalLoaned - totalPaid;
}

const customerId = getCustomerIdFromUrl();
document.getElementById("cancelBtn").href = `customer-detail.html?id=${customerId}`;

function loadCustomerInfo() {
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const customer = customers.find((c) => String(c.id) === String(customerId));
  if (customer) {
    document.getElementById("customerNameLabel").textContent = `For: ${customer.name}`;
  }
  const balance = getBalance(customerId);
  document.getElementById("currentBalance").textContent = `₦${balance.toLocaleString()}`;
}

loadCustomerInfo();

let enteredAmount = null;
let enteredDate = null;

document.getElementById("amountInput").addEventListener("input", (e) => {
  const amount = Number(e.target.value);
  const balance = getBalance(customerId);
  const warning = document.getElementById("overpayWarning");

  if (amount > balance && balance > 0) {
    const over = amount - balance;
    warning.textContent = `This will overpay by ₦${over.toLocaleString()}`;
    warning.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
  }
});

document.getElementById("continueBtn").addEventListener("click", () => {
  const amountInput = document.getElementById("amountInput");
  const datePaidInput = document.getElementById("datePaidInput");
  const amountError = document.getElementById("amountError");

  const amount = amountInput.value.trim();
  const datePaid = datePaidInput.value;

  if (amount === "" || Number(amount) <= 0) {
    amountError.classList.remove("hidden");
    return;
  }

  amountError.classList.add("hidden");
  enteredAmount = amount;
  enteredDate = datePaid || new Date().toISOString().split("T")[0];

  document.getElementById("formStep").classList.add("hidden");
  document.getElementById("pinStep").classList.remove("hidden");
});

document.getElementById("backBtn").addEventListener("click", () => {
  document.getElementById("pinStep").classList.add("hidden");
  document.getElementById("formStep").classList.remove("hidden");
  document.getElementById("pinInput").value = "";
  document.getElementById("pinError").classList.add("hidden");
});

document.getElementById("confirmBtn").addEventListener("click", () => {
  const pinInput = document.getElementById("pinInput");
  const pinError = document.getElementById("pinError");
  const savedPin = localStorage.getItem("loginPin");

  if (pinInput.value !== savedPin) {
    pinError.classList.remove("hidden");
    return;
  }

  const payments = JSON.parse(localStorage.getItem("payments") || "[]");

  payments.push({
    id: Date.now(),
    customerId: customerId,
    amount: enteredAmount,
    datePaid: enteredDate,
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem("payments", JSON.stringify(payments));

  window.location.href = `customer-detail.html?id=${customerId}`;
});
