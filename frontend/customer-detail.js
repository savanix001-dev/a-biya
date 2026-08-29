function getCustomerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
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
}

loadCustomer();
