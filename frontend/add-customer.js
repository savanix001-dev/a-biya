document.getElementById("saveBtn").addEventListener("click", async () => {
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const addressInput = document.getElementById("addressInput");
  const nameError = document.getElementById("nameError");
  const saveBtn = document.getElementById("saveBtn");

  if (saveBtn.disabled) return;

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();

  if (name === "") {
    nameError.classList.remove("hidden");
    return;
  }

  nameError.classList.add("hidden");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  const localId = makeLocalId();
  const newCustomer = {
    id: localId,
    synced: false,
    name: name,
    phone: phone,
    address: address,
    balance: 0
  };

  const customers = getLocal("local_customers");
  customers.push(newCustomer);
  setLocal("local_customers", customers);

  queueChange("create_customer", localId, { name: name, phone: phone, address: address, client_reference: localId });

  await syncPendingChanges();

  window.location.href = "customers.html";
});
