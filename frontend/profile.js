document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const continueBtn = document.getElementById("continueBtn");
  const skipBtn = document.getElementById("skipBtn");

  async function registerAndGoToDashboard(businessName) {
    const phone = localStorage.getItem("phoneNumber") || sessionStorage.getItem("phoneNumber") || "";
    const pin = localStorage.getItem("loginPin") || "";

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone, pin: pin, business_name: businessName })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Registration failed. Please try again.");
        return;
      }

      localStorage.setItem("businessName", businessName);
      localStorage.setItem("ownerId", data.id);
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Could not connect to the server. Please check your connection and try again.");
    }
  }

  continueBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    registerAndGoToDashboard(name);
  });

  skipBtn.addEventListener("click", () => {
    const phone = localStorage.getItem("phoneNumber") || sessionStorage.getItem("phoneNumber") || "";
    registerAndGoToDashboard(phone);
  });
});
