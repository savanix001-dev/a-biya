function getCustomers() {
  const data = localStorage.getItem("customers");
  return data ? JSON.parse(data) : [];
}

function renderCustomers(filter = "") {
  const list = document.getElementById("customerList");
  const emptyMsg = document.getElementById("emptyMsg");
  const customers = getCustomers();

  const filtered = customers.filter((c) => {
    const term = filter.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.phone && c.phone.toLowerCase().includes(term))
    );
  });

  list.innerHTML = "";

  if (filtered.length === 0) {
    emptyMsg.classList.remove("hidden");
  } else {
    emptyMsg.classList.add("hidden");
  }

  filtered.forEach((c) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4 flex justify-between items-center";
    card.innerHTML = `
      <div>
        <p class="font-semibold text-opay-navy">${c.name}</p>
        <p class="text-sm text-gray-500">${c.phone || "No phone"}</p>
      </div>
      <p class="font-bold text-opay-navy">₦0</p>
    `;
    list.appendChild(card);
  });
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  renderCustomers(e.target.value);
});

renderCustomers();
