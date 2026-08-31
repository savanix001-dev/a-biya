function getCustomers() {
  const data = localStorage.getItem("customers");
  return data ? JSON.parse(data) : [];
}

function getLoans() {
  const data = localStorage.getItem("loans");
  return data ? JSON.parse(data) : [];
}

function getPayments() {
  const data = localStorage.getItem("payments");
  return data ? JSON.parse(data) : [];
}

function getCustomerBalance(customerId, loans, payments) {
  const customerLoans = loans.filter((l) => String(l.customerId) === String(customerId));
  const customerPayments = payments.filter((p) => String(p.customerId) === String(customerId));
  const totalLoaned = customerLoans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalPaid = customerPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  return totalLoaned - totalPaid;
}

function isOverdue(loan, balance) {
  if (!loan.dueDate || balance <= 0) return false;
  const today = new Date().toISOString().split("T")[0];
  return loan.dueDate < today;
}

function loadReports() {
  const customers = getCustomers();
  const loans = getLoans();
  const payments = getPayments();

  document.getElementById("totalCustomers").textContent = customers.length;

  const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOutstanding = totalLoaned - totalCollected;

  document.getElementById("totalLoaned").textContent = `₦${totalLoaned.toLocaleString()}`;
  document.getElementById("totalCollected").textContent = `₦${totalCollected.toLocaleString()}`;
  document.getElementById("totalOutstandingReport").textContent = `₦${totalOutstanding.toLocaleString()}`;

  const overdueList = document.getElementById("overdueList");
  const noOverdueMsg = document.getElementById("noOverdueMsg");
  overdueList.innerHTML = "";

  const overdueCustomers = [];

  customers.forEach((customer) => {
    const balance = getCustomerBalance(customer.id, loans, payments);
    const customerLoans = loans.filter((l) => String(l.customerId) === String(customer.id));
    const hasOverdueLoan = customerLoans.some((loan) => isOverdue(loan, balance));

    if (hasOverdueLoan) {
      overdueCustomers.push({ customer, balance });
    }
  });

  if (overdueCustomers.length === 0) {
    noOverdueMsg.classList.remove("hidden");
  } else {
    noOverdueMsg.classList.add("hidden");
  }

  overdueCustomers.forEach(({ customer, balance }) => {
    const card = document.createElement("a");
    card.href = `customer-detail.html?id=${customer.id}`;
    card.className = "block bg-red-50 border border-red-400 rounded-xl p-4";
    card.innerHTML = `
      <p class="font-semibold text-opay-navy">${customer.name}</p>
      <p class="text-sm text-gray-500">${customer.phone || "No phone"}</p>
      <p class="text-sm text-red-500 font-semibold mt-1">Owes ₦${balance.toLocaleString()} (Overdue)</p>
    `;
    overdueList.appendChild(card);
  });
}

loadReports();

