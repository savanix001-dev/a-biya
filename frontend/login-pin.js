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

  loginBtn.addEventListener("click", async () => {
    const enteredPin = Array.from(boxes).map(b => b.value).join("");
    const phone = localStorage.getItem("phoneNumber") || "";

    if (enteredPin.length !== 4) {
      errorMsg.textContent = "Please enter all 4 digits";
      errorMsg.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone, pin: enteredPin })
      });

      const data = await response.json();

      if (!response.ok) {
        errorMsg.textContent = data.detail || "Incorrect PIN. Try again.";
        errorMsg.classList.remove("hidden");
        clearBoxes();
        return;
      }

      errorMsg.classList.add("hidden");
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("loginPin", enteredPin);
      window.location.href = "dashboard.html";
    } catch (error) {
      errorMsg.textContent = "Could not connect to the server. Please check your connection.";
      errorMsg.classList.remove("hidden");
    }
  });
});
