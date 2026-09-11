function getCustomerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("customerId");
}

const customerId = getCustomerIdFromUrl();
document.getElementById("cancelBtn").href = `customer-detail.html?id=${customerId}`;

document.getElementById("saveBtn").addEventListener("click", async () => {
  const amountInput = document.getElementById("amountInput");
  const itemInput = document.getElementById("itemInput");
  const dateGivenInput = document.getElementById("dateGivenInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const amountError = document.getElementById("amountError");
  const saveBtn = document.getElementById("saveBtn");

  if (saveBtn.disabled) return;

  const amount = amountInput.value.trim();
  const item = itemInput.value.trim();
  const dateGiven = dateGivenInput.value;
  const dueDate = dueDateInput.value;

  if (amount === "" || Number(amount) <= 0) {
    amountError.classList.remove("hidden");
    return;
  }

  amountError.classList.add("hidden");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  const localId = makeLocalId();
  const newLoan = {
    id: localId,
    synced: false,
    customer_id: customerId,
    amount: amount,
    item: item || null,
    date_given: dateGiven || new Date().toISOString().split("T")[0],
    due_date: dueDate || null,
    created_at: new Date().toISOString()
  };

  const loans = getLocal("local_loans");
  loans.push(newLoan);
  setLocal("local_loans", loans);

  queueChange("create_loan", localId, {
    customer_id: Number(customerId),
    amount: amount,
    item: item || null,
    date_given: dateGiven || null,
    due_date: dueDate || null,
    client_reference: localId
  });

  await syncPendingChanges();

  window.location.href = `customer-detail.html?id=${customerId}`;
});
