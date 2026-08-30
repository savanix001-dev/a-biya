function getCustomerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

const customerId = getCustomerIdFromUrl();
document.getElementById("cancelBtn").href = `customer-detail.html?id=${customerId}`;

function getCustomers() {
  const data = localStorage.getItem("customers");
  return data ? JSON.parse(data) : [];
}

function loadCustomer() {
  const customers = getCustomers();
  const customer = customers.find((c) => String(c.id) === String(customerId));

  if (!customer) return;

  document.getElementById("nameInput").value = customer.name;
  document.getElementById("phoneInput").value = customer.phone || "";
  document.getElementById("addressInput").value = customer.address || "";
}

loadCustomer();

document.getElementById("saveBtn").addEventListener("click", () => {
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const addressInput = document.getElementById("addressInput");
  const nameError = document.getElementById("nameError");

  const name = nameInput.value.trim();

  if (name === "") {
    nameError.classList.remove("hidden");
    return;
  }

  nameError.classList.add("hidden");

  const customers = getCustomers();
  const index = customers.findIndex((c) => String(c.id) === String(customerId));

  if (index !== -1) {
    customers[index].name = name;
    customers[index].phone = phoneInput.value.trim();
    customers[index].address = addressInput.value.trim();
    localStorage.setItem("customers", JSON.stringify(customers));
  }

  window.location.href = `customer-detail.html?id=${customerId}`;
});
