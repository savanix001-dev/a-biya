function getCustomerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("customerId");
}

function getBalance(customerId) {
  const loans = getLocal("local_loans").filter((l) => String(l.customer_id) === String(customerId));
  const payments = getLocal("local_payments").filter((p) => String(p.customer_id) === String(customerId));
  const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  return totalLoaned - totalPaid;
}

const customerId = getCustomerIdFromUrl();
document.getElementById("cancelBtn").href = `customer-detail.html?id=${customerId}`;

function loadCustomerInfo() {
  const customers = getLocal("local_customers");
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

document.getElementById("confirmBtn").addEventListener("click", async () => {
  const pinInput = document.getElementById("pinInput");
  const pinError = document.getElementById("pinError");
  const confirmBtn = document.getElementById("confirmBtn");
  const savedPin = localStorage.getItem("loginPin");

  if (confirmBtn.disabled) return;

  if (pinInput.value !== savedPin) {
    pinError.classList.remove("hidden");
    return;
  }

  pinError.classList.add("hidden");
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Saving...";

  const localId = makeLocalId();
  const newPayment = {
    id: localId,
    synced: false,
    customer_id: customerId,
    amount: enteredAmount,
    date_paid: enteredDate,
    created_at: new Date().toISOString()
  };

  const payments = getLocal("local_payments");
  payments.push(newPayment);
  setLocal("local_payments", payments);

  queueChange("create_payment", localId, {
    customer_id: Number(customerId),
    amount: enteredAmount,
    date_paid: enteredDate,
    client_reference: localId
  });

  await syncPendingChanges();

  window.location.href = `customer-detail.html?id=${customerId}`;
});
