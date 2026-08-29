function getCustomerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("customerId");
}

const customerId = getCustomerIdFromUrl();
document.getElementById("cancelBtn").href = `customer-detail.html?id=${customerId}`;

document.getElementById("saveBtn").addEventListener("click", () => {
  const amountInput = document.getElementById("amountInput");
  const dateGivenInput = document.getElementById("dateGivenInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const amountError = document.getElementById("amountError");

  const amount = amountInput.value.trim();
  const dateGiven = dateGivenInput.value;
  const dueDate = dueDateInput.value;

  if (amount === "" || Number(amount) <= 0) {
    amountError.classList.remove("hidden");
    return;
  }

  amountError.classList.add("hidden");

  const loans = JSON.parse(localStorage.getItem("loans") || "[]");

  loans.push({
    id: Date.now(),
    customerId: customerId,
    amount: amount,
    dateGiven: dateGiven || new Date().toISOString().split("T")[0],
    dueDate: dueDate || null,
  });

  localStorage.setItem("loans", JSON.stringify(loans));

  window.location.href = `customer-detail.html?id=${customerId}`;
});
