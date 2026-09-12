function getCustomers() {
  return getLocal("local_customers");
}

function getLoans() {
  return getLocal("local_loans");
}

function getPayments() {
  return getLocal("local_payments");
}

function getCustomerBalance(customerId, loans, payments) {
  const customerLoans = loans.filter((l) => String(l.customer_id) === String(customerId));
  const customerPayments = payments.filter((p) => String(p.customer_id) === String(customerId));
  const totalLoaned = customerLoans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalPaid = customerPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  return totalLoaned - totalPaid;
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

  const today = new Date().toISOString().split("T")[0];

  const dueTodayList = document.getElementById("dueTodayList");
  const noDueTodayMsg = document.getElementById("noDueTodayMsg");
  const overdueList = document.getElementById("overdueList");
  const noOverdueMsg = document.getElementById("noOverdueMsg");

  dueTodayList.innerHTML = "";
  overdueList.innerHTML = "";

  const dueTodayCustomers = [];
  const overdueCustomers = [];

  customers.forEach((customer) => {
    const balance = getCustomerBalance(customer.id, loans, payments);
    if (balance <= 0) return;

    const customerLoans = loans.filter((l) => String(l.customer_id) === String(customer.id));
    const isDueToday = customerLoans.some((loan) => loan.due_date === today);
    const isOverdue = customerLoans.some((loan) => loan.due_date && loan.due_date < today);

    if (isDueToday) dueTodayCustomers.push({ customer, balance });
    if (isOverdue) overdueCustomers.push({ customer, balance });
  });

  if (dueTodayCustomers.length === 0) {
    noDueTodayMsg.classList.remove("hidden");
  } else {
    noDueTodayMsg.classList.add("hidden");
  }

  dueTodayCustomers.forEach(({ customer, balance }) => {
    const card = document.createElement("a");
    card.href = `customer-detail.html?id=${customer.id}`;
    card.className = "block bg-orange-50 border border-orange-400 rounded-xl p-4";
    card.innerHTML = `
      <p class="font-semibold text-opay-navy">${customer.name}</p>
      <p class="text-sm text-gray-500">${customer.phone || "No phone"}</p>
      <p class="text-sm text-orange-600 font-semibold mt-1">Owes ₦${balance.toLocaleString()} (Due Today)</p>
    `;
    dueTodayList.appendChild(card);
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

async function refreshAndReloadReports() {
  await Promise.all([refreshCustomersGenericFromBackend(), refreshLoansFromBackend(), refreshPaymentsFromBackend()]);
  loadReports();
}

refreshAndReloadReports();
