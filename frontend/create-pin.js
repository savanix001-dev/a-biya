document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".pin-box");
  const errorMsg = document.getElementById("errorMsg");
  const nextBtn = document.getElementById("nextBtn");
  const stepTitle = document.getElementById("stepTitle");
  const stepSubtitle = document.getElementById("stepSubtitle");

  let firstPin = null;
  let isConfirmStep = false;

  function clearBoxes() {
    boxes.forEach(b => b.value = "");
    boxes[0].focus();
  }

  boxes.forEach((box, index) => {
    box.addEventListener("input", () => {
      box.value = box.value.replace(/\D/g, "");
      if (box.value && index < boxes.length - 1) {
        boxes[index + 1].focus();
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && index > 0) {
        boxes[index - 1].focus();
      }
    });
  });

  nextBtn.addEventListener("click", () => {
    const pin = Array.from(boxes).map(b => b.value).join("");

    if (pin.length !== 6) {
      errorMsg.textContent = "Please enter all 6 digits";
      errorMsg.classList.remove("hidden");
      return;
    }

    if (!isConfirmStep) {
      firstPin = pin;
      isConfirmStep = true;
      stepTitle.textContent = "Confirm Your PIN";
      stepSubtitle.textContent = "Enter the same 6-digit PIN again";
      errorMsg.classList.add("hidden");
      clearBoxes();
      return;
    }

    if (pin !== firstPin) {
      errorMsg.textContent = "PINs do not match. Try again.";
      errorMsg.classList.remove("hidden");
      clearBoxes();
      isConfirmStep = false;
      firstPin = null;
      stepTitle.textContent = "Create Login PIN";
      stepSubtitle.textContent = "Choose a 6-digit PIN to log in next time";
      return;
    }

    localStorage.setItem("loginPin", pin);
    window.location.href = "profile.html";
  });
});
