document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".pin-box");
  const errorMsg = document.getElementById("errorMsg");
  const loginBtn = document.getElementById("loginBtn");
  const welcomeBack = document.getElementById("welcomeBack");

  const name = localStorage.getItem("businessName");
  if (name) {
    welcomeBack.textContent = "Welcome Back, " + name;
  }

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

  loginBtn.addEventListener("click", () => {
    const enteredPin = Array.from(boxes).map(b => b.value).join("");
    const savedPin = localStorage.getItem("loginPin");

    if (enteredPin.length !== 6) {
      errorMsg.textContent = "Please enter all 6 digits";
      errorMsg.classList.remove("hidden");
      return;
    }

    if (enteredPin !== savedPin) {
      errorMsg.textContent = "Incorrect PIN. Try again.";
      errorMsg.classList.remove("hidden");
      clearBoxes();
      return;
    }

    errorMsg.classList.add("hidden");
    window.location.href = "dashboard.html";
  });
});
