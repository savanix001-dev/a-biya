document.getElementById("continueBtn").addEventListener("click", () => {
  const currentPinInput = document.getElementById("currentPinInput");
  const currentPinError = document.getElementById("currentPinError");
  const savedPin = localStorage.getItem("loginPin");

  if (currentPinInput.value !== savedPin) {
    currentPinError.classList.remove("hidden");
    return;
  }

  currentPinError.classList.add("hidden");
  document.getElementById("currentPinStep").classList.add("hidden");
  document.getElementById("newPinStep").classList.remove("hidden");
});

document.getElementById("savePinBtn").addEventListener("click", () => {
  const newPinInput = document.getElementById("newPinInput");
  const confirmPinInput = document.getElementById("confirmPinInput");
  const newPinError = document.getElementById("newPinError");

  const newPin = newPinInput.value.trim();
  const confirmPin = confirmPinInput.value.trim();

  if (newPin.length !== 6 || newPin !== confirmPin) {
    newPinError.classList.remove("hidden");
    return;
  }

  newPinError.classList.add("hidden");
  localStorage.setItem("loginPin", newPin);

  document.getElementById("newPinStep").classList.add("hidden");
  document.getElementById("successMsg").classList.remove("hidden");

  setTimeout(() => {
    window.location.href = "more.html";
  }, 1500);
});
