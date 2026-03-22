window.addEventListener("load", function () {

  const role = localStorage.getItem("role");

  const hostelGroup = document.getElementById("hostel-group");

  if (role === "staff") {
    if (hostelGroup) hostelGroup.style.display = "none";
  }

});

let timerInterval;
let timeLeft = 120;


// ---------------- TIMER ----------------

function startTimer() {

  const timerText = document.getElementById("otp-timer");
  const resendBtn = document.getElementById("resend-btn");

  if (!timerText || !resendBtn) return;

  resendBtn.disabled = true;
  timeLeft = 120;

  timerInterval = setInterval(() => {

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timerText.textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      timerText.textContent = "00:00";
      resendBtn.disabled = false;
    }

  }, 1000);

}


// ---------------- SEND OTP ----------------

async function sendOTP() {

  const button = document.querySelector("button[onclick='sendOTP()']");
  if (button) {
    button.disabled = true;
    button.innerText = "Sending OTP...";
  }

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const hostelInput = document.getElementById("hostel");
  const mobileInput = document.getElementById("mobile");

  if (!emailInput) return;

  const name = nameInput?.value.trim() || "";
  const email = emailInput.value.trim();
  const hostel = hostelInput?.value.trim() || "";
  const mobile = mobileInput?.value.trim() || "";

  // ✅ Email validation
  if (!email.endsWith("@nitkkr.ac.in")) {

    alert("Only NIT KKR email IDs allowed");

    resetButton(button);
    return;
  }

  // 🔥 FIXED VALIDATION (ONLY FOR VISIBLE FIELDS)
  if (nameInput && nameInput.offsetParent !== null) {

    if (!name) {
      alert("Please enter your name");
      resetButton(button);
      return;
    }

    if (hostelInput && hostelInput.offsetParent !== null && !hostel) {
      alert("Please enter hostel");
      resetButton(button);
      return;
    }

    if (mobileInput && mobileInput.offsetParent !== null && !mobile) {
      alert("Please enter mobile number");
      resetButton(button);
      return;
    }
  }

  try {

    const res = await fetch("https://nitkkr-marketplace-api.onrender.com/api/auth/send-otp", {

      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name,
        email,
        role: "student",
        hostel,
        mobile
      })

    });

    const data = await res.json();

    if (!res.ok) {

      alert(data.message || "Failed to send OTP");
      resetButton(button);
      return;
    }

    // 🔒 Lock inputs safely
    if (nameInput) nameInput.disabled = true;
    emailInput.disabled = true;
    if (hostelInput) hostelInput.disabled = true;
    if (mobileInput) mobileInput.disabled = true;

    // Show OTP popup
    const modal = document.getElementById("otp-modal");
    if (modal) modal.style.display = "flex";

    alert(data.message);

    startTimer();

  } catch (error) {

    console.error("OTP Error:", error);
    alert("Server error");

  } finally {

    resetButton(button);
  }

}


// ---------------- RESEND OTP ----------------

function resendOTP() {
  sendOTP();
}


// ---------------- VERIFY OTP ----------------

async function verifyOTP() {

  const emailInput = document.getElementById("email");
  const otpInput = document.getElementById("otp");

  if (!emailInput || !otpInput) return;

  const email = emailInput.value.trim();
  const otp = otpInput.value.trim();

  try {

    const res = await fetch("https://nitkkr-marketplace-api.onrender.com/api/auth/verify-otp", {

      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        otp
      })

    });

    const data = await res.json();

    if (data.token) {

      localStorage.setItem("token", data.token);

      const role = localStorage.getItem("role") || "student";
      localStorage.setItem("role", role);

      window.location.href = "dashboard.html";

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.error("Verify OTP Error:", error);
    alert("Verification failed");

  }

}


// 🔧 HELPER FUNCTION
function resetButton(button) {
  if (button) {
    button.disabled = false;
    button.innerText = "Send OTP";
  }
}