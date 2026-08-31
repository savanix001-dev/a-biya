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

function loadDashboard() {
  const name = localStorage.getItem("businessName") || localStorage.getItem("phoneNumber");
  document.getElementById("welcomeMsg").textContent = `Welcome, ${name}`;

  const customers = getCustomers();
  const loans = getLoans();
  const payments = getPayments();

  const totalLoaned = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const total = totalLoaned - totalPaid;
  document.getElementById("totalOutstanding").textContent = `₦${total.toLocaleString()}`;

  const today = new Date().toISOString().split("T")[0];

  const dueTodayCustomerIds = new Set();
  const overdueCustomerIds = new Set();

  customers.forEach((customer) => {
    const balance = getCustomerBalance(customer.id, loans, payments);
    if (balance <= 0) return;

    const customerLoans = loans.filter((l) => String(l.customerId) === String(customer.id));
    customerLoans.forEach((loan) => {
      if (!loan.dueDate) return;
      if (loan.dueDate === today) {
        dueTodayCustomerIds.add(customer.id);
      } else if (loan.dueDate < today) {
        overdueCustomerIds.add(customer.id);
      }
    });
  });

  const dueTodayCard = document.getElementById("dueTodayCard");
  const overdueCard = document.getElementById("overdueCard");
  const dueTodayText = document.getElementById("dueTodayText");
  const overdueText = document.getElementById("overdueText");

  if (dueTodayCustomerIds.size > 0) {
    dueTodayText.textContent = `${dueTodayCustomerIds.size} payment(s) due today`;
    dueTodayText.className = "text-orange-600 font-semibold text-sm";
    dueTodayCard.className = "block bg-orange-50 border border-orange-400 rounded-xl p-4 mt-4";
    dueTodayCard.href = dueTodayCustomerIds.size === 1
      ? `customer-detail.html?id=${[...dueTodayCustomerIds][0]}`
      : "reports.html";
  } else {
    dueTodayText.textContent = "No payments due today";
    dueTodayText.className = "text-gray-500 font-semibold text-sm";
    dueTodayCard.className = "block bg-white border border-gray-200 rounded-xl p-4 mt-4";
    dueTodayCard.href = "reports.html";
  }

  if (overdueCustomerIds.size > 0) {
    overdueText.textContent = `${overdueCustomerIds.size} customer(s) overdue`;
    overdueText.className = "text-red-600 font-semibold text-sm";
    overdueCard.className = "block bg-red-50 border border-red-400 rounded-xl p-4 mt-4";
    overdueCard.href = overdueCustomerIds.size === 1
      ? `customer-detail.html?id=${[...overdueCustomerIds][0]}`
      : "reports.html";
  } else {
    overdueText.textContent = "No overdue customers";
    overdueText.className = "text-gray-500 font-semibold text-sm";
    overdueCard.className = "block bg-white border border-gray-200 rounded-xl p-4 mt-4";
    overdueCard.href = "reports.html";
  }
}

loadDashboard();
