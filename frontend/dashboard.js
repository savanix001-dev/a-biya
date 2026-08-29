document.addEventListener("DOMContentLoaded", () => {
  const welcomeMsg = document.getElementById("welcomeMsg");
  const name = localStorage.getItem("businessName");

  welcomeMsg.textContent = "Welcome, " + (name || "there");
});
