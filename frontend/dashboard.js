function getLoans() {
  const data = localStorage.getItem("loans");
  return data ? JSON.parse(data) : [];
}

function getPayments() {
  const data = localStorage.getItem("payments");
  return data ? JSON.parse(data) : [];
}

function loadDashboard() {
  const name = localStorage.getItem("businessName") || localStorage.getItem("phoneNumber");
  document.getElementById("welcomeMsg").textContent = `Welcome, ${name}`;

  const totalLoaned = getLoans().reduce((sum, l) => sum + Number(l.amount), 0);
  const totalPaid = getPayments().reduce((sum, p) => sum + Number(p.amount), 0);
  const total = totalLoaned - totalPaid;
  document.getElementById("totalOutstanding").textContent = `₦${total.toLocaleString()}`;
}

loadDashboard();
