function getCustomerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("customerId");
}

const customerId = getCustomerIdFromUrl();
document.getElementById("backBtn").href = `customer-detail.html?id=${customerId}`;

function getCustomer() {
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  return customers.find((c) => String(c.id) === String(customerId));
}

function getLoans() {
  const data = localStorage.getItem("loans");
  return data ? JSON.parse(data) : [];
}

function getPayments() {
  const data = localStorage.getItem("payments");
  return data ? JSON.parse(data) : [];
}

function formatTimestamp(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString();
}

const customer = getCustomer();
if (customer) {
  document.getElementById("customerNameLabel").textContent = `For: ${customer.name}`;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const fromDate = document.getElementById("fromDateInput").value;
  const toDate = document.getElementById("toDateInput").value;

  const allLoans = getLoans()
    .filter((l) => String(l.customerId) === String(customerId))
    .map((l) => ({ type: "loan", ...l }));

  const allPayments = getPayments()
    .filter((p) => String(p.customerId) === String(customerId))
    .map((p) => ({ type: "payment", ...p }));

  const allHistory = [...allLoans, ...allPayments];

  const filtered = allHistory.filter((entry) => {
    if (!entry.createdAt) return true;
    const entryDate = entry.createdAt.split("T")[0];
    if (fromDate && entryDate < fromDate) return false;
    if (toDate && entryDate > toDate) return false;
    return true;
  });

  filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));

  document.getElementById("statementCustomerName").textContent = customer ? customer.name : "";
  document.getElementById("statementCustomerPhone").textContent = customer && customer.phone ? customer.phone : "";

  let periodText = "All time";
  if (fromDate && toDate) periodText = `${fromDate} to ${toDate}`;
  else if (fromDate) periodText = `From ${fromDate}`;
  else if (toDate) periodText = `Up to ${toDate}`;
  document.getElementById("statementPeriod").textContent = periodText;

  const statementList = document.getElementById("statementList");
  statementList.innerHTML = "";

  if (filtered.length === 0) {
    statementList.innerHTML = `<p class="text-gray-400">No transactions in this period.</p>`;
  }

  filtered.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "bg-white rounded-lg shadow p-3 flex justify-between items-center";
    const label = entry.type === "loan" ? "Loan Given" : "Payment Received";
    const color = entry.type === "loan" ? "text-opay-green" : "text-orange-500";
    row.innerHTML = `
      <div>
        <p class="text-xs font-semibold ${color}">${label}</p>
        <p class="text-xs text-gray-400">${formatTimestamp(entry.createdAt)}</p>
      </div>
      <p class="font-semibold ${entry.type === "loan" ? "text-opay-green" : "text-orange-500"}">${entry.type === "loan" ? "+" : "-"}₦${entry.amount}</p>
    `;
    statementList.appendChild(row);
  });

  const totalLoanedPeriod = filtered.filter((e) => e.type === "loan").reduce((sum, e) => sum + Number(e.amount), 0);
  const totalPaidPeriod = filtered.filter((e) => e.type === "payment").reduce((sum, e) => sum + Number(e.amount), 0);

  const totalLoanedAll = allLoans.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalPaidAll = allPayments.reduce((sum, e) => sum + Number(e.amount), 0);
  const overallBalance = totalLoanedAll - totalPaidAll;

  document.getElementById("statementTotalLoaned").textContent = `₦${totalLoanedPeriod.toLocaleString()}`;
  document.getElementById("statementTotalPaid").textContent = `₦${totalPaidPeriod.toLocaleString()}`;
  document.getElementById("statementBalance").textContent = `₦${overallBalance.toLocaleString()}`;

  document.getElementById("filterSection").classList.add("hidden");
  document.getElementById("statementView").classList.remove("hidden");
});

document.getElementById("editFilterBtn").addEventListener("click", () => {
  document.getElementById("statementView").classList.add("hidden");
  document.getElementById("filterSection").classList.remove("hidden");
});

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});
