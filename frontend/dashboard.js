function getCustomers() {
  const data = localStorage.getItem("customers");
  return data ? JSON.parse(data) : [];
}

function getLoans() {
  const data = localStorage.getItem("loans");
  return data ? JSON.parse(data) : [];
}

function loadDashboard() {
  const name = localStorage.getItem("businessName") || localStorage.getItem("phoneNumber");
  document.getElementById("welcomeMsg").textContent = `Welcome, ${name}`;

  const loans = getLoans();
  const total = loans.reduce((sum, l) => sum + Number(l.amount), 0);
  document.getElementById("totalOutstanding").textContent = `₦${total.toLocaleString()}`;
}

loadDashboard();
