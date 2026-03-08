window.addEventListener("load", function () {

  const role = localStorage.getItem("role");

  const rollGroup = document.getElementById("roll-group");
  const hostelGroup = document.getElementById("hostel-group");

  if (role === "staff") {
    if (rollGroup) rollGroup.style.display = "none";
    if (hostelGroup) hostelGroup.style.display = "none";
  }

});

let timerInterval;
let timeLeft = 120;


// ---------------- TIMER ----------------

function startTimer() {

  const timerText = document.getElementById("otp-timer");
  const resendBtn = document.getElementById("resend-btn");

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
  button.disabled = true;
  button.innerText = "Sending OTP...";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const hostel = document.getElementById("hostel").value.trim();
  const mobile = document.getElementById("mobile").value.trim();

  if (!email.endsWith("@nitkkr.ac.in")) {

    alert("Only NIT KKR email IDs allowed");

    button.disabled = false;
    button.innerText = "Send OTP";

    return;

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
        roll,
        hostel,
        mobile
      })

    });

    const data = await res.json();

    if (!res.ok) {

      alert(data.message || "Failed to send OTP");

      button.disabled = false;
      button.innerText = "Send OTP";

      return;

    }

    // Lock input fields
    document.getElementById("name").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("roll").disabled = true;
    document.getElementById("hostel").disabled = true;
    document.getElementById("mobile").disabled = true;

    // Show OTP popup
    document.getElementById("otp-modal").style.display = "flex";

    alert(data.message);

    startTimer();

  } catch (error) {

    console.error("OTP Error:", error);

    alert("Server error while sending OTP");

    button.disabled = false;
    button.innerText = "Send OTP";

  }

}


// ---------------- RESEND OTP ----------------

function resendOTP() {

  sendOTP();

}


// ---------------- VERIFY OTP ----------------

async function verifyOTP() {

  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;

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

      window.location.href = "dashboard.html";

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.error("Verify OTP Error:", error);

    alert("Verification failed");

  }

}
