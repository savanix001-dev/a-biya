function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    loanId: params.get("loanId"),
    customerId: params.get("customerId"),
  };
}

const { loanId, customerId } = getParams();
document.getElementById("backBtn").href = `customer-detail.html?id=${customerId}`;

const templates = {
  english: "Hello [Customer Name], this is a friendly reminder that your payment of ₦[Amount] was due on [Due Date] and is currently overdue. Please kindly make the payment as soon as possible. If you have already made the payment, please disregard this message. Thank you.",
  hausa: "Sannu [Customer Name], wannan tunatarwa ce cewa biyan kuɗin ₦[Amount] da ya kamata a biya ranar [Due Date] ya wuce. Don Allah a yi ƙoƙarin biyan kuɗin da wuri. Idan kun riga kun biya, ku yi watsi da wannan saƙon. Na gode.",
  yoruba: "Ẹ káàrọ̀ [Customer Name], a fẹ́ rán yín létí pé owó ₦[Amount] tí ẹ yẹ kí ẹ san ní [Due Date] ti pé. Ẹ jọ̀ọ́, ẹ gbìyànjú láti san owó náà ní kíákíá. Tí ẹ bá ti san án tẹ́lẹ̀, ẹ má ṣe kọbi ara sí ìránṣẹ́ yìí. Ẹ ṣé.",
  igbo: "Ndewo [Customer Name], nke a bụ ncheta na ụgwọ ₦[Amount] nke a tụrụ anya ka ị kwụọ na [Due Date] agafeela. Biko, gbalịa kwụọ ụgwọ ahụ ozugbo enwere ike. Ọ bụrụ na ị kwụọla ụgwọ ahụ, biko leghara ozi a anya. Daalụ.",
  pidgin: "Hello [Customer Name], na small reminder say your payment of ₦[Amount] wey you suppose pay on [Due Date] don pass due date. Abeg try make the payment as soon as you fit. If you don already pay, abeg ignore this message. Thank you.",
};

function getCustomer() {
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  return customers.find((c) => String(c.id) === String(customerId));
}

function getLoan() {
  const loans = JSON.parse(localStorage.getItem("loans") || "[]");
  return loans.find((l) => String(l.id) === String(loanId));
}

function buildMessage(language) {
  const customer = getCustomer();
  const loan = getLoan();
  const template = templates[language];

  return template
    .replaceAll("[Customer Name]", customer ? customer.name : "Customer")
    .replaceAll("[Amount]", loan ? loan.amount : "0")
    .replaceAll("[Due Date]", loan ? loan.dueDate : "");
}

function loadReminder() {
  const customer = getCustomer();
  if (customer) {
    document.getElementById("customerNameLabel").textContent = `For: ${customer.name}`;
  }

  const phoneSection = document.getElementById("phoneSection");
  if (!customer || !customer.phone) {
    phoneSection.classList.remove("hidden");
  }

  document.getElementById("messageInput").value = buildMessage("english");
}

document.getElementById("languageSelect").addEventListener("change", (e) => {
  document.getElementById("messageInput").value = buildMessage(e.target.value);
});

loadReminder();

function formatPhoneForWhatsApp(phone) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = "234" + digits.slice(1);
  }
  return digits;
}

document.getElementById("sendBtn").addEventListener("click", () => {
  const customer = getCustomer();
  const message = document.getElementById("messageInput").value;

  let phone = customer && customer.phone ? customer.phone : document.getElementById("phoneInput").value.trim();

  if (!phone) {
    alert("Please enter the customer's phone number.");
    return;
  }

  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  window.open(url, "_blank");
});
