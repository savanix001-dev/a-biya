document.getElementById("logoutBtn").addEventListener("click", () => {
  const confirmed = confirm("Are you sure you want to log out? Your customer and loan data will stay saved on this device.");
  if (!confirmed) return;

  localStorage.removeItem("phoneNumber");
  localStorage.removeItem("loginPin");

  window.location.href = "index.html";
});
