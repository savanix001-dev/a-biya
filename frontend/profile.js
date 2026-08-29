document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const continueBtn = document.getElementById("continueBtn");
  const skipBtn = document.getElementById("skipBtn");

  function goToDashboard(name) {
    localStorage.setItem("businessName", name);
    window.location.href = "dashboard.html";
  }

  continueBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    goToDashboard(name);
  });

  skipBtn.addEventListener("click", () => {
    const phone = localStorage.getItem("phoneNumber") || sessionStorage.getItem("phoneNumber") || "";
    goToDashboard(phone);
  });
});
