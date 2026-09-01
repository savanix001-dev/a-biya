function loadSettings() {
  document.getElementById("nameInput").value = localStorage.getItem("businessName") || "";
  document.getElementById("phoneInput").value = localStorage.getItem("businessPhone") || localStorage.getItem("phoneNumber") || "";
  document.getElementById("addressInput").value = localStorage.getItem("businessAddress") || "";

  const savedLogo = localStorage.getItem("businessLogo");
  if (savedLogo) {
    const preview = document.getElementById("logoPreview");
    preview.src = savedLogo;
    preview.classList.remove("hidden");
  }
}

loadSettings();

let selectedLogoData = null;

document.getElementById("logoInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    selectedLogoData = reader.result;
    const preview = document.getElementById("logoPreview");
    preview.src = selectedLogoData;
    preview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const address = document.getElementById("addressInput").value.trim();

  if (name) localStorage.setItem("businessName", name);
  if (phone) localStorage.setItem("businessPhone", phone);
  if (address) localStorage.setItem("businessAddress", address);
  if (selectedLogoData) localStorage.setItem("businessLogo", selectedLogoData);

  const savedMsg = document.getElementById("savedMsg");
  savedMsg.classList.remove("hidden");
  setTimeout(() => savedMsg.classList.add("hidden"), 2000);
});
