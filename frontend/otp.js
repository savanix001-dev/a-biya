document.addEventListener("DOMContentLoaded", () => {
  const phone = sessionStorage.getItem("phoneNumber");
  const phoneDisplay = document.getElementById("phoneDisplay");
  const boxes = document.querySelectorAll(".otp-box");
  const errorMsg = document.getElementById("errorMsg");
  const verifyBtn = document.getElementById("verifyBtn");

  if (phone) {
    phoneDisplay.textContent = "Code sent to " + phone;
  } else {
    phoneDisplay.textContent = "Code sent to your phone";
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

  verifyBtn.addEventListener("click", () => {
    const code = Array.from(boxes).map(b => b.value).join("");

    if (code.length !== 6) {
      errorMsg.classList.remove("hidden");
      return;
    }

    errorMsg.classList.add("hidden");
    alert("Code entered: " + code + "\n(Next step will verify this with the backend)");
  });
});
