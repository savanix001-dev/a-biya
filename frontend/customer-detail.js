function getCustomerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getLoans() {
  const data = localStorage.getItem("loans");
  return data ? JSON.parse(data) : [];
}

function renderLoans(customerId) {
  const loans = getLoans().filter((l) => String(l.customerId) === String(customerId));
  const loanList = document.getElementById("loanList");
  const noLoansMsg = document.getElementById("noLoansMsg");

  loanList.innerHTML = "";

  if (loans.length === 0) {
    noLoansMsg.classList.remove("hidden");
    return;
  }

  noLoansMsg.classList.add("hidden");

  loans.forEach((loan) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4";
    card.innerHTML = `
      <p class="font-semibold text-opay-navy">₦${loan.amount}</p>
      <p class="text-sm text-gray-500">Due: ${loan.dueDate || "No due date"}</p>
    `;
    loanList.appendChild(card);
  });
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

  renderLoans(customer.id);
}

loadCustomer();
