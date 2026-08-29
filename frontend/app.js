document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("phoneInput");
  const errorMsg = document.getElementById("errorMsg");
  const continueBtn = document.getElementById("continueBtn");

  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
  });

  continueBtn.addEventListener("click", () => {
    const phone = phoneInput.value.trim();
    const isValid = /^0[789][01]\d{8}$/.test(phone);

    if (!isValid) {
      errorMsg.classList.remove("hidden");
      phoneInput.classList.add("border-red-500");
      return;
    }

    errorMsg.classList.add("hidden");
    phoneInput.classList.remove("border-red-500");

    // Save the phone number temporarily so the next screen can show it
    sessionStorage.setItem("phoneNumber", phone);

    // Go to the OTP screen
    window.location.href = "otp.html";
  });
});
