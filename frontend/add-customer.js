document.getElementById("saveBtn").addEventListener("click", () => {
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const addressInput = document.getElementById("addressInput");
  const nameError = document.getElementById("nameError");

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();

  if (name === "") {
    nameError.classList.remove("hidden");
    return;
  }

  nameError.classList.add("hidden");

  const customers = JSON.parse(localStorage.getItem("customers") || "[]");

  customers.push({
    id: Date.now(),
    name: name,
    phone: phone,
    address: address,
    balance: 0,
  });

  localStorage.setItem("customers", JSON.stringify(customers));

  window.location.href = "customers.html";
});
